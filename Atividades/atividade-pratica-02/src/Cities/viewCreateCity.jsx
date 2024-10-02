import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';

async function createCityApi(nameCity, stateCity) {

    try {
        const data = {
          "name":nameCity,
          "state":stateCity
        }
        const response = await fetch('http://127.0.0.1:5000/cities', {
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


function CreateCity() {
    const navigate = useNavigate() 
    const [nameCity, setNameCity] = useState('');
    const [stateCity, setStateCity] = useState('');

    const showAlert = (message) => {
        alert(message);
      };

    const clearInputs = () => {
        setNameCity("");
        setStateCity("");
      };

    const create = async (e) => {
        e.preventDefault(); 
        try{
            const response = await createCityApi(nameCity, stateCity);
            showAlert(JSON.stringify(response["message"]))
            navigate('/readBloodTypes')
        }
        catch (e){console.log(e); clearInputs()}

    };

    return (
        <>
            <div>
                <h1>Create city:</h1>
            </div>
            <div>
            <form onSubmit={create}>
                    <label htmlFor="nameCity">Name of city:</label><br />
                    <input
                    type="text"
                    name="nameCity"
                    id="nameCity"
                    value={nameCity}
                    onChange={(e) => setNameCity(e.target.value)}
                    /><br />

                    <label htmlFor="stateCity">State of city:</label><br />
                    <input
                    type="text"
                    name="stateCity"
                    id="stateCity"
                    value={stateCity}
                    onChange={(e) => setStateCity(e.target.value)}
                    /><br />
                    <button className='button-basic' type="submit">Create</button>
                </form>
            </div>
        </>
    );
}

export default CreateCity;
