from flask import Flask, logging
from flask_restful import Resource, Api
from flask_cors import CORS
from flask_socketio import namespace, emit, send, SocketIO
from api.management import *
from api.accountinfo import *
from api.rideinfo import *
from api.transaction import *
from api.account import *
from api.ride import *
from api.namespaces import RiderNamespace, DriverNamespace

#app = Flask(__name__, static_folder='../frontend/public', static_url_path='/')
app = Flask(__name__, static_folder='../frontend/build/static')
api = Api(app)
cors = CORS(app, resources={
     r'/api/*': {
         'origins': [ "*"], 
         #
         'methods': ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
         "allow_headers": ["Content-Type", "Authorization"]
     }
 })
 
# app.config['CORS_HEADERS'] = 'Content-Type'
# app.config['SECRET KEY'] = os.getenv('SECRET_KEY') or VVVVV
app.config.update(
                CORS_HEADERS='Content-Type', 
                SECRET_KEY=os.getenv('SECRET_KEY')
                )

socketio = SocketIO(app,cors_allowed_origins="*")

#--------TO RUN BACKEND----python server.py--------------------

# serves the frontend
api.add_resource(Main, '/', methods=["GET"])

api.add_resource(Init, '/api/manage/init') #Management API for initializing the DB

api.add_resource(Version, '/api/manage/version') #Management API for checking DB version

api.add_resource(AccountInfoRider, '/api/accountinfo/rider/<string:name>/<string:date>/<string:rider_id>/<string:new_instructions>', methods=["PUT", "POST", "GET", "DELETE"])

api.add_resource(AccountInfoDriver, '/api/accountinfo/driver/<string:name>/<string:date>/<string:driver_id>/<string:driver_instructions>', methods=["PUT", "POST", "GET", "DELETE"])

api.add_resource(AccountInfoDrivers, '/api/accountinfo/drivers', methods=["GET"])

api.add_resource(AccountInfoRiders, '/api/accountinfo/riders', methods=["GET"])

api.add_resource(AccountDriver, '/api/account/driver/<string:driver_id>/<int:new_zipcode>', methods=["PUT", "GET"])

api.add_resource(AccountRider, '/api/account/rider/<string:rider_id>/<int:new_zipcode>', methods=["PUT", "GET"])

api.add_resource(RideInfo, '/api/rideinfo', methods=["GET"])

api.add_resource(RideInfoDriver, '/api/rideinfo/driver/<string:id>/<string:instructions>/<string:name>', methods=["GET", "PUT"])

api.add_resource(RideInfoRider, '/api/rideinfo/rider/<string:id>/<string:instructions>/<string:name>', methods=[ "GET", "PUT"])

api.add_resource(RideSingleRiderPre, '/api/singlerider/pre/<string:zipcode>', methods=[ "GET"]) 

api.add_resource(RideSingleDriverPre, '/api/singledriver/pre', methods=[ "GET"]) 

api.add_resource(RideSingleRider, '/api/singlerider/<string:rider_id>/<string:rider_name>/<string:start>/<string:end>/<string:socket_id>', methods=["PUT", "POST", "GET", "DELETE"]) 

api.add_resource(RideSingleDriver, '/api/singledriver/<string:driver_id>/<string:driver_name>/<string:rider_id>/<int:zipcode>/<string:start>/<string:end>', methods=["PUT", "POST", "GET", "DELETE"]) 

api.add_resource(RideSingleRiderPost, '/api/singlerider/post/<string:rider_id>/<string:review>/<int:rating>/<string:review_of_driver>', methods=[ "GET", "PUT", "POST"]) 

api.add_resource(RideSingleDriverPost, '/api/singledriver/post/<string:driver_id>/<string:rider_id>/<string:review>/<string:rating>/<string:review_of_rider>/<string:cost>', methods=[ "GET", "PUT", "POST"]) 

api.add_resource(TransactionInfoRider, '/api/transaction/reciept/rider/<string:id>/<string:amount>/<string:timestamp>', methods=["POST", "GET"])

api.add_resource(TransactionInfoDriver, '/api/transaction/reciept/driver/<string:id>/<string:amount>', methods=[ "GET"])


@app.after_request
def after_request(response):
    #print("response:", response)
    #response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/manifest.json')
def serve_manifest():
    return send_from_directory('../frontend/build', 'manifest.json')

@app.route('/logo192.png')
def serve_logo():
    return send_from_directory('../frontend/build', 'logo192.png')

socketio.on_namespace(RiderNamespace('/rider'))
socketio.on_namespace(DriverNamespace('/driver'))
socketio.on_event('message', RiderNamespace.on_match, namespace='/driver')
socketio.on_event('finish', RiderNamespace.on_end, namespace='/driver') # * triggers end of ride event for rider, updates screen, etc...
socketio.on_event('canceled', RiderNamespace.on_cancel, namespace='/driver') # * notifies rider that their ride has been canceled
socketio.on_event('message', DriverNamespace.on_match, namespace='/rider')
socketio.on_event('chat', DriverNamespace.on_chat, namespace='/rider')
socketio.on_event('chat', RiderNamespace.on_chat, namespace='/driver')

if __name__ == '__main__':
    #rebuild_tables()
    #add_data_CSV('data/users.csv')
    #add_data_JSON('data/users.json')
    # , host='0.0.0.0'
    socketio.run(app, debug=True)