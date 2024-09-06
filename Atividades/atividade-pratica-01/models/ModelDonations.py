from .credentials import *
from .Model import Model
from bson import ObjectId

class ModelDonations(Model):
    def __init__(self):
        self.collection = database['donations']
        self.users = database['users']
        self.locations = database['collection_locations']
        self.objects_type = ["_id", "user_id", "location_id"]
    
    def post(self, data):
        user_id = data["user_id"]
        location_id = data["location_id"]
        try:
            if self.validate_data(user_id, self.users) and self.validate_data(location_id, self.locations):
                data["user_id"] = ObjectId(user_id)
                data["location_id"] = ObjectId(location_id)
                self.collection.insert_one(data)
                return {"message" : "Creation realized"}, 201
            
            else:
                return {"error" : "user_id or location_id doesnt exist"}, 400
        except Exception as e:
            return e, 400
        
    def patch(self, _id, data):
        flag = True
        try:
            if self.validate_data(_id, self.collection):
                if "user_id" in data["$set"]:
                    user_id = data["$set"]["user_id"]
                    if not self.validate_data(user_id, self.users):
                        flag = False
                    else:
                        data["$set"]["user_id"] = ObjectId(user_id)
            else:
                return {"message" : "Id doesnt exist"}, 400

            if "location_id" in data["$set"]:
                location_id = data["$set"]["location_id"]
                if not self.validate_data(location_id, self.locations):
                    flag = False
                else:
                    data["$set"]["location_id"] = ObjectId(location_id)

            if flag:
                self.collection.update_one({"_id" : _id}, data)
                return {"message" : "Update realized"}, 200
            
            if not flag:
                return {"error" : "User or location doesnt exist"}, 400
        except Exception as e:
            return e, 400
        
    