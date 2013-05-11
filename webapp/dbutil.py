"""Simple module for abstracting the mongo queries in to callable functions"""
import pymongo
from pymongo import MongoClient

# Some settings
db = "redditmon"

def get_subreddits():
	""" Gets a list of all available subreddits in the db """
	client = MongoClient()
	db = client["redditmon"]
	return filter(lambda x: x != "system.indexes", map(str,db.collection_names()))
	

