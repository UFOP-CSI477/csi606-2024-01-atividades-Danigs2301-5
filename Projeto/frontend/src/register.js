async function login_user(identificador, name, phone, mail, password) {

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