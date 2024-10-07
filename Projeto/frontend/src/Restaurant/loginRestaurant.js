async function login_restaurant(identification, password) {
  
    try {
        const data = {
          "identificador":identification,
          "password":password
        }
        console.log(data)
        const response = await fetch('http://127.0.0.1:5000/restaurants/login', {
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
export default login_restaurant;