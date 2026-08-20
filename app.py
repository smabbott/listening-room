from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, emit
import uuid

SITE_NAME = "Listening Room"
AUTHOR = "Seth Mabbott"

app = Flask(__name__)
app.config['SECRET_KEY'] = "change_this"

socketio = SocketIO(app)

# A global dictionary to track all connected clients
# TODO: 
# It's not necessary to keep this in a database since it is all ephemeral anyway
voices = {}
aliases = {}

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
# sid changes between page refreshes. 
@socketio.on('join')
def handle_join(d):
    # TODO: emit 1 event that broadcasts to all clients
    # another that initializes the client that triggered?
    # store objects in some sort of database
    cpu = d['cpu'].lower()
    generator = "Voice"
    if cpu.find("linux") > -1:
        generator = "Buzzard"
    elif cpu.find("windows") > -1:
        generator = "Voice"
    
    voice = {
        "voice": generator,
        "rhythm": d['productSub'],
        "melody":d['timestamp']
        # TODO: more parameters
    }
    alias = str(uuid.uuid4())[:8]
    aliases[request.sid] = alias
    voices[alias] = voice

    emit("add_voice", voice, broadcast=True)
    # TODO: emit to just the newly connected client the full object of voices


@socketio.on("message")
def handle_message(msg):
    print("message received: ", msg)
    socketio.emit("reveived message: " + msg )


# TODO: handle disconnections

if __name__ == "__main__":
    #app.run(host="0.0.0.0", port=5000, debug=True)
    socketio.run(app, debug=True)
