from flask import Flask, request, render_template
import pymongo
from pymongo import MongoClient

# Configuration
DEBUG = True

app = Flask(__name__)
app.config.from_object(__name__)
app.config.from_envvar('FLASK_SETTINGS', silent=True)

@app.route("/")
def index():
	# Get list of subreddit names 
	client = MongoClient()
	db = client["redditmon"]
	subreddits = filter(lambda x: x != "system.indexes", map(str,db.collection_names()))
	print subreddits	
	return render_template("index.html",subreddits=subreddits)

if __name__ == "__main__":
	app.run()
