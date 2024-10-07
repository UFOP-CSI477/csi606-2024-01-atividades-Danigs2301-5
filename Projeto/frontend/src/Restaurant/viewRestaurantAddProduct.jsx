import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

async function addProductApi(id_restaurant, productName, value) {
    const data = {
        "name": productName,
        "value": value
    };

    try {
        const response = await fetch(`http://127.0.0.1:5000/restaurants/add_product?id_restaurant=${id_restaurant}`, {
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
        return respuestaJson;

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function AddProductRestaurant() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id_restaurant = queryParams.get('id_restaurant');
    const navigate = useNavigate()
    
    const [productName, setProductName] = useState("");
    const [value, setValue] = useState(0);

    const showAlert = (message) => {
        alert(message);
      };

    const handleProduct = async (e) => {
        e.preventDefault();  // Prevenir la recarga del formulario
        
        try {
            const response = await addProductApi(id_restaurant, productName, parseFloat(value));
            console.log(response["message"])
            showAlert("Product added")
            navigate(`/orders_restaurant?id_restaurant=${id_restaurant}`)
        } catch (err) {
            console.error(err);
            showAlert("Error to add product");
        }
    };

    return (
        <>           
            <div>
                <h1>Add product</h1>
                <form onSubmit={handleProduct}>
                    <label htmlFor="productName">Name of product:</label><br />
                    <input
                        type="text"
                        name="productName"
                        id="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    /><br />

                    <label htmlFor="value">Value:</label><br />
                    <input
                        type='number'
                        name="value"
                        id="value"
                        value={value}
                        onChange={(e) => setValue(parseFloat(e.target.value))}
                    /><br />

                    <button className="button-basic" type="submit">Confirmar</button>
                </form>
            </div>
        </>
    );
}

export default AddProductRestaurant;
