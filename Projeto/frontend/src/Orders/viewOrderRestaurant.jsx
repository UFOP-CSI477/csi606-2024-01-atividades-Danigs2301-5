import { useEffect, useState } from "react";
import { useLocation, useNavigate} from "react-router-dom";
import view_orders from '../get_orders.js';

async function change_state(_id, id_restaurant, state) {
    const data ={
        "_id": _id,
        "id_restaurant": id_restaurant,
        "state":state
    }

    try {
        const response = await fetch(`http://127.0.0.1:5000/orders?type_patch=state`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        const respuestaJson = await response.json();
        return respuestaJson;
        
    } catch (error) {
        console.error('Error:', error);
    }
}

function ViewOrdersRestaurans() {
    const navigate = useNavigate()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id_restaurant = queryParams.get('id_restaurant');
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(true);
    const [visibleOrders, setVisibleOrders] = useState({});
    const [boolOrders, setBoolOrders] = useState(false)

    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const fetchedOrders = await view_orders("id_restaurant", id_restaurant);
          setOrders(fetchedOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      };
  
      if (id_restaurant) {
        fetchOrders();
      }
    }, [id_restaurant]);
  
    useEffect(() => {
      if (orders && orders.length > 0) {
        setBoolOrders(true);
      }
    }, [orders]);
  
    if (loading) {
      return <p>Cargando órdenes...</p>;
    }
  
    const toggleSubOrders = (orderIndex) => {
      setVisibleOrders((prevState) => ({
        ...prevState,
        [orderIndex]: !prevState[orderIndex],
      }));
    };
  
    const showAlert = (message) => {
        alert(message);
      };
    
    const addProduct = () => {
      navigate(`/add_product_restaurant?id_restaurant=${id_restaurant}`)
      };
      
    const handleState = async (_id, id_restaurant, state) => {
        console.log(state)
        const response = await change_state(_id, id_restaurant, state )
        showAlert(response["message"])
    }


    return (
      <div>
        <div>
            <p><a href="/login_restaurant">Sign out</a></p>
        </div>
        <h1>Restaurant</h1>
        <button className="button-basic" onClick={addProduct}>Add product to restaurant</button>
        {boolOrders &&
          <>
          <h3>Lista de Órdenes</h3>
          <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Date</th>
              <th>Table</th>
              <th>Acations</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>{order.id_user}</td>
                <td>{order.created_at}</td>
                <td>{order.table}</td>
                <td>
                  <button className="button-basic" onClick={() => toggleSubOrders(index)}>
                    {visibleOrders[index] ? "Hide suborders" : "View suborders"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        {orders.map((order, index) => (
          <div key={order._id}>
            {visibleOrders[index] && (
              <>
                <h3>Sub order of order #{index + 1}</h3>
                <table border="1" cellPadding="10">
                  <thead>
                    <tr>
                      <th>State</th>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.sub_orders.map((subOrder) =>
                      subOrder.items.map((item, itemIndex) => (
                        <tr key={itemIndex}>
                          {itemIndex === 0 && (
                            <td rowSpan={subOrder.items.length}>

                                {subOrder.state}
                                {subOrder.state !== "Done" && (
                                <>
                                    <br />
                                    <button className="button-basic" onClick={() => {
                                    handleState(order._id, subOrder.id_restaurant, "Done");
                                    window.location.reload();
                                    }}>
                                    Done
                                    </button>
                                </>
                                )}
                                
                            </td>
                          )}
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>{item.value * item.quantity}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        ))}
          </>
        }
        
      </div>
    );
  }
  
  export default ViewOrdersRestaurans;