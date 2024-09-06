from .credentials import *
from .Model import Model

class ModelCity(Model):
    def __init__(self):
        self.collection = database['cities']
        self.users = database['users']
        self.objects_type = ["_id"]

    """def delete(self, _id):
        try:
            if not self.validate_data(_id, self.users, "city_id"):
                self.cities.delete_one({"_id" : _id})
                return "Delete realized"
            else:
                return {"error" : "Blood type have users asociated"}
        except Exception as e:
            return e"""