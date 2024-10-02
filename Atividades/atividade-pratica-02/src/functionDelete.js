async function deleteApi(_id, path) {
    try {
        const data = {
            "_id":_id
        }
        const response = await fetch(`http://127.0.0.1:5000/${path}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            console.log("Not found id");
        }

        const respuestaJson = await response.json();
        return respuestaJson["message"];
        
    } catch (error) {
        console.error('Error:', error);
    }
}

export default deleteApi