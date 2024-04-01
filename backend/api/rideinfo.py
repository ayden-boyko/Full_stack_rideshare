from flask_restful import Resource, reqparse, request  #NOTE: Import from flask_restful, not python

from db.swen344_db_utils import *

from db.rideshare import *

class RideInfo(Resource):
    """gets all past rides"""
    def get(self):
        return get_past_rides()