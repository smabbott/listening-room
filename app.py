from flask import Flask, render_template
from flask_socketio import SocketIO

SITE_NAME = "Listening Room"
AUTHOR = "Seth Mabbott"

app = Flask(__name__)

socketio = SocketIO(app)
# ROUTES #

# Home
@app.route("/")
def home():
    return render_template("rooms/1.html")

# SOCKETIO ROUTES #
@socketio.on("connect")
def handle_connect():
    print("connected")
    # When a client connects, broadcast a "room state object" to all clients describing parameters for the room

@socketio.on("message")
def handle_message(msg):
    print("message received: ", msg)
    socketio.emit("reveived message: " + msg )


if __name__ == "__main__":
    #app.run(host="0.0.0.0", port=5000, debug=True)
    socketio.run(app, debug=True)
