#!/usr/bin/env python
import urllib2
import json
import pymongo
from pymongo import MongoClient
from decorators import retry
import time
from datetime import datetime
from crontab import CronTab

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

# If a crontab is not already set, set it and carry on
cmd = '/home/ayman/projects/Redditmon/worker/fetch.sh'
cron = CronTab()

if len(cron.find_command(cmd)) == 0:
    job = cron.new(command = cmd)
    job.minute.every(10)

    cron.write()

# Fetch and log the data for the subreddits
process_queue()
