from flask import Flask, request, render_template
import dbutil
from datetime import datetime

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
	subreddit = request.args.get('subreddit',None)
	start = request.args.get('start', None)
	end = request.args.get('end', None)

	if subreddit != None and start != None and end != None:
		if start == end:
			resultset = dbutil.get_log_single(subreddit,datetime.strptime(start, '%Y-%m-%d'))
		else:
			resultset = dbutil.get_log_range(subreddit,datetime.strptime(start,'%Y-%m-%d'),datetime.strptime(end,'%Y-%m-%d'))
		return str(resultset)
	else:
		return "Invalid parameters"

if __name__ == "__main__":
	app.run()
