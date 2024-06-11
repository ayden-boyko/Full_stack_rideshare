from flask_restful import Resource, reqparse, request  #NOTE: Import from flask_restful, not python

from db.db_utils import *

from db.rideshare import *

class RideInfo(Resource):
    """gets all past rides"""
    def get(self):
        return get_past_rides()
    
class RideInfoRider(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('id')
    parser.add_argument('instructions')
    parser.add_argument('name')

    def get(self, id, instructions, name):
        return get_past_rides_taken(id, name)
    
    def put(self, id, instructions, name):
        return update_instructions('rider', id, instructions)

class RideInfoDriver(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('id')
    parser.add_argument('instructions')
    parser.add_argument('name')
    
    def get(self, id, instructions, name):
        return get_past_rides_given(id, name)
    
    def put(self, id, instructions, name):
        return update_instructions('driver', id, instructions)
