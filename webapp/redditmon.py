from flask import Flask, request, render_template, Response
import dbutil
from datetime import datetime
import json 
import validate

# Configuration
DEBUG = True

app = Flask(__name__)
app.config.from_object(__name__)
app.config.from_envvar('FLASK_SETTINGS', silent=True)

@app.route("/")
def index():
	subreddits = dbutil.get_subreddits()
	return render_template("index.html",subreddits=subreddits)

@app.route("/logs")
def get_logs():
	# parameter values
	subreddit = request.args.get('subreddit',None)
	start = request.args.get('start', None)
	end = request.args.get('end', None)
	
	# Default reply
	reply = '{"status":"fail","data":"The parameters or values you submitted are invalid, please recheck your input."}'

	if validate.nonempty_list_vals([subreddit,start,end]) and validate.date(start) and validate.date(end):
		if start == end:
			resultset = dbutil.get_log_single(subreddit,datetime.strptime(start, '%Y-%m-%d'))
		else:
			resultset = dbutil.get_log_range(subreddit,datetime.strptime(start,'%Y-%m-%d'),datetime.strptime(end,'%Y-%m-%d'))
		reply = '{"status":"success","data":{"logs":'+resultset+'}}'
	
	return Response(reply,status=200,mimetype='application/json')

if __name__ == "__main__":
	app.run()
