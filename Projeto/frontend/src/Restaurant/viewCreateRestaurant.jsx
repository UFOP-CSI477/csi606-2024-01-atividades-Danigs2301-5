import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';

async function create_restaurant(identificador, restaurantName, typeFood, password) {

    try {
        const data = {
          "identificador":identificador,
          "name":restaurantName,
          "type_food":typeFood,
          "password":password
        }
        console.log(JSON.stringify(data))
        const response = await fetch('http://127.0.0.1:5000/restaurants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
  
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
  
        const respuestaJson = await response.json();
        return respuestaJson
        
    } catch (error) {
        console.error('Error:', error);
    }
  }


function CreateRestaurant() {
    const [identification, setIdentification] = useState('');
    const [restaurantName, setRestaurantName] = useState('');
    const [typeFood, setTypeFood] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const showAlert = (message) => {
        alert(message);
      };

    const clearInputs = () => {
        setIdentification("");
        setRestaurantName("");
        setTypeFood("");
        setPassword("");
      };

    const home = () => {
        navigate('/');
    };

    const handleLogin = async (e) => {
        e.preventDefault(); 
        try{
            const response = await create_restaurant(identification, restaurantName, typeFood, password);
            showAlert(JSON.stringify(response["message"]))
            if (response["message"] === "Creation realized"){
                home()
            }
            clearInputs()
        }
        catch (e){console.log(e)}

    };

    return (
        <>
            <div>
                Register restaurant:
            </div>
            <div>
                <form onSubmit={handleLogin}>
                    <label htmlFor="identification">Identification:</label><br />
                    <input
                    type="text"
                    name="identification"
                    id="identification"
                    value={identification}
                    onChange={(e) => setIdentification(e.target.value)}
                    /><br />

                    <label htmlFor="userName">Restaurant name:</label><br />
                    <input
                    type="text"
                    name="restaurantName"
                    id="restaurantName"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    /><br />

                    <label htmlFor="phone">Type food:</label><br />
                    <input
                    type='text'
                    name="typeFood"
                    id="typeFood"
                    value={typeFood}
                    onChange={(e) => setTypeFood(e.target.value)}
                    /><br />

                    <label htmlFor="password">Password:</label><br />
                    <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    /><br />

                    <button className='button-basic' type="submit">Register</button>
                </form>            
            </div>
        </>
    );
}

export default CreateRestaurant;
