from flask import Flask, request, render_template

# Configuration
DEBUG = True

app = Flask(__name__)
app.config.from_object(__name__)
app.config.from_envvar('FLASK_SETTINGS', silent=True)

@app.route("/")
def index():
	return render_template("index.html")

if __name__ == "__main__":
	app.run()
