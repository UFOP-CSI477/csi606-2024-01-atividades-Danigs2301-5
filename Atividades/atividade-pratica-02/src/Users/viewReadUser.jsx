import { useEffect, useState } from "react";
import get from "../functionGet";
import getId from "../functionGetId";
import pencilImage from "../images/pencil.png";
import confirmImage from "../images/confirm.png";
import trashImage from "../images/trash.png";
import patch from "../functionPatch";
import deleteApi from "../functionDelete";

function ReadUser() {
  const [users, setUsers] = useState([]);
  const [cities, setCities] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [item, setItem] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCityId, setNewCityId] = useState("");
  const [newTypeId, setNewTypeId] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await get("users");
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching blood types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);

    if (inputValue) {
      fetchUsersId(inputValue);
    } else {
      setItem(null);
    }
  };

  const handleInputChangeName = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);

    if (inputValue) {
      fetchUsersName(inputValue);
    } else {
      setItem(null);
    }
  };


  const fetchUsersId = async (id) => {
    try {
      const fetchedUserId = await getId("users", id, "identificator");
      setItem(fetchedUserId);
    } catch (error) {
      console.log("ID not found:", error);
      setItem(null);
    }
  };

  const fetchUsersName = async (name) => {
    try {
      const fetchedUserName = await getId("users", name, "name");
      setItem(fetchedUserName);
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
      setNewTypeId("")
    } else {
      setEditingId(id);
      const user = users.find((name) => name._id === id);
      setCities(await get("cities"))
      setTypes(await get("blood_type"))
      setNewName(user?.name || "");
      setNewAddress(user?.address || "");
      setNewCityId(user?.city_id || "");
      setNewTypeId(user?.type_id || "");
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

  const handleNewTypeIdChange = (e) => {
    setNewTypeId(e.target.value);
  };

  const handleUpdate = async (id) => {
    if (newName || newAddress || newCityId) {
      try {
        await patch(id, "name", newName, "users");
        await patch(id, "address", newAddress, "users");
        await patch(id, "city_id", newCityId, "users");
        await patch(id, "type_id", newTypeId, "users");
        setEditingId(null);
        setNewName("");
        setNewAddress("");
        setNewCityId("");
        setNewTypeId("");
        window.location.reload();
      } catch (error) {
        console.log("Error updating:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try{
      deleteApi(id, 'users')
      window.location.reload();
    } catch (error) {
      console.log("Error updating:", error);
    }
  }
  if (loading) {
    return <p>Charging users...</p>;
  }

  return (
    <div>
      <h1>Users</h1>
      <label htmlFor="search">Search by ID: </label>
      <input type="text" id="search" onChange={handleInputChange} />
      <label htmlFor="searchName">Search by name: </label>
      <input type="text" id="searchName" onChange={handleInputChangeName} />
      <p><a href="/createUser">Create</a></p>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>#</th>
            <th>_id</th>
            <th>Name</th>
            <th>Address</th>
            <th>City</th>
            <th>Blood type</th>
            <th>Created at</th>
            <th>Updated at</th>
          </tr>
        </thead>
        <tbody>
          {searchTerm === "" && users.map((user, index) => (
            <tr key={user._id}>
              <td>
                {index + 1}
                {editingId !== user._id ? (
                <>
                <button className="image-button" onClick={() => handleEditToggle(user._id)}>
                  <img src={pencilImage} alt="Edit" style={{ width: '20px', height: '20px' }} />
                </button>  
                
                <button className="image-button" onClick={() => handleDelete(user._id)}>
                  <img src={trashImage} alt="delete" style={{ width: '20px', height: '20px' }} />
                </button>
                </>
                ) : (  
                <button className="image-button" onClick={() => handleUpdate(user._id)}>
                    <img src={confirmImage} alt="Confirm" style={{ width: '20px', height: '20px' }} />
                </button>
                )}
              </td>
              <td>{user._id}</td>
              <td>
                {editingId === user._id ? (
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
                    {user.name}
                  </>
                )}
              </td>
              <td>
                {editingId === user._id ? (
                <input
                    type="text"
                    value={newAddress}
                    onChange={handleNewAddressChange}
                    placeholder="New address"
                />

                ) : (
                    <>
                        {user.address}
                    </>
                )}
              </td>
              <td>
                {editingId === user._id ? (
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
                        {user.city_id}
                    </>
                )}
              </td>
              <td>
                {editingId === user._id ? (
                <select name="newTypeId" id="newTypeId" value={newTypeId} onChange={handleNewTypeIdChange}>
                {newTypeId === "" &&
                <option value="">Select one</option>
                }
                {types.map((bloodType) => (
                    <option value={bloodType._id}>{bloodType.type+bloodType.factor}</option>

                ))}
                </select>

                ) : (
                    <>
                        {user.type_id}
                    </>
                )}
              </td>
              <td>{user.created_at}</td>
              <td>{user.updated_at}</td>
            </tr>
          ))}

          {searchTerm && item && (
            <tr key={item._id}>
              <td>1</td>
              <td>{item._id}</td>
              <td>{item.name}</td>
              <td>{item.address}</td>
              <td>{item.city_id}</td>
              <td>{item.type_id}</td>
              <td>{item.created_at}</td>
              <td>{item.updated_at}</td>
            </tr>
          )}

          {searchTerm && !item && (
            <tr>
              <td colSpan="6">User not found with the provided ID.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReadUser;
