import urllib2
import json
import pymongo
from pymongo import MongoClient
from threading import Thread
from decorators import retry
import time
from datetime import datetime

class MonitorThread(Thread):
    def __init__(self,delay,action):
        self.stopped = False
        self.delay = delay
        self.action = action
        Thread.__init__(self)   
    def run(self):
        while not self.stopped:
            self.action()
            time.sleep(self.delay)

# Get the list of subreddits from file
def get_queue():
    f = open("subreddits.in")
    lines = f.readlines()
    f.close()
    return map(lambda s: s.strip('\n'),lines)

# Logs the results into the appropriate MongoDB collection
def log(database,collection,document):
    client = MongoClient()
    db = client[database]
    subreddit = db[collection]
    subreddit.insert(document)

# Request data from API and create a dictionary with the values
def create_doc(subreddit):
    # Inner function for doing requests
    @retry(urllib2.URLError, tries=4,delay=5,backoff=2)
    def get_data():
        hdr = {'User-Agent':'Sub-reddit checker bot by /u/aymanf'}  
        request = urllib2.Request("http://www.reddit.com/r/"+subreddit+"/about.json",headers = hdr)
        raw = urllib2.urlopen(request)
        return raw
    
    data = json.load(get_data())
    
    return {
        'time': datetime.utcnow().replace(second=0,microsecond=0),
        'subscribers': data[u'data'][u'subscribers'],
        'readers': data[u'data']['accounts_active']
    } 
    
def process_queue():
    queue = get_queue()
    for sub in queue:
        log('redditmon',sub,create_doc(sub))
        print sub
        time.sleep(10)

# Create a thread with sleep delay of 10 minutes
process = MonitorThread(600,process_queue)
process.start()
