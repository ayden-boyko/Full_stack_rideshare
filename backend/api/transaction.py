from flask import abort
from flask_restful import Resource, reqparse, request  #NOTE: Import from flask_restful, not python

from db.db_utils import *

from db.rideshare import *

class TransactionInfoRider(Resource):

    parser = reqparse.RequestParser()
    parser.add_argument('id')
    parser.add_argument('amount')
    parser.add_argument('timestamp')
    """gets the reciepts,
      if a user requests more reciepts than than they have taken rides,
      they receive all their reciepts"""
    def get(self, id, amount, timestamp):
        try:
            rider_info = get_rider(id).get_json()
            allreceipts = get_bills(rider_info[0], rider_info[1]).get_json()
            amount = min(int(amount), len(allreceipts))
            receipts = allreceipts[:amount]
            return receipts
        except Exception as e:
            abort(400, message=f"Error occurred while fetching receipts: {str(e)}")
    
    def post(self, id, amount, timestamp):
        if id is None:
            abort(400, message="Rider id cannot be null.")
        if amount is None:
            abort(400, message="Amount cannot be null.")
        if timestamp is None:
            abort(400, message="Timestamp cannot be null.")
        rider = get_rider(id)
        if rider is None:
            abort(400, message="Rider not found.")
        return charge(id, rider[1], amount, timestamp)

class TransactionInfoDriver(Resource):

    parser = reqparse.RequestParser()
    parser.add_argument('id')
    parser.add_argument('amount')
    """gets the reciepts,
      if a user requests more reciepts than than they have taken rides,
      they receive all their reciepts"""
    def get(self, id, amount):
        try:
            allreceipts = get_owed(id).get_json()
            amount = min(int(amount), len(allreceipts))
            receipts = allreceipts[:amount]
            return receipts
        except Exception as e:
            abort(400, message=f"Error occurred while fetching receipts: {str(e)}")
    
