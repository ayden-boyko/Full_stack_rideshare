from flask_restful import Resource, reqparse, request, abort  #NOTE: Import from flask_restful, not python

from db.db_utils import *

from db.rideshare import *

class AccountRiderInfo(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('role')
    parser.add_argument('name')
    parser.add_argument('date')
    parser.add_argument('id')
    parser.add_argument('instructions')
    
    """all methods accociated with rider info"""
    def get(self, id):
        return get_rider(id)
    
    ##
    """changes a riders info"""
    def put(self, id):
        args = self.parser.parse_args()

        id = args['id']
        instructions = args['instructions']
        return update_instructions('driver', id, instructions)
    
    ##
    """adds a rider"""
    def post(self, id):
        args = self.parser.parse_args()

        role = args['role']
        name = args['name']
        date = args['date']
        result = get_rider_id(name)
        if (result[0] > 0):
            abort(400)
        return create_account(role, name, date)
    
    """deactivates a users account(deletes it)"""
    def delete(self, id):
        user = get_rider(id)
        if user == None:
            abort(400)
        return deactivate_account('rider', id)
    
class AccountDriverInfo(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('role')
    parser.add_argument('name')
    parser.add_argument('date')
    parser.add_argument('id')
    parser.add_argument('instructions')

    """all methods accociated with  driver info"""
    def get(self, id):
        return get_driver(id)
    
    ##
    """changes a drivers info"""
    def put(self, id):
        args = self.parser.parse_args()

        id = args['id']
        instructions = args['instructions']
        return update_instructions('driver', id, instructions)
    
    ##
    """adds a driver"""
    def post(self, id):
        args = self.parser.parse_args()

        role = args['role']
        name = args['name']
        date = args['date']
        result = get_driver_id(name)
        if (result[0] > 0):
            abort(400)
        return create_account(role, name, date)
    
    """deactivates a users account(deletes it)"""
    def delete(self, id):
        user = get_driver(id)
        if user == None:
            abort(400)
        return deactivate_account('driver', id)
    
class AccountInfoRiders(Resource):
    """all methods accociated with alls accounts info"""
    def get(self):
        return get_riders()
    
class AccountInfoDrivers(Resource):
    """all methods accociated with alls accounts info"""
    def get(self):
        return get_drivers()
