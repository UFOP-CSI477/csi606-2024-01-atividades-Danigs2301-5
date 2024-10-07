from bson import ObjectId
from pymongo import MongoClient

class Model:
    def __init__(self):
        self.mongo_host = 'localhost'
        self.mongo_port = 27017
        self.client = MongoClient(self.mongo_host, self.mongo_port)
        self.database = self.client['banco_dadosII']

    def get(self):
        objects = list(self.collection.find())
        if len(objects)>0:
            for object in objects:
                for object_type in self.objects_type:
                    object[object_type] = str(object[object_type]) 

            return {"data" : objects}, 200
        else:
            return {"message" : "Database without data"}, 204
    
    def post(self, data):
        try:
            self.collection.insert_one(data)
            return {"message" : "Creation realized"}, 201
        except Exception as e:
            return e, 400
        
    def patch(self, _id, data):
        try:
            if self.validate_data(_id, self.collection):
                self.collection.update_one({"_id" : _id}, data)
                return {"message" : "Update realized"}, 200
            else:
                return {"message" : "Id doesnt exist"}, 400
        except Exception as e:
            return e, 400
        
    def delete(self, _id):
        try:
            if self.validate_data(_id, self.collection):
                self.collection.delete_one({"_id" : _id})
                return {"message" : "Delete realized"}, 200
            else:
                return {"message" : "Id doesnt exist"}, 404
        except Exception as e:
            return e, 400

    def login(self, data):
        try:

            identificador = data["identificador"]
            password = data["password"]

            response = self.collection.find_one({"identificador": identificador})

            if response is None:
                return {"message": "Id or password doesn't exist"}, 404

            if password == response["password"]:
                _id = str(response["_id"])
                return _id, 200
            else:
                return {"message": "Id or password doesn't exist"}, 404


        except Exception as e:
            return {"message": str(e)}, 500

        
    def validate_data(self, data, collection, key = "_id"):
        if key == "_id":
            data = ObjectId(data)


        field = collection.find_one({key: data})
        
        if not field:
            return False
        
        return True     