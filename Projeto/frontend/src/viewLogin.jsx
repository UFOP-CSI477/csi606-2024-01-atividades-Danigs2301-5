import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function LoginPage({function_controller, type_login}) {
  const navigate = useNavigate();
  const [identification, setIdentification] = useState('');
  const [password, setPassword] = useState('');

  const showAlert = (message) => {
    alert(message);
  };

  const handleLogin = async (e) => {
    e.preventDefault(); 
    try{
        const response = await function_controller(identification, password);
        if (response.status === 200) {
          navigate(`/orders${type_login}?id${type_login}=${response.data}`)
        } else {
          
          showAlert("Usuario o contraseña incorrecto")
      }
    }
    catch (e){console.log(e)}
  };

  return (

      <div>
        <p><a href="/">Home</a></p>
      
        <form onSubmit={handleLogin}>
          <label htmlFor="identification">Identification:</label><br />
          <input
            type="text"
            name="identification"
            id="identification"
            value={identification}
            onChange={(e) => setIdentification(e.target.value)}
          /><br />

          <label htmlFor="password">Password:</label><br />
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /><br />

          <button className='button-basic' type="submit">Login</button>
        </form>
      </div>

  );
}

export default LoginPage;





