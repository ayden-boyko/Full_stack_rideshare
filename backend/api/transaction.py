from flask_restful import Resource, reqparse, request  #NOTE: Import from flask_restful, not python

from db.db_utils import *

from db.rideshare import *

class TransactionInfo(Resource):

    parser = reqparse.RequestParser()
    parser.add_argument('id')
    parser.add_argument('amount')
    parser.add_argument('timestamp')
    """gets the reciepts,
      if a user requests more reciepts than than they have taken rides,
      they receive all their reciepts"""
    def get(self, id, amount, time):
        rider_info = get_rider(id)
        rider_info = rider_info.get_json()
        allreceipts = get_bills(rider_info[0], rider_info[1])
        allreceipts = allreceipts.get_json()
        if int(amount) > len(allreceipts):
            amount = len(allreceipts)
        receipts = [None] * amount
        for i in range(amount):
            receipts[i] = allreceipts[i]
        return receipts
    
    def post(self, id, amount, time):
        rider = get_rider(id)
        return charge(id, rider[1], amount, time)
