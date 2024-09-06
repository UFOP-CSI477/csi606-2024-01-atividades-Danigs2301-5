from bson import ObjectId
from datetime import datetime
class Controller:
    def get(self):
        data = self.model.get()
        return data
    
    def get_one(self, data):
        key_id = "_id"
        key_name = "name"
        if key_id in data:
            data[key_id] = ObjectId(data[key_id])
            response, status = self.model.get_one(data[key_id], key_id)
        
        if key_name in data:
            response, status = self.model.get_one(data[key_name], key_name)

        return response, status
    
    def post(self, body):
        if self.validate_data(body):
            date = datetime.now()
            date = date.strftime("%Y-%m-%d %H:%M:%S")
            body['created_at'] = date
            body['updated_at'] = date
            response, status = self.model.post(body)
            return response, status
        else:
            return {"error" : "Invalid data"}, 400
        
    def patch(self, body):
        update = {}
        _id = ObjectId(body.pop("_id"))
        actual_keys = set(body.keys())

        for key in actual_keys:
            if key not in set(self.attributes):
                return {"error" : "Invalid attributes"}, 400
            
        date = datetime.now()
        date = date.strftime("%Y-%m-%d %H:%M:%S")
        body["updated_at"] = date
        update["$set"] = body
        response, status = self.model.patch(_id, update)

        return response, status 
    
    def delete(self, body):
        _id = ObjectId(body["_id"])
        response, status = self.model.delete(_id)
        return response, status
        
    def validate_data(self, data):
        actual_keys = set(data.keys())
        extra_keys = actual_keys - set(self.attributes)

        if extra_keys:
            return False
        
        for key in self.attributes:
            if key not in data:
                return False
        
        return True