from bson import ObjectId
from datetime import datetime

class Controller:
    def get(self):
        data = self.model.get()
        return data
    
    def post(self, body):
        if self.validate_data(body, self.attributes):
            response, status = self.model.post(body)
            return response, status
        
        else:
            return {"error" : "Invalid data"}, 400
        
    def patch(self, body):
        update = {}
        _id = ObjectId(body.pop("_id"))
        actual_keys = set(body.keys())

        for key in actual_keys:
            if key not in set(self.attributes_patch):
                return {"error" : "Invalid attributes"}, 400
            
        update["$set"] = body
        response, status = self.model.patch(_id, update)

        return response, status 
    
    def delete(self, body):
        _id = ObjectId(body["_id"])
        if _id is not None:
            response, status = self.model.delete(_id)
            return response, status
        else:
            return {"error" : "Id is required"}, 400
        
    def login(self, data):
        print(data)
        if data["identificador"] != None and data["password"] != None:
            response, status = self.model.login(data)
            return response, status
            
        else: return {"error" : "id is required"}, 400
             
        
    def validate_data(self, data, attributes):
        actual_keys = set(data.keys())
        extra_keys = actual_keys - set(attributes)

        if extra_keys:
            return False
        
        for key in attributes:
            if key not in data:
                return False
        
        return True