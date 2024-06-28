from flask_restful import Resource, reqparse, request, abort  #NOTE: Import from flask_restful, not python

from db.db_utils import *

from db.rideshare import *

class AccountDriver(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('id')
    parser.add_argument('zipcode')

    def get(self, driver_id):
        if driver_id is None:
            abort(400, message="Driver ID cannot be null.")
        return get_reviews(driver_id, 'driver')

    def put(self, driver_id, new_zipcode):
        if driver_id is None:
            abort(400, message="Driver ID cannot be null.")
        if new_zipcode is None:
            abort(400, message="Zipcode cannot be null.")
        return update_zipcode('driver', driver_id, new_zipcode)



class AccountRider(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('id')
    parser.add_argument('zipcode')

    def get(self, rider_id):
        """Retrieve the reviews for a rider."""
        if rider_id is None:
            abort(400, message="Rider ID cannot be null.")
        return get_reviews(rider_id, 'rider')
        
    def put(self, rider_id, new_zipcode):
        """Update the zipcode for a rider."""
        if rider_id is None:
            abort(400, message="Rider ID cannot be null.")
        if new_zipcode is None:
            abort(400, message="New zipcode cannot be null.")
        return update_zipcode('rider', rider_id, new_zipcode)
