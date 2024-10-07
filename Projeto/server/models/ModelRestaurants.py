from .Model import Model
from bson import ObjectId
import traceback

class ModelRestaurant(Model):
    def __init__(self):
        super().__init__()
        self.collection = self.database['restaurants']
        self.pedidos = self.database['orders']
        self.objects_type = ["_id"]

    def get(self):
        objects = list(self.collection.find())
        if len(objects)>0:
            for object in objects:
                for object_type in self.objects_type:
                    object[object_type] = str(object[object_type])
                for product in object["products"]:
                    product["id_product"] = str(product["id_product"])

            return {"data" : objects}, 200
        else:
            return {"message" : "Database without data"}, 204

    def get_names(self):
        objects = list(self.collection.find({}, { "_id": 1, "name": 1}))

        if len(objects)>0:
            for object in objects:
                object["_id"] = str(object["_id"]) 

            return objects, 200
        else:
            return {"message" : "Database without data"}, 204
        
    def get_products(self, id_restaurant):
        try:
            if self.validate_data(id_restaurant, self.collection):
                restaurant = list(self.collection.find({"_id":ObjectId(id_restaurant)}, {"products":1}))
                products = restaurant[0].get("products", [])

                if len(products) > 0:
                    for product in products:
                        product["id_product"]=str(product["id_product"])

                    return {"products": products}, 200
                else:
                    return {"products": []}, 200
            else:
                return {"message": "Restaurant doesn't exist"}, 404

        except Exception as e:
            return {"error": str(e), "details": traceback.format_exc()}, 400
        
    def add_product(self, product, id_restaurant):
        if self.validate_data(id_restaurant, self.collection):  
            product["id_product"] = ObjectId()  
            try:
                self.collection.update_one(
                    {"_id": ObjectId(id_restaurant)},
                    {
                        "$push": {"products": product}
                    }
                )

                return {"message":"update realized"}, 214
            except Exception as e:
                return {"message":e}, 400
        
        else:
            return {"message":"Invalid id"}, 400
