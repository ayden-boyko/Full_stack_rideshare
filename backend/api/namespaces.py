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
        print('rider data:', data)
        room = data[0]
        r_sid = data[1]
        username = data[2]
        
        join_room(room)
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
        print('data:',data)
        sendee = data['sendee']
        string = data["string"]
        sender_name = data["sender"]
        sender_id = data['driver_id']
        sender_rating = data['rating']
        sender_sid = data["sender_id"]
        cost = data['cost']
        room = data['room']
        print('Rider has recieved data:', string, 'FROM', sender_name)
        emit('recieved', {'driver_Name':sender_name, 'driver_Id': sender_id , 'driver_Rating': sender_rating,'sender_sid':sender_sid, 'cost':cost, 'room':room}, namespace='/rider', to=sendee)

    def on_end(data):
        data = json.loads(data)
        print('data:',data)
        sendee = data["sendee"]
        sender_name = data["sender"]
        print('Ride has finished', 'BY', sender_name)
        emit('finish', namespace='/rider', to=sendee)

    def on_cancel(data):
        data = json.loads(data)
        print('data:',data)
        sendee = data["sendee"]
        sender_name = data["sender"]
        print('Ride has been canceled', 'BY', sender_name)
        emit('canceled', namespace='/rider', to=sendee)



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
        room = data[1][1]
        print('driver data:', data)
        join_room(room)
        print(username + " has joined room #" + room)
        #emit('join', [room, data[2], data[3]], namespace='/rider', room=data[2]) #room num, rider_socketid, rider_name

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
        emit('recieved', (sender + " says " + string), namespace='/driver', to=sendee)

    def on_end(data):
        data = json.loads(data)
        print('data:',data)
        sendee = data['sendee']
        emit('finish', namespace='/rider', to=sendee)