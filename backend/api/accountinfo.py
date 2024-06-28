from flask_restful import Resource, reqparse, request, abort  #NOTE: Import from flask_restful, not python

from db.db_utils import *

from db.rideshare import *

class AccountInfoRider(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('role')
    parser.add_argument('name')
    parser.add_argument('date')
    parser.add_argument('id')
    parser.add_argument('instructions')
    
    """all methods accociated with rider info"""
    def get(self, rider_id):
        """Retrieve a rider's information."""
        rider = get_rider(rider_id)
        if not rider:
            abort(404, message="Rider not found.")
        return rider
    

    """changes a riders info"""
    def put(self, rider_id, new_instructions):
        if rider_id is None:
            abort(400, message="Rider id cannot be null.")
        if new_instructions is None:
            abort(400, message="Instructions cannot be null.")
        return update_instructions('rider', rider_id, new_instructions)
    
    """adds a rider"""
    def post(self, name, registration_date):
        if not name:
            abort(400, message="Name cannot be empty.")
        if not registration_date:
            abort(400, message="Registration date cannot be empty.")
        return create_account("rider", name, registration_date)
    
    """deactivates a users account(deletes it)"""
    def delete(self, rider_id):
        rider = get_rider(rider_id)
        if rider is None:
            abort(404, message="Rider not found.")
        try:
            return change_account_status('rider', rider_id)
        except Exception as e:
            abort(500, message=str(e))
    
class AccountInfoDriver(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('role')
    parser.add_argument('name')
    parser.add_argument('date')
    parser.add_argument('id')
    parser.add_argument('instructions')

    """all methods accociated with  driver info"""
    def get(self, driver_id):
        if driver_id is None:
            raise abort(404, message="Driver Id cannot be null.")
        driver = get_driver(driver_id)
        if driver is None:
            raise abort(404, message="Rider not found.")
        return driver
    
    ##
    """changes a drivers info"""
    def put(self, driver_id, driver_instructions):
        if driver_id is None:
            abort(400, message="Driver id cannot be null.")
        if driver_instructions is None:
            abort(400, message="Driver instructions cannot be null.")
        return update_instructions('driver', driver_id, driver_instructions)
    
    ##
    """adds a driver"""
    def post(self, driver_id, name, date):
        if driver_id is None or name is None or date is None:
            abort(400, message="Driver id, name, and registration date cannot be null.")
        return create_account("driver", name, date)
    
    """deactivates a users account(deletes it)"""
    def delete(self, driver_id):
        if driver_id is None:
            raise abort(400, message="Driver id cannot be null.")
        driver = get_driver(driver_id)
        if driver is None:
            raise abort(404, message="Driver not found.")
        try:
            return change_account_status('driver', driver_id)
        except Exception as e:
            raise abort(500, message=str(e))
    
class AccountInfoRiders(Resource):
    """all methods accociated with alls accounts info"""
    def get(self):
        """Retrieves all rider accounts."""
        rider_accounts = get_riders()
        if rider_accounts is None:
            abort(500, message="Failed to retrieve rider accounts.")
        return rider_accounts
    
class AccountInfoDrivers(Resource):
    """all methods accociated with alls accounts info"""
    def get(self):
        """Retrieves all driver accounts."""
        driver_accounts = get_drivers()
        if driver_accounts is None:
            abort(500, message="Failed to retrieve driver accounts.")
        return driver_accounts


