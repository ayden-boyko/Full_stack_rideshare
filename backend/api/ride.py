from flask_restful import Resource, reqparse, request, abort  #NOTE: Import from flask_restful, not python

from db.db_utils import *

from db.rideshare import *



class RideSingleRiderPre(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('zipcode')

    """all methods accociated with rider info"""
    def get(self, zipcode):
        return get_new_drivers(zipcode)
    
class RideSingleDriverPre(Resource):

    """all methods accociated with rider info"""
    def get(self):
        return get_available_riders()


class RideSingleRider(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('id')
    parser.add_argument('name')
    parser.add_argument('start')
    parser.add_argument('end')
    parser.add_argument('socket')

    """returns driver chosen"""
    def get(self, id):
        return get_current_ride(id)

    """sets wants_ride to true"""
    def put(self, id, name, start, end, socket):
        return get_next_ride(id, start, end, socket)
    
    """USELESS FOR RIDER THEY CANT CREATE RIDES"""
    def post(self, id, name, start, end):
        drivers = get_available_driver() #returns list of all availabe driver, figure out how to choose one
        # use sockets to notify rider
        return new_ride(id, name, drivers[0][0], drivers[0][1], drivers[0][3], start, end)
    
    """cancels ride"""
    def delete(self, id, name):
        return cancel_ride(id, name)


    
class RideSingleDriver(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('id')
    parser.add_argument('name')
    parser.add_argument('rider_id')
    parser.add_argument('zipcode')
    parser.add_argument('start')
    parser.add_argument('end')

    """finds new rider"""
    def get(self, zipcode):
        return get_new_rider(zipcode)
    
    
    """creates new ride"""
    def post(self, id, name,  rider_id, start, end, zipcode):
        sys
        return new_ride(id, name, rider_id, start, end)
    
    """cancels ride"""
    def delete(self, rider_id, zipcode):
        rider = get_rider(rider_id)
        return cancel_ride(rider[0], rider[1])
    
class RideSingleRiderPost(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('id')
    parser.add_argument('review')
    parser.add_argument('rating')
    parser.add_argument('rod')
    parser.add_argument('time')
    parser.add_argument('carpool')
    parser.add_argument('cost')

    """all methods accociated with rider info"""
    def get(self, id):
        return get_reviews(id, 'rider')
    
    """creates new ride"""
    def post(self, id, rating, rod, time, carpool, cost):
        return rider_finish_ride(id, rating, rod, time, carpool, cost)
    
    """cancels ride"""
    def put(self, id, review):
        return respond(id, 'rider', review)
    

class RideSingleDriverPost(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('id')
    parser.add_argument('rid')
    parser.add_argument('review')
    parser.add_argument('rating')
    parser.add_argument('ror')
    parser.add_argument('time')
    parser.add_argument('carpool')
    parser.add_argument('cost')

    """all methods accociated with rider info"""
    def get(self, id):
        return get_reviews(id, 'driver')
    
    """creates new ride"""
    def post(self, id, rid, rating, ror, time, carpool, cost):
        return rider_finish_ride(id, rid, rating, ror, time, carpool, cost)
    
    """cancels ride"""
    def put(self, id, review):
        return respond(id, 'driver', review)
    
    