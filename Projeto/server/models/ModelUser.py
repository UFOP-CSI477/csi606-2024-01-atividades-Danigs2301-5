from .Model import Model
from bson import ObjectId

class ModelUser(Model):
    def __init__(self):
        super().__init__()
        self.collection = self.database['users']
        self.pedidos = self.database['orders']
        self.objects_type = ["_id"]
        
    def post(self, data):
        try:
            if not self.validate_data(data["identificador"], self.collection, "identificador"):
                self.collection.insert_one(data)
                return {"message" : "Creation realized"}, 201
            else:
                return {"message" : "Identification already exists in the system"}, 200
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

    
