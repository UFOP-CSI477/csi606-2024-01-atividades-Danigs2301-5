from .credentials import *
from .Model import Model
from bson import ObjectId

class ModelUser(Model):
    def __init__(self):
        self.collection = database['users']
        self.cities = database['cities']
        self.types = database['blood_type']
        self.donations = database['donations']
        self.objects_type = ["_id", "city_id", "type_id"]

    def post(self, data):
        city_id = data["city_id"]
        type_id = data["type_id"]
        try:
            if self.validate_data(city_id, self.cities) and self.validate_data(type_id, self.types):
                data["city_id"] = ObjectId(city_id)
                data["type_id"] = ObjectId(type_id)
                self.collection.insert_one(data)
                return {"message" : "Creation realized"}, 201
            else:
                return {"message" : "type_id or city_id doesnt exist"}, 400
        except Exception as e:
            return e, 400
        
    def patch(self, _id, data):
        flag = True
        try:
            if self.validate_data(_id, self.collection):
                if "city_id" in data["$set"]:
                    city_id = data["$set"]["city_id"]
                    if not self.validate_data(city_id, self.cities):
                        flag = False
                    else:
                        data["$set"]["city_id"] = ObjectId(city_id)

                if "type_id" in data["$set"]:
                    type_id = data["$set"]["type_id"]
                    if not self.validate_data(type_id, self.types):
                        flag = False
                    else:
                        data["$set"]["type_id"] = ObjectId(type_id)

                if flag:
                    self.collection.update_one({"_id" : _id}, data)
                    return {"message" : "Update realized"}, 200
                
                if not flag:
                    return {"message" : "City or type doesnt exist"}, 400
            else:
                return {"message" : "Id doesnt exist"}, 400
            
        except Exception as e:
            return e, 400
        
    def delete(self, _id):
        try:
            if not self.validate_data(_id, self.donations, "user_id"):
                self.collection.delete_one({"_id" : _id})
                return {"message" : "Delete realized"}, 200
            else:
                return {"message" : "User have donations asociated"}, 400
        except Exception as e:
            return e, 400

    
