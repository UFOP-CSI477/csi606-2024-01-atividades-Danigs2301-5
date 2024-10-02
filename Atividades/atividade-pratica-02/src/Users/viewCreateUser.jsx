import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import get from '../functionGet';

async function createUserApi(nameUser, addressUser, cityId, typeId) {

    try {
        const data = {
          "name":nameUser,
          "address":addressUser,
          "city_id":cityId,
          "type_id":typeId
        }
        const response = await fetch('http://127.0.0.1:5000/users', {
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


function CreateUser() {
    const navigate = useNavigate() 
    const [nameUser, setNameUser] = useState('');
    const [addressUser, setAddressUser] = useState('');
    const [cityId, setCityId] = useState('');
    const [typeId, setTypeId] = useState('');
    const [cities, setCities] = useState([])
    const [types, setTypes] = useState([])

    useEffect(() => {
        const fetchCitiesTypes = async () => {
          try {
            setCities(await get("cities"));
            setTypes(await get("blood_type"))
          } catch (error) {
            console.error("Error fetching blood types:", error);
          }
        };
    
        fetchCitiesTypes();
      }, []);

    const showAlert = (message) => {
        alert(message);
      };

    const clearInputs = () => {
        setNameUser("");
        setAddressUser("");
        setCityId("");
        setTypeId("");
      };

    const create = async (e) => {
        e.preventDefault(); 
        try{
            const response = await createUserApi(nameUser, addressUser, cityId, typeId);
            showAlert(JSON.stringify(response["message"]))
            navigate('/readUsers')
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
                    <label htmlFor="nameUser">Name of user:</label><br />
                    <input
                    type="text"
                    name="nameUser"
                    id="nameUser"
                    value={nameUser}
                    onChange={(e) => setNameUser(e.target.value)}
                    /><br />

                    <label htmlFor="addressUser">Address of user:</label><br />
                    <input
                    type="text"
                    name="addressUser"
                    id="addressUser"
                    value={addressUser}
                    onChange={(e) => setAddressUser(e.target.value)}
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

                    <label htmlFor="typeId">Select blood type: </label>
                    <select name="typeId" id="typeId" value={typeId} onChange={(e) => setTypeId(e.target.value)}>
                        {typeId === "" &&
                        <option value="">Select one</option>
                        }
                        {types.map((typeBlood) => (
                            <option value={typeBlood._id}>{typeBlood.type+typeBlood.factor}</option>

                        ))}
                    </select>
                    <button className='button-basic' type="submit">Create</button>
                </form>
            </div>
        </>
    );
}

export default CreateUser;
