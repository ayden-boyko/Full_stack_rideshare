from flask_restful import Resource, reqparse, request, abort  #NOTE: Import from flask_restful, not python

from db.db_utils import *

from db.rideshare import *

class AccountDriver(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('role')
    parser.add_argument('name')
    parser.add_argument('date')
    parser.add_argument('id')
    parser.add_argument('instructions')

    def get(self, id):
        args = self.parser.parse_args()

        id = args['id']
        return get_reviews(id, 'driver')

    def put(self, id):
        args = self.parser.parse_args()

        id = args['id']
        zipcode = args['zipcode']
        return update_zipcode('driver', id, zipcode)

    def post(self, id):
        args = self.parser.parse_args()

        id = args['id']
        instructions = args['instructions']


class AccountRider(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('role')
    parser.add_argument('name')
    parser.add_argument('date')
    parser.add_argument('id')
    parser.add_argument('instructions')

    def get(self, id):
        args = self.parser.parse_args()

        id = args['id']
        return get_reviews(id, 'rider')
        
    def put(self, id):
        args = self.parser.parse_args()

        id = args['id']
        zipcode = args['zipcode']
        return update_zipcode('rider', id, zipcode)

    def post(self, id):
        args = self.parser.parse_args()

        id = args['id']
        instructions = args['instructions']

