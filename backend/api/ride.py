from flask_restful import Resource, reqparse, request, abort  #NOTE: Import from flask_restful, not python

from db.db_utils import *

from db.rideshare import *



class RideSingleRiderPre(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('zipcode')

    """all methods accociated with rider info"""
    def get(self, zipcode):
        """Retrieves available drivers in the specified zipcode."""
        if not zipcode:
            abort(400, message="Zipcode cannot be empty.")

        drivers = get_new_drivers(zipcode)
        if not drivers:
            abort(500, message="Failed to retrieve drivers.")

        return drivers
    
class RideSingleDriverPre(Resource):

    """all methods accociated with rider info"""
    def get(self):
        """Retrieves available riders."""
        riders = get_available_riders()
        if riders is None:
            abort(500, message="Failed to retrieve available riders.")
        return riders


class RideSingleRider(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('rider_id')
    parser.add_argument('rider_name')
    parser.add_argument('start')
    parser.add_argument('end')
    parser.add_argument('socket_id')

    """returns driver chosen"""
    def get(self, rider_id):
        """Retrieve the current ride for a rider."""
        if rider_id is None:
            abort(404, message="Rider ID cannot be null.")

        ride = get_current_ride(rider_id)
        return ride

    """sets wants_ride to true"""
    def put(self, rider_id, rider_name, start, end, socket_id):
        if any(param is None for param in (rider_id, rider_name, start, end, socket_id)):
            abort(400, message="All parameters cannot be null.")
        
        try:
            return get_next_ride(rider_id, start, end, socket_id)
        except Exception as error:
            abort(500, f"Failed to get next ride: {error}")
    
    """USELESS FOR RIDER THEY CANT CREATE RIDES"""
    #def post(self, id, name, start, end):
        #drivers = get_available_driver() #returns list of all availabe driver, figure out how to choose one
        # use sockets to notify rider
        #return new_ride(id, name, drivers[0][0], drivers[0][1], drivers[0][3], start, end)
    
    """cancels ride"""
    def delete(self, rider_id, rider_name):
        if not rider_id or not rider_name:
            abort(400, message="Rider identifier and name are required.")
        try:
            return cancel_ride(rider_id, rider_name)
        except Exception:
            abort(500, message="Failed to cancel ride.")


    
class RideSingleDriver(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('driver_id')
    parser.add_argument('driver_name')
    parser.add_argument('rider_id')
    parser.add_argument('zipcode')
    parser.add_argument('start')
    parser.add_argument('end')

    """finds new rider"""
    def get(self, zipcode):
        if zipcode is None:
            abort(400, message="Zipcode cannot be null.")

        new_rider = get_new_rider(zipcode)
        if new_rider is None:
            abort(500, message="Failed to get new rider.")

        return new_rider
    
    
    """creates new ride"""
    def post(self, driver_id, name, rider_id, start, end, zipcode):
        if any(param is None for param in (driver_id, name, rider_id, start, end, zipcode)):
            abort(400, message="All parameters cannot be null.")
        try:
            return new_ride(driver_id, name, rider_id, start, end)
        except Exception as error:
            abort(500, message=f"Failed to create new ride: {error}")
    
    """cancels ride"""
    def delete(self, rider_id, zipcode):
        rider = get_rider(rider_id)
        if rider is None:
            abort(400, message="Rider not found.")
        try:
            return cancel_ride(rider[0], rider[1])
        except Exception as error:
            abort(500, message=f"Failed to cancel ride: {error}")
    
class RideSingleRiderPost(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('rider_id')
    parser.add_argument('review')
    parser.add_argument('rating')
    parser.add_argument('review_of_driver')
    parser.add_argument('time')
    parser.add_argument('carpool')
    parser.add_argument('cost')

    """all methods accociated with rider info"""
    def get(self, rider_id):
        """Retrieve the reviews for a rider."""
        if rider_id is None:
            abort(400, message="Rider ID cannot be null.")
        return get_reviews(rider_id, 'rider')
    
    """creates new ride"""
    def post(self, rider_id, rating, review_of_driver, time, carpool, cost):
        if any(param is None for param in (rider_id, rating, review_of_driver, time, carpool, cost)):
            abort(400, message="All parameters cannot be null.")
        try:
            return rider_finish_ride(rider_id, rating, review_of_driver, time, carpool, cost)
        except Exception:
            abort(500, message="Failed to finish ride")
    
    """cancels ride"""
    def put(self, rider_id, review, rating=None, review_of_driver=None, time=None, carpool=None, cost=None):
        if any(param is None for param in (rider_id, review)):
            abort(400, message="Rider ID and review cannot be null.")
        try:
            return respond(rider_id, 'rider', review,)
        except Exception:
            abort(500, message="Failed to leave review")
    

class RideSingleDriverPost(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('driver_id')
    parser.add_argument('rider_id')
    parser.add_argument('review')
    parser.add_argument('rating')
    parser.add_argument('review_of_rider')
    parser.add_argument('time')
    parser.add_argument('carpool')
    parser.add_argument('cost')

    """all methods accociated with rider info"""
    def get(self, driver_id):
        """Retrieve the reviews for a driver."""
        if driver_id is None:
            abort(400, message="Driver ID cannot be null.")
        return get_reviews(driver_id, 'driver')
    
    """creates new ride"""
    def post(self, driver_id, rider_id, rating, review_of_rider, time, carpool, cost):
        if any(param is None for param in (driver_id, rider_id, rating, review_of_rider, time, carpool, cost)):
            abort(400, message="All parameters cannot be null.")
        try:
            return driver_finish_ride(driver_id, rider_id, rating, review_of_rider, time, carpool, cost)
        except Exception as error:
            abort(500, message=f"Failed to finish ride: {error}")
    
    """cancels ride"""
    def put(self, driver_id, review, rider_id=None, rating=None, review_of_rider=None, time=None, carpool=None, cost=None):
        if any(param is None for param in (driver_id, review)):
            abort(400, message="Rider ID and review cannot be null.")
        try:
            return respond(driver_id, 'driver', review)
        except Exception as error:
            abort(500, message=f"Failed to leave review: {error}")
    
    