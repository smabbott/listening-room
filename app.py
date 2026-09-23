from flask import Flask, render_template, request, session
from flask_session import Session
from flask_socketio import SocketIO, send, emit
import uuid

SITE_NAME = "Listening Room"
AUTHOR = "Seth Mabbott"

app = Flask(__name__)
app.config['SESSION_PERMANENT']=False
app.config["SESSION_TYPE"]='filesystem'
app.config['SECRET_KEY'] = "change_this"
Session(app)
socketio = SocketIO(app, manage_session=False)

# A global dictionary to track all connected clients
# TODO: 
# It's not necessary to keep this in a database since it is all ephemeral anyway
voices = {}
aliases = {}

# ROUTES #

# Home
@app.route("/")
def index():
    print(session)
    try:
        session['alias']
    except KeyError:
        print('new client. create alias')
        session["alias"] = str(uuid.uuid4())[:8]
    else:
        print("alias exists", session['alias'])

    return render_template("rooms/1.html")

# SOCKETIO ROUTES #
# @socketio.on("connect")
# def handle_connect(d):
    # TODO: what information do we get about the client here?
    # how might those map to a voice on the front end?
    # When a client connects, broadcast a "room state object" to all clients describing parameters for the room
# socketio.emit("state_update",  room_status)

@socketio.on('join')
def handle_join(d):

# look for a corresponding voice in voices
# if there is none, create one 
    try:
        voices[session['alias']]
    except KeyError:
        print("voice is new", session['alias'])
        alias = session['alias']
        cpu = d['cpu'].lower()
        generator = "Voice"
        if cpu.find("linux") > -1:
            generator = "Buzzard"
        elif cpu.find("windows") > -1:
            generator = "Voice"
        # TODO: mac, ios, android, other

        voice = {
            "voice": generator,
            "rhythm": d['productSub'],
            "melody":d['timestamp'],
            "alias":alias
        }

        # TODO: use thread locking
        # aliases[request.sid] = alias 
        voices[alias] = voice
        session['alias'] = alias
        emit("add_voice", voice, broadcast=True)
        emit("init_voices", voices)
    else:
        print('voice exists', session['alias'])
        voice = voices[session['alias']]
        emit("init_voices", voices)
        
    print(voices)


@socketio.on("disconnect")
def handle_disconnect(d):
    print("disconnect")
    # aliases.pop(request.sid)
    try: session['alias']
    except KeyError:
        print("alias not found")
    else:
        voices.pop(session['alias'])
        
        emit("remove_voice", session['alias'])


# TODO: is there a standard way of detecting a disconnection?
# - remove the voice/alias from aliases. broadcast removal to all clients

@socketio.on("message")
def handle_message(msg):
    print("message received: ", msg)
    socketio.emit("reveived message: " + msg )


# TODO: handle disconnections

if __name__ == "__main__":
    #app.run(host="0.0.0.0", port=5000, debug=True)
    socketio.run(app, debug=True)
