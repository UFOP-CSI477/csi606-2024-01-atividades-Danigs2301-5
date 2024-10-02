import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import get from '../functionGet';

async function createDonationApi(userId, locationId, date) {

    try {
        const data = {
          "user_id":userId,
          "location_id":locationId,
          "data":date
        }
        const response = await fetch('http://127.0.0.1:5000/donations', {
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


function CreateDonation() {
    const navigate = useNavigate() 
    const [userId, setUserId] = useState('');
    const [locationId, setLocationId] = useState('');
    const [date, setDate] = useState('');
    const [users, setUsers] = useState([])
    const [collectionLocations, setCollectionLocations] = useState([])

    useEffect(() => {
        const fetchApi = async () => {
          try {
            setUsers(await get("users"));
            setCollectionLocations(await get("collection_locations"))
          } catch (error) {
            console.error("Error fetching:", error);
          }
        };
    
        fetchApi();
      }, []);

    const showAlert = (message) => {
        alert(message);
      };

    const clearInputs = () => {
        setUserId("");
        setLocationId("");
        setDate("");
      };

    const create = async (e) => {
        e.preventDefault(); 
        try{
            const response = await createDonationApi(userId, locationId, date);
            showAlert(JSON.stringify(response["message"]))
            navigate('/readDonation')
        }
        catch (e){console.log(e); clearInputs()}

    };

    return (
        <>
            <div>
                <h1>Create donation:</h1>
            </div>
            <div>
            <form onSubmit={create}>
                    <label htmlFor="userId">Select user: </label>
                    <select name="userId" id="userId" value={userId} onChange={(e) => setUserId(e.target.value)}>
                        {userId === "" &&
                        <option value="">Select one</option>
                        }
                        {users.map((user) => (
                            <option value={user._id}>{user.name}</option>

                        ))}
                    </select>

                    <label htmlFor="locationId">Select collection location: </label>
                    <select name="locationId" id="locationId" value={locationId} onChange={(e) => setLocationId(e.target.value)}>
                        {locationId === "" &&
                        <option value="">Select one</option>
                        }
                        {collectionLocations.map((collectionLocation) => (
                            <option value={collectionLocation._id}>{collectionLocation.name}</option>
                        ))}
                    </select>
                    
                    <label htmlFor="date">Date: </label>
                    <input type="date" name="date" id="date" onChange={(e) => setDate(e.target.value)}/>

                    <button className='button-basic' type="submit">Create</button>
                </form>
            </div>
        </>
    );
}

export default CreateDonation;
