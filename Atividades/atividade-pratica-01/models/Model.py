from bson import ObjectId

class Model:
    def get(self):
        objects = list(self.collection.find())
        if len(objects)>0:
            for object in objects:
                for object_type in self.objects_type:
                    object[object_type] = str(object[object_type]) 

            return objects, 200
        else:
            return {"message" : "Database without data"}, 204
        
    def get_one(self, field, key):
        response = self.collection.find_one({key: field})
        for object_var in self.objects_type:
            response[object_var] = str(response[object_var])
        if response is not None:
            return response, 200
        if response is None:
            return {"error":f"{key} doesnt exist"}, 404
    
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

    def validate_data(self, data, collection, key = "_id"):
        field_id = ObjectId(data)
        field = collection.find_one({key: field_id})
        
        if not field:
            return False
        
        return True     