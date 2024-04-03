from flask_restful import Resource
from db import example
from flask import jsonify

class HelloWorld(Resource):
    def get(self):
        return jsonify({"message" : "testing123"})