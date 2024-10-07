import { React, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

async function create_order(id_user, table) {
    try {
        const data = {
            "id_user": id_user,
            "table":table
        }
        const response = await fetch('http://127.0.0.1:5000/orders', {
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



function CreateOrder() {
    const [table, setTable] = useState('');
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search);
    const id_user = queryParams.get('id_user');
    const navigate = useNavigate()
    

    const showAlert = (message) => {
        alert(message);
      };


    const handleOrder = async (e) => {
        e.preventDefault(); 
        try{
            if (table !== ""){
                const response = await create_order(id_user, table);
                showAlert(JSON.stringify(response["message"]))
                navigate(`/orders_user?id_user=${id_user}`)
            }
            else{
                showAlert("You have to select a table")
            }
        }
        catch (e){console.log(e)}
    }


    const handleSelectChange = (e) => {
        setTable(e.target.value);
    };

    return (
        <div>
        <label htmlFor="table">Select table:</label><br />
        <select name="table" id="table" value={table} onChange={handleSelectChange}>
            <option value="">Select table</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>    
        </select>
        <button className='button-basic' type="button" onClick={handleOrder}>
            Confirma table
        </button>
        </div>
    );
    }

export default CreateOrder;
