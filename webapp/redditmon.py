from flask import Flask, request, render_template
import dbutil

# Configuration
DEBUG = True

app = Flask(__name__)
app.config.from_object(__name__)
app.config.from_envvar('FLASK_SETTINGS', silent=True)

@app.route("/")
def index():
	subreddits = dbutil.get_subreddits()
	return render_template("index.html",subreddits=subreddits)

if __name__ == "__main__":
	app.run()
