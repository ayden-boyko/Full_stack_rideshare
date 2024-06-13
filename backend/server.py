from flask import Flask
from flask_restful import Resource, Api
from flask_cors import CORS
from api.hello_world import HelloWorld
from api.management import *
from api.accountinfo import *
from api.rideinfo import *
from api.transaction import *
from api.account import *
from api.ride import *

app = Flask(__name__)
api = Api(app)
cors = CORS(app, resources={
     r'/*': {
         'origins': ["http://127.0.0.1:3000", "http://127.0.0.1:5000"], 
         #supabase databse url, links to localport:3000 or 5000
         'methods': ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']
     }
 })
 
app.config['CORS_HEADERS'] = 'Content-Type'

#--------TO RUN BACKEND----python server.py--------------------

api.add_resource(Init, '/manage/init') #Management API for initializing the DB

api.add_resource(Version, '/manage/version') #Management API for checking DB version

api.add_resource(HelloWorld, '/hello') 

api.add_resource(AccountRiderInfo, '/accountinfo/rider/<string:id>', methods=["PUT", "POST", "GET", "DELETE"])

api.add_resource(AccountDriverInfo, '/accountinfo/driver/<string:id>', methods=["PUT", "POST", "GET", "DELETE"])

api.add_resource(AccountInfoDrivers, '/accountinfo/drivers', methods=["GET"])

api.add_resource(AccountInfoRiders, '/accountinfo/riders', methods=["GET"])

api.add_resource(AccountDriver, '/account/driver/<string:id>/<int:zipcode>', methods=["PUT", "GET"])

api.add_resource(AccountRider, '/account/rider/<string:id>/<int:zipcode>', methods=["PUT", "GET"])

api.add_resource(RideInfo, '/rideinfo', methods=["GET"])

api.add_resource(RideInfoDriver, '/rideinfo/driver/<string:id>/<string:instructions>/<string:name>', methods=["GET", "PUT"])

api.add_resource(RideInfoRider, '/rideinfo/rider/<string:id>/<string:instructions>/<string:name>', methods=["PUT", "GET"])

api.add_resource(RideSingleRiderPre, '/singlerider/pre/<int:zipcode>', methods=[ "GET"]) 

api.add_resource(RideSingleRider, '/singlerider/<string:id>/<string:name>/<string:driver_id>/<int:zipcode>/<string:start>/<string:end>', methods=["PUT", "POST", "GET"]) 

api.add_resource(RideSingleDriver, '/singledriver/<string:id>/<string:name>/<string:rider_id>/<int:zipcode>/<string:start>/<string:end>', methods=["PUT", "POST", "GET"]) 

api.add_resource(RideSingleRiderPost, '/singlerider/post/<string:id>/<string:review>/<int:rating>/<string:rod>/<string:time>/<string:carpool>/<float:cost>', methods=[ "GET", "PUT", "POST"]) 

api.add_resource(RideSingleDriverPost, '/singledriver/post//<string:id>/<string:rid>/<string:review>/<int:rating>/<string:ror>/<string:time>/<string:carpool>/<float:cost>', methods=[ "GET", "PUT", "POST"]) 

api.add_resource(TransactionInfo, '/transaction/reciept/<string:id>/<string:amount>/<string:time>', methods=["POST", "GET"])


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


if __name__ == '__main__':
    rebuild_tables()
    app.run(debug=True)