import { useEffect, useState } from "react";
import get from "../functionGet";
import getId from "../functionGetId";
import pencilImage from "../images/pencil.png";
import confirmImage from "../images/confirm.png";
import trashImage from "../images/trash.png";
import patch from "../functionPatch";
import deleteApi from "../functionDelete";

function ReadCollectionLocation() {
  const [collectionLocations, setCollectionLocations] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [item, setItem] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCityId, setNewCityId] = useState("");

  useEffect(() => {
    const fetchCollectionLocations = async () => {
      try {
        const fetchedCollectionLocations = await get("collection_locations");
        setCollectionLocations(fetchedCollectionLocations);
      } catch (error) {
        console.error("Error fetching blood types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionLocations();
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);

    if (inputValue) {
      fetchCLId(inputValue);
    } else {
      setItem(null);
    }
  };

  const handleInputChangeName = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);

    if (inputValue) {
      fetchCLName(inputValue);
    } else {
      setItem(null);
    }
  };

  const fetchCLId = async (id) => {
    try {
      const fetchedCLId = await getId("collection_locations", id, "identificator");
      setItem(fetchedCLId);
    } catch (error) {
      console.log("ID not found:", error);
      setItem(null);
    }
  };

  const fetchCLName = async (name) => {
    try {
      const fetchedCLName = await getId("collection_locations", name, "name");
      setItem(fetchedCLName);
    } catch (error) {
      console.log("ID not found:", error);
      setItem(null);
    }
  };

  const handleEditToggle = async (id) => {
    if (editingId === id) {
      setEditingId(null);
      setNewName("");
      setNewAddress("");
      setNewCityId("");
    } else {
      setEditingId(id);
      const collectionLocation = collectionLocations.find((name) => name._id === id);
      setCities(await get("cities"))
      setNewName(collectionLocation?.name || "");
      setNewAddress(collectionLocation?.address || "");
      setNewCityId(collectionLocation?.city_id || "");
    }
  };

  const handleNewNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNewAddressChange = (e) => {
    setNewAddress(e.target.value);
  };

  const handleNewCityIdChange = (e) => {
    setNewCityId(e.target.value);
  };

  const handleUpdate = async (id) => {
    if (newName || newAddress || newCityId) {
      try {
        await patch(id, "name", newName, "collection_locations");
        await patch(id, "address", newAddress, "collection_locations");
        await patch(id, "city_id", newCityId, "collection_locations");
        setEditingId(null);
        setNewName("");
        setNewAddress("");
        setNewCityId("");
        window.location.reload();
      } catch (error) {
        console.log("Error updating:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try{
      deleteApi(id, 'collection_locations')
      window.location.reload();
    } catch (error) {
      console.log("Error updating:", error);
    }
  }
  if (loading) {
    return <p>Charging collection locations...</p>;
  }

  return (
    <div>
      <h1>Collection locations</h1>
      <label htmlFor="search">Search by ID: </label>
      <input type="text" id="search" onChange={handleInputChange} />
      <label htmlFor="searchName">Search by name: </label>
      <input type="text" id="searchName" onChange={handleInputChangeName} />
      <p><a href="/createCollectionLocation">Create</a></p>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>#</th>
            <th>_id</th>
            <th>Name</th>
            <th>Address</th>
            <th>City</th>
            <th>Created at</th>
            <th>Updated at</th>
          </tr>
        </thead>
        <tbody>
          {searchTerm === "" && collectionLocations.map((collectionLocation, index) => (
            <tr key={collectionLocation._id}>
              <td>
                {index + 1}
                {editingId !== collectionLocation._id ? (
                <>
                <button className="image-button" onClick={() => handleEditToggle(collectionLocation._id)}>
                  <img src={pencilImage} alt="Edit" style={{ width: '20px', height: '20px' }} />
                </button>  
                
                <button className="image-button" onClick={() => handleDelete(collectionLocation._id)}>
                  <img src={trashImage} alt="delete" style={{ width: '20px', height: '20px' }} />
                </button>
                </>
                ) : (  
                <button className="image-button" onClick={() => handleUpdate(collectionLocation._id)}>
                    <img src={confirmImage} alt="Confirm" style={{ width: '20px', height: '20px' }} />
                </button>
                )}
              </td>
              <td>{collectionLocation._id}</td>
              <td>
                {editingId === collectionLocation._id ? (
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
                    {collectionLocation.name}
                  </>
                )}
              </td>
              <td>
                {editingId === collectionLocation._id ? (
                <input
                    type="text"
                    value={newAddress}
                    onChange={handleNewAddressChange}
                    placeholder="New address"
                />

                ) : (
                    <>
                        {collectionLocation.address}
                    </>
                )}
              </td>
              <td>
                {editingId === collectionLocation._id ? (
                <select name="newCityId" id="newCityId" value={newCityId} onChange={handleNewCityIdChange}>
                {newCityId === "" &&
                <option value="">Select one</option>
                }
                {cities.map((city) => (
                    <option value={city._id}>{city.name}</option>

                ))}
                </select>

                ) : (
                    <>
                        {collectionLocation.city_id}
                    </>
                )}
              </td>    
              <td>{collectionLocation.created_at}</td>
              <td>{collectionLocation.updated_at}</td>
            </tr>
          ))}

          {searchTerm && item && (
            <tr key={item._id}>
              <td>1</td>
              <td>{item._id}</td>
              <td>{item.name}</td>
              <td>{item.address}</td>
              <td>{item.city_id}</td>
              <td>{item.created_at}</td>
              <td>{item.updated_at}</td>
            </tr>
          )}

          {searchTerm && !item && (
            <tr>
              <td colSpan="6">Collection location not found with the provided ID.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReadCollectionLocation;
