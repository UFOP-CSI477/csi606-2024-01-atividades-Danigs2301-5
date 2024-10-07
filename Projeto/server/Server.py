from flask import Flask, jsonify, request
from flask_cors import CORS
from controllers.ControllerUsers import ControllerUsers
from controllers.ControllerRestaurants import ControllerRestaurants
from controllers.ControllerOrders import ControllerOrders
import traceback

class Server:
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app, origins = ["*"])
        self.app.config['CORS_HEADERS'] = '*'
        self.routes()

    def routes(self):
        @self.app.route('/', methods=['GET'])
        def inicio():
            return '<p>Bienvenido al server de PEDIDOS</p>'

        @self.app.route('/users', methods=['GET', 'POST', 'DELETE'])
        def users(): 
            controller = ControllerUsers()
            return self.handle_request(controller)
        
        @self.app.route('/restaurants', methods=['GET', 'POST', 'DELETE'])
        def restaurants():
            controller = ControllerRestaurants()
            return self.handle_request(controller)
        
        @self.app.route('/orders', methods=['GET', 'POST', 'PATCH'])
        def orders():
            controller = ControllerOrders()
            id_restaurant = request.args.get('id_restaurant')
            id_user = request.args.get('id_user')
            type_patch = request.args.get('type_patch')

            if id_user:
                return self.handle_request(controller, {"type":1, "_id":id_user})

            if id_restaurant:
                return self.handle_request(controller, {"type":2, "_id":id_restaurant})
            
            if type_patch:
                if type_patch == "state":
                    return self.handle_request(controller, 1)
                
                if type_patch == "push_sub_orders":
                    return self.handle_request(controller, 2)
            
            
            return self.handle_request(controller)

        
        #Las siguientes lineas de código pueden mejorar
        @self.app.route('/users/login', methods=['POST'])
        def login_users():
            controller = ControllerUsers()
            data = request.get_json()

            response, status = controller.login(data)
            
            return jsonify(response), status
        
        @self.app.route('/restaurants/login', methods=['POST'])
        def login_restaurants():
            controller = ControllerRestaurants()
            data = request.get_json()
            response, status = controller.login(data)
            
            return jsonify(response), status    
        
        @self.app.route('/restaurants/names', methods=['GET'])
        def restaurants_name():
            controller = ControllerRestaurants()
            response, status = controller.get_names()
            
            return jsonify(response), status

        @self.app.route('/restaurants/add_product', methods=['POST'])
        def add_product():
            controller = ControllerRestaurants()
            data = request.get_json()
            id_restaurant = request.args.get('id_restaurant')
            if id_restaurant:
                response, status = controller.add_product(data, id_restaurant)    
                return jsonify(response), status
            else:
                return {"message":"id_restaurant is required"}, 400
        
        @self.app.route('/restaurants/products', methods=['GET'])
        def restaurants_products():
            controller = ControllerRestaurants()
            id_restaurant = request.args.get('id_restaurant')
            response, status = controller.get_products(id_restaurant)   
            return jsonify(response), status

    def handle_request(self, controller, problem= None):
        try:
            match request.method:
                case 'GET':
                    response, status = controller.get()

                case 'POST':
                    if not problem:
                        data = request.get_json()
                        response, status = controller.post(data)
                    else:
                        if problem["type"] == 1:
                            response, status = controller.get_orders_user(problem["_id"])
                            #print(response)
                        
                        if problem["type"] == 2:
                            response, status = controller.get_orders_restaurant(problem["_id"])
                            print(response)

                case 'DELETE':
                    data = request.get_json()
                    response, status = controller.delete(data)

                case 'PATCH':
                    data = request.get_json()
                    if problem:
                        if problem == 1:
                            response, status = controller.patch_state(data)
                        if problem == 2:
                            response, status = controller.patch_push_sub_orders(data)

                    if not problem:
                        response, status = controller.patch(data)

            return jsonify(response), status

        except Exception as e:
            return {"message": str(e), "details": traceback.format_exc()}, 400
        
    def run(self):
        self.app.run(debug=True)

server = Server()
server.run()
