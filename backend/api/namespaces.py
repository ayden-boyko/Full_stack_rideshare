from flask import request
from flask_socketio import Namespace, emit, send, SocketIO, join_room, leave_room
import json

class RiderNamespace(Namespace):
    def on_connect(self):
        print("Rider Connected: " + request.sid)
        send("connected to RiderNameSpace", namespace='/rider')

    def on_disconnect(self):
        print("Rider Disconnected: " + request.sid)

    def on_error(self,e):
        print(e)
    
    def on_join(self, data):
        room = data[0]
        r_sid = data[1]
        username = data[2]
        join_room(room, sid=r_sid)
        print(username + " has joined room #" + room)
        send(username + " has joined room #" + room, to=room)

    def on_leave(self, data):
        username = data[0]
        room = data[1]
        leave_room(room)
        print(username + " has left room #" + room)
        send(username + " has left room #" + room, to=room)
    
    def on_match(data):
        data = json.loads(data)
        sendee = data['sendee']
        string = data["string"]
        sender = data["sender"]
        print('Rider has recieved data:', string, 'FROM', sender)
        emit('recieved', (sender + " says " + string), to=sendee)



class DriverNamespace(Namespace):
    def on_connect(self):
        print("Driver Connected: " + request.sid)
        send("connected to DriverNameSpace", namespace='/driver')

    def on_disconnect(self):
        print("Driver Disconnected: " + request.sid)

    def on_error(self,e):
        print(e)

    def on_join(self, data):
        username = data[0]
        room = data[1]
        join_room(room)
        print(username + " has joined room #" + room)
        emit('join', [room, data[2], data[3]], namespace='/rider', room=data[2]) #room num, rider_socketid, rider_name

    def on_leave(self, data):
        username = data[0]
        room = data[1]
        leave_room(room)
        print(username + " has left room #" + room)
        send(username + " has left room #" + room, to=room)

    def on_match(data):
        data = json.loads(data)
        sendee = data['sendee']
        string = data["string"]
        sender = data["sender"]
        print('Driver has recieved data:', string, 'FROM', sender)
       # emit('match', (sender + " says " + string), to=sendee)