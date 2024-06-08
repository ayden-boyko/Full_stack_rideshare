from flask_restful import Resource, reqparse, request, abort  #NOTE: Import from flask_restful, not python

from db.db_utils import *

from db.rideshare import *

class AccountDriver(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('id')
    parser.add_argument('zipcode')

    def get(self, id):

        return get_reviews(id, 'driver')

    def put(self, id, zipcode):

        return update_zipcode('driver', id, zipcode)



class AccountRider(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('id')
    parser.add_argument('zipcode')

    def get(self, id):

        return get_reviews(id, 'rider')
        
    def put(self, id, zipcode):

        return update_zipcode('rider', id, zipcode)
