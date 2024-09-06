from controllers.Controller import Controller
from models.ModelDonations import ModelDonations

class ControllerDonations(Controller):
    def __init__(self):
        self.model = ModelDonations()
        self.attributes = ["user_id", "location_id", "data"]
    
