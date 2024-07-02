from flask_socketio import Namespace, emit, send, SocketIO, join_room, leave_room

class RiderNamespace(Namespace):
    def on_connect(self, data):
        print("Rider Connected", data)
        send("connected to RiderNameSpace", namespace='/rider')

    def on_disconnect(self):
        print("Rider Disconnected")

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



class DriverNamespace(Namespace):
    def on_connect(self):
        print("Driver Connected")
        send("connected to DriverNameSpace", namespace='/driver')

    def on_disconnect(self):
        print("Driver Disconnected")

    def on_error(self,e):
        print(e)

    def on_join(self, data):
        username = data[0]
        room = data[1]
        join_room(room)
        print(username + " has joined room #" + room)
        self.emit('join', [room, data[2], data[3]], namespace='/rider', room=data[2]) #room num, rider_socketid, rider_name

    def on_leave(self, data):
        username = data[0]
        room = data[1]
        leave_room(room)
        print(username + " has left room #" + room)
        send(username + " has left room #" + room, to=room)