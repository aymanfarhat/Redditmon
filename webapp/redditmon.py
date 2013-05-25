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
    reply = {
        "status":"fail",
        "data":"The parameters/values submitted are invalid, recheck your input."
    }

    if validate.nonempty_list_vals([subreddit,start,end]) and validate.date(start) and validate.date(end):
 
        start_datetime = datetime.strptime(start,'%Y-%m-%d')
        end_datetime = datetime.strptime(end,'%Y-%m-%d')

        if start == end:
            resultset = dbutil.get_log_single(subreddit,start_datetime)
        else:
            resultset = dbutil.get_log_range(subreddit,start_datetime,end_datetime)

        # Success reply
        reply = {
            "status":"success",
            "data":{
                "start":start,
                "end":end,
                "logs":resultset
            }
        }

    return Response(json.dumps(reply),status=200,mimetype='application/json')

if __name__ == "__main__":
    app.run()
