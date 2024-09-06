from pymongo import MongoClient

mongo_host = 'localhost'
mongo_port = 27017
client = MongoClient(mongo_host, mongo_port)
database = client['sistemas_webI']