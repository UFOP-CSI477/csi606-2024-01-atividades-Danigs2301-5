async function login_user(identification, password) {
    try {
        const data = {
            "identificador": identification,
            "password": password
        };
        
        const response = await fetch('http://127.0.0.1:5000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
  
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
  
        const respuestaJson = await response.json();
        // Retornar tanto la respuesta como el status
        return {
            status: response.status,
            data: respuestaJson
        };
        
    } catch (error) {
        console.error('Error:', error);
        // Retornar el estado y un mensaje de error si ocurre un problema
        return {
            status: 500, // o el estado que corresponda
            error: error.message
        };
    }
}

export default login_user;
