from controllers.Controller import Controller
from models.ModelLocations import ModelLocations

class ControllerLocations(Controller):
    def __init__(self):
        self.model = ModelLocations()
        self.attributes = ["name", "address", "city_id"]
    