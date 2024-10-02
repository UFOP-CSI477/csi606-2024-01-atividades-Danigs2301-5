import { useEffect, useState } from "react";
import get from "../functionGet";
import getId from "../functionGetId";
import pencilImage from "../images/pencil.png";
import confirmImage from "../images/confirm.png";
import trashImage from "../images/trash.png";
import patch from "../functionPatch";
import deleteApi from "../functionDelete";

function ReadCity() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [item, setItem] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [newState, setNewState] = useState("");

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const fetchedCities = await get("cities");
        setCities(fetchedCities);
      } catch (error) {
        console.error("Error fetching blood types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);

    if (inputValue) {
      fetchCityById(inputValue);
    } else {
      setItem(null);
    }
  };

  const handleInputChangeName = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);

    if (inputValue) {
      fetchCityByName(inputValue);
    } else {
      setItem(null);
    }
  };

  const fetchCityById = async (id) => {
    try {
      const fetchedCityId = await getId("cities", id, "identificator");
      setItem(fetchedCityId);
    } catch (error) {
      console.log("ID not found:", error);
      setItem(null);
    }
  };

  const fetchCityByName = async (name) => {
    try {
      const fetchedCityName = await getId("cities", name, "name");
      setItem(fetchedCityName);
    } catch (error) {
      console.log("Name not found:", error);
      setItem(null);
    }
  };

  const handleEditToggle = (id) => {
    if (editingId === id) {
      setEditingId(null);
      setNewName("");
      setNewState("");
    } else {
      setEditingId(id);
      const city = cities.find((name) => name._id === id);
      setNewName(city?.name || "");
      setNewState(city?.state || ""); // Cargar el factor actual en el input
    }
  };

  const handleNewNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNewStateChange = (e) => {
    setNewState(e.target.value);
  };

  const handleUpdate = async (id) => {
    if (newName || newState) {
      try {
        await patch(id, "name", newName, "cities");
        await patch(id, "state", newState, "cities");
        setEditingId(null);
        setNewName("");
        setNewState("");
        window.location.reload();
      } catch (error) {
        console.log("Error updating:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try{
      deleteApi(id, 'cities')
      window.location.reload();
    } catch (error) {
      console.log("Error updating:", error);
    }
  }
  if (loading) {
    return <p>Charging cities...</p>;
  }

  return (
    <div>
      <h1>Cities</h1>
      <label htmlFor="search">Search by ID: </label>
      <input type="text" id="search"  onChange={handleInputChange} />
      <label htmlFor="searchName">Search by name: </label>
      <input type="text" id="searchName" onChange={handleInputChangeName} />
      <p><a href="/createCities">Create</a></p>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>#</th>
            <th>_id</th>
            <th>Name</th>
            <th>State</th>
            <th>Created at</th>
            <th>Updated at</th>
          </tr>
        </thead>
        <tbody>
          {searchTerm === "" && cities.map((city, index) => (
            <tr key={city._id}>
              <td>
                {index + 1}
                {editingId !== city._id ? (
                <>
                <button className="image-button" onClick={() => handleEditToggle(city._id)}>
                  <img src={pencilImage} alt="Edit" style={{ width: '20px', height: '20px' }} />
                </button>  
                
                <button className="image-button" onClick={() => handleDelete(city._id)}>
                  <img src={trashImage} alt="delete" style={{ width: '20px', height: '20px' }} />
                </button>
                </>
                ) : (  
                <button className="image-button" onClick={() => handleUpdate(city._id)}>
                    <img src={confirmImage} alt="Confirm" style={{ width: '20px', height: '20px' }} />
                </button>
                )}
              </td>
              <td>{city._id}</td>
              <td>
                {editingId === city._id ? (
                  <>
                    <input
                      type="text"
                      value={newName}
                      onChange={handleNewNameChange}
                      placeholder="New name"
                    />
                  </>
                ) : (
                  <>
                    {city.name}
                  </>
                )}
              </td>
              <td>
                {editingId === city._id ? (
                <input
                    type="text"
                    value={newState}
                    onChange={handleNewStateChange}
                    placeholder="New state"
                />

                ) : (
                    <>
                        {city.state}
                    </>
                )}
              </td>    
              <td>{city.created_at}</td>
              <td>{city.updated_at}</td>
            </tr>
          ))}

          {searchTerm && item && (
            <tr key={item._id}>
              <td>1</td>
              <td>{item._id}</td>
              <td>{item.name}</td>
              <td>{item.state}</td>
              <td>{item.created_at}</td>
              <td>{item.updated_at}</td>
            </tr>
          )}

          {searchTerm && !item && (
            <tr>
              <td colSpan="6">City not found with the provided ID.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReadCity;
