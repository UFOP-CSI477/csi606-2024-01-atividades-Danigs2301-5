async function getId(typeGet, attribute, attributeSearch) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/${typeGet}?${attributeSearch}=${attribute}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
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

export default getId