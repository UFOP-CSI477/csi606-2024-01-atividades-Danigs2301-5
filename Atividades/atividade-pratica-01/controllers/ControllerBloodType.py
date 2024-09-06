from controllers.Controller import Controller
from models.ModelBloodType import ModelBloodType


class ControllerBloodType(Controller):
    def __init__(self):
        self.model = ModelBloodType()
        self.attributes = ["type", "factor"]

        
    