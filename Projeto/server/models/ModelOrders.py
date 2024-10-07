from .Model import Model
from bson import ObjectId
import traceback

class ModelOrders(Model):
    def __init__(self):
        super().__init__()
        self.collection = self.database['orders']
        self.users = self.database['users']
        self.restaurants = self.database['restaurants']
        self.objects_type = ["_id", "id_user"]
    
    def post(self, data):
        flag = True
        id_user = data["id_user"]

        try:
            if flag and self.validate_data(id_user, self.users):
                data["id_user"] = ObjectId(id_user)
                self.collection.insert_one(data)
                return {"message" : "Creation realized"}, 201
            
            else:
                return {"error" : "id_user or id_restaurant doesnt exist"}, 400
        except Exception as e:
            return e, 400
        
    def get_orders_user(self, _id):

        try:
            list_orders = list(self.collection.find({'id_user': ObjectId(_id)}))
            
            if len(list_orders)>0:
                for orders in list_orders:
                    for object_type in self.objects_type:
                        orders[object_type] = str(orders[object_type])

                    for order in orders["sub_orders"]:
                        restaurant = list(self.restaurants.find({"_id":order["id_restaurant"]}, {"name":1}))
                        order["id_restaurant"] = restaurant[0]["name"]
            
                return list_orders, 200
            else:
                return {"message" : "Database without data"}, 204
            
        except Exception as e:
            return {"error": str(e), "details": traceback.format_exc()}, 400
        

    def get_orders_restaurant(self, _id):
        try:
            list_orders = list(self.collection.aggregate([
                { "$match": { "sub_orders.id_restaurant": ObjectId(_id) } },
                { "$project": {
                    "_id": 1,
                    "created_at": 1,
                    "id_user": 1,
                    "table": 1,
                    "sub_orders": {
                        "$filter": {
                            "input": "$sub_orders",
                            "as": "subOrder",
                            "cond": { "$eq": ["$$subOrder.id_restaurant", ObjectId(_id)] }
                        }
                    }
                }}
            ]))

            
            if len(list_orders)>0:
                for orders in list_orders:
                    user = list(self.users.find({"_id":orders["id_user"]}, {"name":1}))
                    orders["id_user"] = user[0]["name"]
                    orders["_id"] = str(orders["_id"])

                    for order in orders["sub_orders"]:
                        order["id_restaurant"] = str(order["id_restaurant"])
                return list_orders, 200
            else:
                return {"message" : "Database without data"}, 204
            
        except Exception as e:
            return {"message": str(e), "details": traceback.format_exc()}, 400
        
    def patch_state(self, order_id, restaurant_id, nuevo_estado):
        try:
            self.collection.update_one(
                {
                    "_id": ObjectId(order_id),
                    "sub_orders.id_restaurant": ObjectId(restaurant_id) 
                },
                {
                    "$set": { "sub_orders.$[elem].state": nuevo_estado }  # Actualiza el campo 'state' de la suborden específica
                },
                array_filters=[{ "elem.id_restaurant": ObjectId(restaurant_id) }]  # Aplica el filtro en las subórdenes
            )
            return {"message" : "Update realized" }, 214
        except Exception as e:
            return {"message": e}, 400
        
    def patch_push_sub_orders(self, _id, sub_order, total):
        if self.validate_data(sub_order["id_restaurant"], self.restaurants):    
            sub_order["id_restaurant"] = ObjectId(sub_order["id_restaurant"])

            try:
                self.collection.update_one(
                    {"_id": ObjectId(_id)},
                    {
                        "$push": {"sub_orders": sub_order},
                        "$inc": {"total": total}
                    }
                )

                return {"message":"update realized"}, 214
            except Exception as e:
                return {"message":e}, 400
        
        else:
            return {"message":"Invalid id"}, 400