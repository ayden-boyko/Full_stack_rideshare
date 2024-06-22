import sys
from flask_socketio import Namespace, emit, send, SocketIO

class RiderNamespace(Namespace):
    def on_connect(self):
        print("Rider Connected")
        send("connected to RiderNameSpace", namespace='/rider')

    def on_disconnect(self):
        print("Rider Disconnected")
        sys.stderr.write("Rider Disconnected")

    def on_error(self,e):
        print(e)
        sys.stderr.write(e)

class DriverNamespace(Namespace):
    def on_connect(self):
        print("Driver Connected")
        send("connected to DriverNameSpace", namespace='/driver')

    def on_disconnect(self):
        print("Rider Disconnected")
        sys.stderr.write("Driver Disconnected")

    def on_error(self,e):
        print(e)
        sys.stderr.write(e)
