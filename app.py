from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, emit

SITE_NAME = "Listening Room"
AUTHOR = "Seth Mabbott"

app = Flask(__name__)
app.config['SECRET_KEY'] = "change_this"

socketio = SocketIO(app)

# keep track of details that define a room. 
# It's ok if this object is not persistant since it is updated any time a client connects or disconnects
voices = {}
users = {}

# ROUTES #

# Home
@app.route("/")
def index():
    return render_template("rooms/1.html")

# SOCKETIO ROUTES #
# @socketio.on("connect")
# def handle_connect(d):
    # TODO: what information do we get about the client here?
    # how might those map to a voice on the front end?
    # When a client connects, broadcast a "room state object" to all clients describing parameters for the room
# socketio.emit("state_update",  room_status)

# FIXME: if the client refreshes there is a connection error
@socketio.on('join')
def handle_join(d):
    emit("add_voice", d)


@socketio.on("message")
def handle_message(msg):
    print("message received: ", msg)
    socketio.emit("reveived message: " + msg )


if __name__ == "__main__":
    #app.run(host="0.0.0.0", port=5000, debug=True)
    socketio.run(app, debug=True)
