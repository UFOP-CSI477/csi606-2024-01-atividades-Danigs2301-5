from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from controllers.ControllerBloodType import ControllerBloodType
from controllers.ControllerUsers import ControllerUsers
from controllers.ControllerDonations import ControllerDonations
from controllers.ControllerLocations import ControllerLocations
from controllers.ControllerCitys import ControllerCitys

class Server:
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app)
        self.routes()

    def routes(self):
        @self.app.route('/', methods=['GET'])
        def inicio():
            return '<p>Bienvenido al server de sistemas web</p>'
        
        @self.app.route('/blood_type', methods=['GET', 'POST', 'DELETE', 'PATCH'])
        def blood_types():
            controller = ControllerBloodType()
            _id = request.args.get('_id')
            if _id is not None:
                data = {"_id": _id}
                return self.handle_request(controller, data)
            else:
                return self.handle_request(controller)

        @self.app.route('/users', methods=['GET', 'POST', 'DELETE', 'PATCH'])
        def users():
            controller = ControllerUsers()
            _id = request.args.get('_id')
            name = request.args.get('name')
            if _id is not None:
                data = {"_id": _id}
                return self.handle_request(controller, data)
            
            if name is not None:
                data = {"name": name}
                return self.handle_request(controller, data)
            
            else:
                return self.handle_request(controller)
        
        @self.app.route('/donations', methods=['GET', 'POST', 'DELETE', 'PATCH'])
        def donations():
            controller = ControllerDonations()
            _id = request.args.get('_id')
            if _id is not None:
                data = {"_id": _id}
                return self.handle_request(controller, data)
            else:
                return self.handle_request(controller)
        
        @self.app.route('/collection_locations', methods=['GET', 'POST', 'DELETE', 'PATCH'])
        def collectionLocations():
            controller = ControllerLocations()
            _id = request.args.get('_id')
            name = request.args.get('name')

            if _id is not None:
                data = {"_id": _id}
                return self.handle_request(controller, data)
            
            if name is not None:
                data = {"name": name}
                return self.handle_request(controller, data)
            
            else:
                return self.handle_request(controller)
        
        @self.app.route('/cities', methods=['GET', 'POST', 'DELETE', 'PATCH'])
        def Citys():
            controller = ControllerCitys()
            _id = request.args.get('_id')
            name = request.args.get('name')

            if _id is not None:
                data = {"_id": _id}
                return self.handle_request(controller, data)
            
            if name is not None:
                data = {"name": name}
                return self.handle_request(controller, data)
            else:
                return self.handle_request(controller)

    def handle_request(self, controller, data_url = None):
        try:
            match request.method:
                case 'GET':
                    response, status = controller.get()

                case 'POST':
                    if data_url is not None:
                        response, status = controller.get_one(data_url)
                    else: 
                        data = request.get_json()
                        response, status = controller.post(data)

                case 'DELETE':
                    data = request.get_json()
                    response, status = controller.delete(data)

                case 'PATCH':
                    data = request.get_json()
                    response, status = controller.patch(data)

            return jsonify(response), status

        except Exception as e:
            return make_response(jsonify({"error": str(e)}), 500)
        
    def run(self):
        self.app.run(debug=True)

server = Server()
server.run()
