import { useEffect, useState } from "react";
import { useLocation, useNavigate} from "react-router-dom";
import view_orders from '../get_orders.js';


function ViewOrdersUsers() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id_user = queryParams.get('id_user');
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(true);
    const [visibleOrders, setVisibleOrders] = useState({});
    const navigate = useNavigate()
    const [boolOrders, setBoolOrders] = useState(false)
  
    const create_order = () => {
      navigate(`/create_order?id_user=${id_user}`);
    };
    
    useEffect(() => {
      if (orders && orders.length > 0) {
        setBoolOrders(true);
      }
    }, [orders]);

    function add_items_order (id_order){
      navigate(`/add_items_order?id_user=${id_user}&id_order=${id_order}`);
    };
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const fetchedOrders = await view_orders("id_user", id_user);
          setOrders(fetchedOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }, [id_user]);
  
    if (loading) {
      return <p>Cargando órdenes...</p>;
    }
  
    const toggleSubOrders = (orderIndex) => {
      setVisibleOrders((prevState) => ({
        ...prevState,
        [orderIndex]: !prevState[orderIndex],
      }));
    };
  
    return (
      <div>
        <div>
            <p><a href="/login_user">Sign out</a></p>
        </div>
        <h1>Orders list</h1>
        <div>
          <button className="button-basic" onClick={create_order}>
            Create order
          </button>
        </div>
        {boolOrders &&
        <>
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Table</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>{order.created_at}</td>
                <td>{order.table}</td>
                <td>{order.total}</td>
                <td>
                  <button className="button-basic" onClick={() => toggleSubOrders(index)}>
                    {visibleOrders[index] ? "Hide suborders" : "View Subórdenes"}
                  </button>
                  <button className="button-basic" onClick={() => add_items_order(order._id)}>
                    Add items
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
                <h3>Sub Órdenes de la Orden #{index + 1}</h3>
                <table border="1" cellPadding="10">
                  <thead>
                    <tr>
                      <th>Restaurant</th>
                      <th>State</th>
                      <th>Product</th>
                      <th>Unit value</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.sub_orders.map((subOrder) =>
                      subOrder.items.map((item, itemIndex) => (
                        <tr key={itemIndex}>
                          {itemIndex === 0 && (
                            <td rowSpan={subOrder.items.length}>{subOrder.id_restaurant}</td>
                          )}
                          {itemIndex === 0 && (
                            <td rowSpan={subOrder.items.length}>{subOrder.state}</td>
                          )}
                          <td>{item.name}</td>
                          <td>{item.value}</td>
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
  
  export default ViewOrdersUsers;