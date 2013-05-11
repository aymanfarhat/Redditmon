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

def get_subreddits():
	""" Gets a list of all available subreddits in the db """
	client = MongoClient()
	db = client[database]
	return filter(lambda x: x != "system.indexes", map(str,db.collection_names()))
	
def get_log_single(subreddit,date):
	""" Gets all logs of a subreddit on a single date """
	client = MongoClient()
	db = client[database]
	results = db[subreddit].find({'time':{"$gte":date,"$lt":date+timedelta(days=1)}})
	return [json.dumps(doc, default=json_util.default) for doc in results]

def get_log_range(subreddit,start_date,end_date):
	""" Gets subreddit logs of all days within the selected range inclusive """
	client = MongoClient()
	db = client[database]
	results = db[subreddit].find({'time':{"$gte":start_date,"$lt":end_date+timedelta(days=1)}})
	return [json.dumps(doc, default=json_util.default) for doc in results]
