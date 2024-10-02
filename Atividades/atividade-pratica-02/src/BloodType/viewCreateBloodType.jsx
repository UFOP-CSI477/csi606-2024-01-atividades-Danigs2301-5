import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';

async function createBloodTypeApi(typeBlood, factor) {

    try {
        const data = {
          "type":typeBlood,
          "factor":factor
        }
        const response = await fetch('http://127.0.0.1:5000/blood_type', {
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


function CreateBloodType() {
    const navigate = useNavigate() 
    const [typeBlood, setTypeBlood] = useState('');
    const [factor, setFactor] = useState('');

    const showAlert = (message) => {
        alert(message);
      };

    const clearInputs = () => {
        setTypeBlood("");
        setFactor("");
      };

    const handleTypeBlood = (e) =>{
        setTypeBlood(e.target.value)
    }

    const handleFactor = (e) =>{
        setFactor(e.target.value)
    }

    const create = async (e) => {
        e.preventDefault(); 
        try{
            const response = await createBloodTypeApi(typeBlood, factor);
            showAlert(JSON.stringify(response["message"]))
            navigate('/readBloodType')
        }
        catch (e){console.log(e); clearInputs()}

    };

    return (
        <>
            <div>
                <h1>Create blood type:</h1>
            </div>
            <div>
                <label htmlFor="typeBlood">Select blood type: </label>
                <select name="typeBlood" id="typeBlood" value={typeBlood} onChange={handleTypeBlood}>
                    {typeBlood === "" &&
                    <option value="">Select one</option>
                    }
                    <option value="AB">AB</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="O">O</option>
                </select>

                <label htmlFor="factor">Select factor: </label>
                <select name="factor" id="factor" value={factor} onChange={handleFactor}>
                    {factor === "" &&
                    <option value="">Select one</option>
                    }
                    <option value="-">-</option>
                    <option value="+">+</option>
                </select>
                <button className='button-basic' onClick={create}>Create</button>
            </div>
        </>
    );
}

export default CreateBloodType;
