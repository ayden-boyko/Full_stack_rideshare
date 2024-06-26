from flask import abort
from flask_restful import Resource, reqparse, request  #NOTE: Import from flask_restful, not python

from db.db_utils import *

from db.example import *

class Init(Resource):
    def post(self):
        try:
            rebuild_tables()
        except Exception as e:
            abort(500, message=f"Error occurred during table rebuild: {str(e)}")

class Version(Resource):
    def get(self):
        try:
            version = exec_get_one('SELECT VERSION()')
            if version is None:
                abort(500, message="Failed to retrieve database version")
            return version
        except Exception as e:
            abort(500, message=f"Error occurred during database version retrieval: {str(e)}")

