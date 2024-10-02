async function get(typeGet) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/${typeGet}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        if (response.status === 204) {
            return null
        }
        const respuestaJson = await response.json();
        return respuestaJson["message"];
        
    } catch (error) {
        console.error('Error:', error);
    }
}

export default get