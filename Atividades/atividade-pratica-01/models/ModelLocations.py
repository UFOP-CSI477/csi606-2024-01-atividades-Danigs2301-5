from .credentials import *
from .Model import Model
from bson import ObjectId

class ModelLocations(Model):
    def __init__(self):
        self.collection = database['collection_locations']
        self.cities = database['cities']
        self.donations = database['donations']
        self.objects_type = ["_id", "city_id"]

    def post(self, data):
        validation1 = data["city_id"]
        try:
            if self.validate_data(validation1, self.cities):
                data["city_id"] = ObjectId(data["city_id"])
                self.collection.insert_one(data)
                return {"message" : "Creation realized"}, 201
            else:
                return {"message" : "city_id doesnt exist"}, 400
        except Exception as e:
            return e, 400
        
    def patch(self, _id, data):
        flag = True
        try:
            if "city_id" in data["$set"]:
                city_id = data["$set"]["city_id"]
                if not self.validate_data(city_id, self.cities):
                    flag = False
                else:
                    data["$set"]["city_id"] = ObjectId(city_id)

            if flag:
                if self.validate_data(_id, self.collection):
                    self.collection.update_one({"_id" : _id}, data)
                    return {"message" : "Update realized"}, 200
                else:
                    return {"message" : "Id doesnt exist"}, 400
                
            if not flag:
                return {"message" : "City doesnt exist"}, 400
        except Exception as e:
            return e, 400
        
    def delete(self, _id):
        try:
            if self.validate_data(_id, self.collection):
                self.collection.delete_one({"_id" : _id})
                
                if not self.validate_data(_id, self.donations, "location_id"):
                    self.collection.delete_one({"_id" : _id})
                    return {"message" : "Delete realized"}, 200
                else:
                    return {"message" : "Location have donations asociated"}, 400
            else:
                return {"message" : "Id doesnt exist"}, 404
            
        except Exception as e:
            return e, 400

    
