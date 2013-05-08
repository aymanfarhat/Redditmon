import datetime
import time
import urllib2
import json
from threading import Thread
from decorators import retry

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

def get_queue():
	f = open("subreddits.in")
	lines = f.readlines()
	f.close()
	return map(lambda s: s.strip('\n'),lines)

def log(path,string):
	with open(path,"a") as f:
		f.write(string+"\n")

def get_numbers(subreddit):
	@retry(urllib2.URLError, tries=4,delay=5,backoff=2)
	def get_data():
		hdr = {'User-Agent':'Sub-reddit checker bot by /u/aymanf'}	
		request = urllib2.Request("http://www.reddit.com/r/"+subreddit+"/about.json",headers = hdr)
		raw = urllib2.urlopen(request)
		
		return raw
	
	data = json.load(get_data())
	return ";".join(map(str,[datetime.datetime.now().strftime("%Y-%m-%d %H:%M"), data[u'data'][u'subscribers'], data[u'data'][u'accounts_active']]))

queue = get_queue()

def process_queue():
	for sub in queue:
		data = get_numbers(sub)
		log("logs/"+sub+".out",data)
		print sub
		time.sleep(10)

process = MonitorThread(600,process_queue)
process.start()
