from controllers.Controller import Controller
from models.ModelCity import ModelCity


class ControllerCitys(Controller):
    def __init__(self):
        self.model = ModelCity()
        self.attributes = ["name", "state"]
        
    