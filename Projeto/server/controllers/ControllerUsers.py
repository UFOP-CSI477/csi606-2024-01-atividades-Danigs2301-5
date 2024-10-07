from controllers.Controller import Controller
from models.ModelUser import ModelUser

class ControllerUsers(Controller):
    def __init__(self):
        self.model = ModelUser()
        self.attributes = ["identificador", "name", "phone", "mail", "password"]

    def post(self, body):
        if self.validate_data(body, self.attributes):
            if body["password"]:
                response, status = self.model.post(body)
                return response, status
            else:
                return {"message" : "Password cant be null"}, 400
        
        else:
            return {"error" : "Invalid data"}, 400