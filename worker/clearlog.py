# Clears contents of all subreddits(collections) in database
import pymongo
from pymongo import MongoClient 

database = "redditmon"

client = MongoClient()
db = client[database]

collections = filter(lambda x: x != "system.indexes", map(str,db.collection_names()))

for collection in collections:
    print "removing %s..." % collection
    db[collection].remove()
    
