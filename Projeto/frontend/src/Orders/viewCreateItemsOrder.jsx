import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

async function get_names_restaurants() {
    try {
        const response = await fetch('http://127.0.0.1:5000/restaurants/names', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
  
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
  
        const respuestaJson = await response.json();
        return respuestaJson;
        
    } catch (error) { 
        console.error('Error:', error);
        return [];
    }
}

async function get_restaurant_products(id_restaurant) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/restaurants/products?id_restaurant=${id_restaurant}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
  
        if (!response.ok) {

            if (response.status === 404) {
                throw new Error('Restaurante no encontrado');
            } else if (response.status === 204) {
                console.warn('El restaurante no tiene productos.');
                return [];
            } else {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
        }
  
        const respuestaJson = await response.json();
        return respuestaJson;
        
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function add_items_order(id_order, id_restaurant, items) {
    const data = {
        "_id":id_order,
        "sub_order":{
            "id_restaurant": id_restaurant,
            "items": items
        }
    }
    try {
        const response = await fetch('http://127.0.0.1:5000/orders?type_patch=push_sub_orders', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
        });
  
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
  
        const respuestaJson = await response.json();
        return respuestaJson;
        
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

function ItemsOrder() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id_order = queryParams.get('id_order');
    const id_user = queryParams.get('id_user');
    const [restaurants, setRestaurants] = useState([]);
    const [restaurant, setRestaurant] = useState({});
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(0);
    const [addItems, setAddItems] = useState([]);
    const [subOrder, setSubOrder] = useState(true);
    

    useEffect(() => {
        const fetchRestaurants = async () => {
            const fetchedRestaurants = await get_names_restaurants();
            setRestaurants(fetchedRestaurants);
        };

        fetchRestaurants();
    }, []);

    const showAlert = (message) => {
        alert(message);
      };

    const addItemsAPI = async (e) => {
        e.preventDefault(); 
        try{
            
            const response = await add_items_order(id_order, restaurant._id, addItems);
            showAlert(JSON.stringify(response["message"]));
            navigate(`/orders_user?id_user=${id_user}`);
        }
        catch (e){console.log(e)}
    }

    const handleSelectChange = async (e) => {
        const selectedRestaurant = restaurants.find(rest => rest._id === e.target.value);
        setRestaurant(selectedRestaurant || {});
        console.log(restaurant)
        const response = await get_restaurant_products(e.target.value);

        if (response && Array.isArray(response.products)) {
            setProducts(response.products);
        } else {
            console.error('Error: La respuesta no tiene productos válidos');
            setProducts([]);
        }
    };

    const handleSelectProduct = (e) => {
        const selectedProduct = products.find(prod => prod.id_product === e.target.value);
        setProduct(selectedProduct || {});
    };

    const addItemsOrder = () => {
        if (Object.keys(product).length > 0 && quantity > 0) {
            const productWithQuantity = { ...product, quantity };
            setAddItems(prevItems => [...prevItems, productWithQuantity]);
            setProduct({});
            setQuantity(0);
            setSubOrder(false);
            console.log(addItems)
        }
    };

    return (
        <>  <div>
                <h1>Add items to order</h1>
            </div>
            {subOrder && (
                <div>
                    <label htmlFor="restaurants">Select restaurant: </label>
                    <select
                        name="restaurants"
                        id="restaurants"
                        value={restaurant._id || ''}
                        onChange={handleSelectChange}
                    >
                        {Object.keys(restaurant).length === 0 &&
                            <option value="">Select restaurant</option>
                        }
                        {restaurants.map((restaurant) => (
                            <option key={restaurant._id} value={restaurant._id}>
                                {restaurant.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div>
                <label htmlFor="product">Select product: </label>
                <select
                    name="product"
                    id="product"
                    value={product.id_product || ''}
                    onChange={handleSelectProduct}
                >
                    {Object.keys(product).length === 0 &&
                            <option value="">Select product</option>
                        }
                    
                    {products.map((product) => (
                        <option key={product.id_product} value={product.id_product}>
                            {product.name} - ${product.value}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="quantity">Quantity: </label>
                <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                /><br />
            </div>

            <div>
                <button className="button-basic" type="button" onClick={addItemsOrder}>
                    Confirm order
                </button>
            </div>

            {!subOrder && (

                <>
                <h3>Sub Order</h3>
                <div>
                    <table border="1" cellPadding="10">
                        <thead>
                            <tr>
                                <th>Restaurant</th>
                                <th>Product name</th>
                                <th>Product value</th>
                                <th>Product quantity</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {addItems.map((item, index) => (
                                <tr key={index}>
                                    {index === 0 && (
                                        <td rowSpan={addItems.length}>{restaurant.name}</td>
                                    )}
                                    <td>{item.name}</td>
                                    <td>{item.value}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.value * item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div>
                    <button className="button-basic" type="button" onClick={addItemsAPI}>Confirm sub order</button>
                </div>
                </>
            )}
        </>
    );
}

export default ItemsOrder;