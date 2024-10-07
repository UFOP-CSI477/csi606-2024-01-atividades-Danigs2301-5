from controllers.Controller import Controller
from models.ModelRestaurants import ModelRestaurant

class ControllerRestaurants(Controller):
    def __init__(self):
        self.model = ModelRestaurant()
        self.attributes = ["identificador", "name", "type_food", "password"]
        self.attributes_products = ["name", "value"]

    def post(self, body):
        if self.validate_data(body, self.attributes):
            if body["password"]:
                body["products"] = []
                response, status = self.model.post(body)
                return response, status
            else:
                return {"message" : "Password cant be null"}, 400
        
        else:
            return {"message" : "Invalid data"}, 400
        
    def get_names(self):
        response, status= self.model.get_names()
        return response, status
    
    def get_products(self, id_restaurant):
        response, status= self.model.get_products(id_restaurant)
        return response, status
    
    def add_product(self, body, id_restaurant):
        if self.validate_data(body, self.attributes_products):
            response, status = self.model.add_product(body, id_restaurant)
            return response, status

        else:
            return {"error" : "Invalid data"}, 400
   