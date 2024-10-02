import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import get from '../functionGet';

async function createCollectionLocation(clName, clAddress, cityId) {

    try {
        const data = {
          "name":clName,
          "address":clAddress,
          "city_id":cityId
        }
        const response = await fetch('http://127.0.0.1:5000/collection_locations', {
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


function CreateCollectionLocation() {
    const navigate = useNavigate() 
    const [clName, setCLName] = useState('');
    const [clAddress, setCLAddress] = useState('');
    const [cityId, setCityId] = useState('')
    const [cities, setCities] = useState([])

    useEffect(() => {
        const fetchCities = async () => {
          try {
            const fetchedCities = await get("cities");
            setCities(fetchedCities);
          } catch (error) {
            console.error("Error fetching blood types:", error);
          }
        };
    
        fetchCities();
      }, []);

    const showAlert = (message) => {
        alert(message);
      };

    const clearInputs = () => {
        setCLName("");
        setCLAddress("");
        setCityId("");
      };

    const create = async (e) => {
        e.preventDefault(); 
        try{
            const response = await createCollectionLocation(clName, clAddress, cityId);
            showAlert(JSON.stringify(response["message"]))
            navigate('/readCollectionLocation')
        }
        catch (e){console.log(e); clearInputs()}

    };

    return (
        <>
            <div>
                <h1>Create collection location:</h1>
            </div>
            <div>
            <form onSubmit={create}>
                    <label htmlFor="clName">Name of collection location:</label><br />
                    <input
                    type="text"
                    name="clName"
                    id="clName"
                    value={clName}
                    onChange={(e) => setCLName(e.target.value)}
                    /><br />

                    <label htmlFor="clAddress">Address of collection location:</label><br />
                    <input
                    type="text"
                    name="clAddress"
                    id="clAddress"
                    value={clAddress}
                    onChange={(e) => setCLAddress(e.target.value)}
                    /><br />
                    
                <label htmlFor="cityId">Select city: </label>
                <select name="cityId" id="cityId" value={cityId} onChange={(e) => setCityId(e.target.value)}>
                    {cityId === "" &&
                    <option value="">Select one</option>
                    }
                    {cities.map((city) => (
                        <option value={city._id}>{city.name}</option>

                    ))}
                </select>
                <button className='button-basic' type="submit">Create</button>
                </form>
            </div>
        </>
    );
}

export default CreateCollectionLocation;
