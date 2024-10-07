import { React, useState} from 'react';
import { useNavigate } from 'react-router-dom';

async function create_user(identificador, name, phone, mail, password) {

    try {
        const data = {
          "identificador":identificador,
          "name":name,
          "phone":phone,
          "mail":mail,
          "password":password
        }

        console.log(JSON.stringify(data))
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
    const [identification, setIdentification] = useState('');
    const [userName, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

    const showAlert = (message) => {
        alert(message);
      };

    const clearInputs = () => {
        setIdentification("");
        setUserName("");
        setPhone("");
        setMail("");
        setPassword("");
      };

    const home = () => {
        navigate('/');
    };


    const handleLogin = async (e) => {
        e.preventDefault(); 
        try{
            //Ajustar esta parte
            const response = await create_user(identification, userName, phone, mail, password);
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
                Register
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

                    <label htmlFor="userName">Name:</label><br />
                    <input
                    type="text"
                    name="userName"
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    /><br />

                    <label htmlFor="phone">Phone number:</label><br />
                    <input
                    type='number'
                    name="phone"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    /><br />

                    <label htmlFor="mail">Mail:</label><br />
                    <input
                    type='email'
                    name="mail"
                    id="mail"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
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

export default CreateUser;
