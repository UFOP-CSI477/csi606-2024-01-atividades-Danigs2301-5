import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './home';
import LoginPage from './viewLogin';
import login_user from './Users/loginUser';
import login_restaurant from './Restaurant/loginRestaurant';
import ViewOrdersUsers from './Orders/viewOrderUser'
import ViewOrdersRestaurans from './Orders/viewOrderRestaurant';
import CreateUser from './Users/viewCreateUser';
import CreateRestaurant from './Restaurant/viewCreateRestaurant';
import CreateOrder from './Orders/viewCreateOrder';
import ItemsOrder from './Orders/viewCreateItemsOrder';
import AddProductRestaurant from './Restaurant/viewRestaurantAddProduct';
import './App.css';
import ReadUsers from './Users/viewReadUsers';
import ReadRestaurants from './Restaurant/viewReadRestaurants';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login_user" element={<LoginPage function_controller={login_user} type_login={'_user'}/>} />
        <Route path='/login_restaurant' element={<LoginPage function_controller={login_restaurant} type_login={'_restaurant'}/>}/>
        <Route path='/orders_user' element={<ViewOrdersUsers/>}/>
        <Route path='/orders_restaurant' element={<ViewOrdersRestaurans/>}/>
        <Route path='/create_user' element={<CreateUser/>}/>
        <Route path='/create_restaurant' element={<CreateRestaurant/>}/>
        <Route path='/create_order' element={<CreateOrder/>}/>
        <Route path='/add_items_order' element={<ItemsOrder/>}/>
        <Route path='/add_product_restaurant' element={<AddProductRestaurant/>}/>
        <Route path='/add_items_order' element={<ItemsOrder/>}/>
        <Route path='/readUsers' element={<ReadUsers/>}/>
        <Route path='/readRestaurants' element={<ReadRestaurants/>}/>
      </Routes>
    </Router>
  );
}

export default App;
