from flask_restful import Resource, reqparse, request  #NOTE: Import from flask_restful, not python

from db.swen344_db_utils import *

from db.rideshare import *

class TransactionInfo(Resource):
    """gets the reciepts,
      if a user requests more reciepts than than they have taken rides,
      they receive all their reciepts"""
    def get(self):
        id = int(request.args['id'])
        max = int(request.args['reciepts'])
        rider_info = get_rider(id)
        allreceipts = get_bills(rider_info[0], rider_info[1])
        allreceipts = allreceipts[0]
        if max > len(allreceipts):
            max = len(allreceipts)
        receipts = [None] * max
        for i in range(max-1):
            receipts[i] = allreceipts[i]
        return receipts
