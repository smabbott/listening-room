from flask import Flask, render_template

SITE_NAME = "Listening Room"
AUTHOR = "Seth Mabbott"

app = Flask(__name__)

# ROUTES #

# Home
@app.route("/")
def home():
    return render_template("rooms/1.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
