"""Simple module for abstracting the mongo queries in to callable 
functions and serializing results to JSON format"""
import pymongo
from pymongo import MongoClient
from datetime import datetime
from datetime import timedelta
from bson import json_util
import json

# Some settings
database = "redditmon"

# Fields to include and exclude in any query on the logs
logs_projection = {"subscribers":1,"readers":1,"time":1,"_id":0}

def datetime_handler(obj):
	""" Properly formats a datetime field for json_dumps """
	if isinstance(obj,datetime):
		return obj.isoformat()

def get_subreddits():
	""" Gets a list of all available subreddits in the db """
	client = MongoClient()
	db = client[database]
	return filter(lambda x: x != "system.indexes", map(str,db.collection_names()))
	
def get_log_single(subreddit,date):
	""" Gets all logs of a subreddit on a single date """
	client = MongoClient()
	db = client[database]
	results = db[subreddit].find({'time':{"$gte":date,"$lt":date+timedelta(days=1)}},logs_projection)
	return json.dumps([json.dumps(doc, default = datetime_handler) for doc in results])

def get_log_range(subreddit,start_date,end_date):
	""" Gets subreddit logs of all days within the selected range inclusive """
	client = MongoClient()
	db = client[database]
	results = db[subreddit].find({'time':{"$gte":start_date,"$lt":end_date+timedelta(days=1)}},logs_projection)
	return json.dumps([json.dumps(doc, default = datetime_handler) for doc in results])
