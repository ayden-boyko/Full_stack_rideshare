from flask import abort
from flask_restful import Resource, reqparse, request  #NOTE: Import from flask_restful, not python

from backend.db.db_utils import *

from backend.db.rideshare import *

class RideInfo(Resource):
    """gets all past rides"""
    def get(self):
        try:
            result = get_past_rides()
            return result
        except Exception as e:
            abort(500, message=f"Failed to get past rides: {str(e)}")
    
class RideInfoRider(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('id')
    parser.add_argument('instructions')
    parser.add_argument('name')

    def get(self, id, instructions, name):
        if id is None:
            abort(400, message="Rider id cannot be null.")
        if name is None:
            abort(400, message="Name cannot be null.")
        try:
            result = get_past_rides_taken(id, name)
            return result
        except Exception as e:
            abort(500, message=f"Failed to get past rides taken: {str(e)}")
    
    def put(self, id, instructions, name):
        if id is None:
            abort(400, message="Rider id cannot be null.")
        if instructions is None:
            abort(400, message="Instructions cannot be null.")
        try:
            return update_instructions('rider', id, instructions)
        except Exception as e:
            abort(500, message=f"Failed to update instructions: {str(e)}")

class RideInfoDriver(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('id')
    parser.add_argument('instructions')
    parser.add_argument('name')
    
    def get(self, id, instructions, name):
        if id is None:
            abort(400, message="Driver id cannot be null.")
        if name is None:
            abort(400, message="Name cannot be null.")
        try:
            result = get_past_rides_given(id, name)
            return result
        except Exception as e:
            abort(500, message=f"Failed to get past rides given: {str(e)}")
    
    def put(self, id, instructions, name):
        if id is None:
            abort(400, message="Driver id cannot be null.")
        if instructions is None:
            abort(400, message="Instructions cannot be null.")
        try:
            return update_instructions('driver', id, instructions)
        except Exception as e:
            abort(500, message=f"Failed to update instructions: {str(e)}")
