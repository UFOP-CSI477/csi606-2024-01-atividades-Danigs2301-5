from .credentials import *
from .Model import Model
from bson import ObjectId

class ModelBloodType(Model):
    def __init__(self):
        self.collection = database['blood_type']
        self.users = database['users']
        self.objects_type = ["_id"]

    """def delete(self, _id):
        try:
            if not self.validate_data(_id, self.users, "type_id"):
                self.collection.delete_one({"_id" : _id})
                return "Delete realized"
            else:
                return {"error" : "Blood type have users asociated"}
        except Exception as e:
            return e"""