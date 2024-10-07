from controllers.Controller import Controller
from models.ModelOrders import ModelOrders
from datetime import datetime

class ControllerOrders(Controller):
    def __init__(self):
        self.model = ModelOrders()
        self.attributes = ["id_user", "table"]

    def post(self, body):
        date = datetime.now()
        
        if self.validate_data(body, self.attributes):
            body["sub_orders"] = []
            body["total"] = 0
            date = date.strftime("%Y-%m-%d %H:%M:%S")
            body['created_at'] = date

            response, status = self.model.post(body)
            return response, status
        
        else:
            return {"error" : "Invalid data"}, 400
        
    def patch_state(self, body):
        try:
            _id = body["_id"]
            id_restaurant = body["id_restaurant"]
            state = body["state"]
            response, status = self.model.patch_state(_id,id_restaurant,state)
            return response, status 
        except Exception as e:
            return {"message":"invalid atributtes"}, 400
        
    def patch_push_sub_orders(self, body):
        total = 0
        
        try:
            _id = body["_id"]
            sub_order = body["sub_order"]
            for item in sub_order["items"]:
                total += item["value"] * item["quantity"]

            sub_order["state"] = "Preparación"
            response, status = self.model.patch_push_sub_orders(_id, sub_order, total)
            return response, status
        except Exception as e:
            return {"message":"Invalid atributtes"}, 400
    
    def get_orders_restaurant(self, _id):
        response, status = self.model.get_orders_restaurant(_id)
        return response, status
    
    def get_orders_user(self, _id):
        response, status = self.model.get_orders_user(_id)
        return response, status


    