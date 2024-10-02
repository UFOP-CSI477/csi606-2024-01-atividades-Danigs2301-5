import { useEffect, useState } from "react";
import get from "../functionGet";
import getId from "../functionGetId";
import pencilImage from "../images/pencil.png";
import confirmImage from "../images/confirm.png";
import trashImage from "../images/trash.png";
import patch from "../functionPatch";
import deleteApi from "../functionDelete";

function ReadDonation() {
  const [donations, setDonations] = useState([]);
  const [users, setUsers] = useState([]);
  const [collectionLocations, setCollectionLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [item, setItem] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newUserId, setNewUserId] = useState("");
  const [newCollectionLocationId, setNewCollectionLocationId] = useState("");
  const [newDate, setNewDate] = useState("");

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const fetchedDonations = await get("donations");
        setDonations(fetchedDonations);
      } catch (error) {
        console.error("Error fetching blood types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);

    if (inputValue) {
      fetchDonationsId(inputValue);
    } else {
      setItem(null);
    }
  };

  const fetchDonationsId = async (id) => {
    try {
      const fetchedDonationsId = await getId("donations", id, "identificator");
      setItem(fetchedDonationsId);
    } catch (error) {
      console.log("ID not found:", error);
      setItem(null);
    }
  };

  const handleEditToggle = async (id) => {
    if (editingId === id) {
      setEditingId(null);
      setNewUserId("");
      setNewCollectionLocationId("");
      setNewDate("");
    } else {
      setEditingId(id);
      const donation = donations.find((name) => name._id === id);
      setUsers(await get("users"))
      setCollectionLocations(await get("collection_locations"))
      setNewUserId(donation?.user_id || "");
      setNewCollectionLocationId(donation?.location_id || "");
      setNewDate(donation?.data || "");
    }
  };

  const handleNewUserIdChange = (e) => {
    setNewUserId(e.target.value);
  };

  const handleNewCollectionLocationIdChange = (e) => {
    setNewCollectionLocationId(e.target.value);
  };

  const handleNewDateChange = (e) => {
    setNewDate(e.target.value);
  };


  const handleUpdate = async (id) => {
    if (newUserId || newCollectionLocationId || newDate) {
      try {
        await patch(id, "user_id", newUserId, "donations");
        await patch(id, "location_id", newCollectionLocationId, "donations");
        await patch(id, "data", newDate, "donations");
        setEditingId(null);
        setNewUserId("");
        setNewCollectionLocationId("");
        setNewDate("");
        window.location.reload();
      } catch (error) {
        console.log("Error updating:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try{
      deleteApi(id, 'donations')
      window.location.reload();
    } catch (error) {
      console.log("Error updating:", error);
    }
  }
  if (loading) {
    return <p>Charging donations...</p>;
  }

  return (
    <div>
      <h1>Donations</h1>
      <label htmlFor="search">Search by ID: </label>
      <input type="text" id="search" value={searchTerm} onChange={handleInputChange} />
      <p><a href="/createDonation">Create</a></p>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>#</th>
            <th>_id</th>
            <th>User</th>
            <th>Collection location</th>
            <th>Date</th>
            <th>Created at</th>
            <th>Updated at</th>
          </tr>
        </thead>
        <tbody>
          {searchTerm === "" && donations.map((donation, index) => (
            <tr key={donation._id}>
              <td>
                {index + 1}
                {editingId !== donation._id ? (
                <>
                <button className="image-button" onClick={() => handleEditToggle(donation._id)}>
                  <img src={pencilImage} alt="Edit" style={{ width: '20px', height: '20px' }} />
                </button>  
                
                <button className="image-button" onClick={() => handleDelete(donation._id)}>
                  <img src={trashImage} alt="delete" style={{ width: '20px', height: '20px' }} />
                </button>
                </>
                ) : (  
                <button className="image-button" onClick={() => handleUpdate(donation._id)}>
                    <img src={confirmImage} alt="Confirm" style={{ width: '20px', height: '20px' }} />
                </button>
                )}
              </td>
              <td>{donation._id}</td>
              <td>
                {editingId === donation._id ? (
                  <>
                    <select name="newUserId" id="newUserId" value={newUserId} onChange={handleNewUserIdChange}>
                        {newUserId === "" &&
                        <option value="">Select one</option>
                        }
                        {users.map((user) => (
                            <option value={user._id}>{user.name}</option>

                        ))}
                    </select>
                  </>
                ) : (
                  <>
                    {donation.user_id}
                  </>
                )}
              </td>
              <td>
                {editingId === donation._id ? (
                <>
                <select name="newColllectionLocationId" id="newColllectionLocationId" value={newCollectionLocationId} onChange={handleNewCollectionLocationIdChange}>
                    {newCollectionLocationId === "" &&
                    <option value="">Select one</option>
                    }
                    {collectionLocations.map((collectionLocation) => (
                        <option value={collectionLocation._id}>{collectionLocation.name}</option>
                    ))}
                </select>
                </>
                ) : (
                    <>
                        {donation.location_id}
                    </>
                )}
              </td>
              <td>
                {editingId === donation._id ? (
                <input type="Date" name="newDate" id="newDate" value={newDate} onChange={handleNewDateChange}/>
                ) : (
                    <>
                        {donation.data}
                    </>
                )}
              </td>
              <td>{donation.created_at}</td>
              <td>{donation.updated_at}</td>
            </tr>
          ))}

          {searchTerm && item && (
            <tr key={item._id}>
              <td>1</td>
              <td>{item._id}</td>
              <td>{item.user_id}</td>
              <td>{item.location_id}</td>
              <td>{item.date}</td>
              <td>{item.created_at}</td>
              <td>{item.updated_at}</td>
            </tr>
          )}

          {searchTerm && !item && (
            <tr>
              <td colSpan="6">Donation not found with the provided ID.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReadDonation;
