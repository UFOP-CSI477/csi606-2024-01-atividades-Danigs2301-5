from controllers.Controller import Controller
from models.ModelUser import ModelUser

class ControllerUsers(Controller):
    def __init__(self):
        self.model = ModelUser()
        self.attributes = ["name", "address", "city_id", "type_id"]

    