import { useEffect, useState } from "react";
import get from "../functionGet";
import getId from "../functionGetId";
import pencilImage from "../images/pencil.png";
import confirmImage from "../images/confirm.png";
import trashImage from "../images/trash.png";
import patch from "../functionPatch";
import deleteApi from "../functionDelete";

function ReadBloodType() {
  const [bloodTypes, setBloodTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [item, setItem] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newType, setNewType] = useState("");
  const [newFactor, setNewFactor] = useState("");

  useEffect(() => {
    const fetchBloodTypes = async () => {
      try {
        const fetchedBloodTypes = await get("blood_type");
        setBloodTypes(fetchedBloodTypes);
      } catch (error) {
        console.error("Error fetching blood types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBloodTypes();
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);

    if (inputValue) {
      fetchBloodTypeById(inputValue);
    } else {
      setItem(null);
    }
  };

  const fetchBloodTypeById = async (id) => {
    try {
      const fetchedBloodTypeId = await getId("blood_type", id, "identificator");
      setItem(fetchedBloodTypeId);
    } catch (error) {
      console.log("ID not found:", error);
      setItem(null);
    }
  };

  const handleEditToggle = (id) => {
    if (editingId === id) {
      setEditingId(null);
      setNewType("");
      setNewFactor("");
    } else {
      setEditingId(id);
      const bloodType = bloodTypes.find((type) => type._id === id);
      setNewType(bloodType?.type || "");
      setNewFactor(bloodType?.factor || ""); // Cargar el factor actual en el input
    }
  };

  const handleNewTypeChange = (e) => {
    setNewType(e.target.value);
  };

  const handleNewFactorChange = (e) => {
    setNewFactor(e.target.value);
  };

  const handleUpdate = async (id) => {
    if (newType || newFactor) {
      try {
        await patch(id, "type", newType, "blood_type");
        await patch(id, "factor", newFactor, "blood_type");
        setEditingId(null);
        setNewType("");
        setNewFactor("");
        window.location.reload();
      } catch (error) {
        console.log("Error updating:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try{
      deleteApi(id, 'blood_type')
      window.location.reload();
    } catch (error) {
      console.log("Error updating:", error);
    }
  }
  if (loading) {
    return <p>Cargando tipos de sangre...</p>;
  }

  return (
    <div>
      <h1>Blood Types</h1>
      <label htmlFor="search">Search by ID: </label>
      <input type="text" id="search" value={searchTerm} onChange={handleInputChange} />
      <p><a href="/createBloodType">Create</a></p>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>#</th>
            <th>_id</th>
            <th>Type</th>
            <th>Factor</th>
            <th>Created at</th>
            <th>Updated at</th>
          </tr>
        </thead>
        <tbody>
          {searchTerm === "" && bloodTypes.map((bloodType, index) => (
            <tr key={bloodType._id}>
              <td>
                {index + 1}
                {editingId !== bloodType._id &&
                <button className="image-button" onClick={() => handleEditToggle(bloodType._id)}>
                  <img src={pencilImage} alt="Edit" style={{ width: '20px', height: '20px' }} />
                </button>  
                }
                <button className="image-button" onClick={() => handleDelete(bloodType._id)}>
                  <img src={trashImage} alt="delete" style={{ width: '20px', height: '20px' }} />
                </button>  
              </td>
              <td>{bloodType._id}</td>
              <td>
                {editingId === bloodType._id ? (
                  <>
                    <input
                      type="text"
                      value={newType}
                      onChange={handleNewTypeChange}
                      placeholder="New type"
                    />
                    <input
                      type="text"
                      value={newFactor}
                      onChange={handleNewFactorChange}
                      placeholder="New factor"
                    />
                    <button className="image-button" onClick={() => handleUpdate(bloodType._id)}>
                      <img src={confirmImage} alt="Confirm" style={{ width: '20px', height: '20px' }} />
                    </button>
                  </>
                ) : (
                  <>
                    {bloodType.type}
                  </>
                )}
              </td>
              <td>{bloodType.factor}</td>
              <td>{bloodType.created_at}</td>
              <td>{bloodType.updated_at}</td>
            </tr>
          ))}

          {searchTerm && item && (
            <tr key={item._id}>
              <td>1</td>
              <td>{item._id}</td>
              <td>{item.type}</td>
              <td>{item.factor}</td>
              <td>{item.created_at}</td>
              <td>{item.updated_at}</td>
            </tr>
          )}

          {searchTerm && !item && (
            <tr>
              <td colSpan="6">Blood type not found with the provided ID.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReadBloodType;
