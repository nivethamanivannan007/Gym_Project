import React, { useEffect, useState } from "react";
import './gym.css';
import {
  getGyms,
  createGym,
  updateGym,
  deleteGym
} from '../service/api';

const GymManagement = () => {
  const [gymData, setGymData] = useState({
    name: "",
    ownerName: "",
    coachName: "",
    address: "",
    pincode: "",
    phone: "",
  });

  const [gymList, setGymList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchGyms();
  }, []);

  const fetchGyms = async () => {
    try {
      const response = await getGyms();
      setGymList(response.data);
    } catch (error) {
      console.error("Error fetching gyms:", error);
    }
  };

  const handleChange = (e) => {
    setGymData({ ...gymData, [e.target.name]: e.target.value });
  };

  const handleAddGym = async () => {
    if (
      gymData.name &&
      gymData.ownerName &&
      gymData.coachName &&
      gymData.address &&
      gymData.pincode &&
      gymData.phone
    ) {
      try {
        const response = await createGym(gymData);
        setGymList([...gymList, response.data]);
        clearForm();
        alert("Gym added successfully!");
      } catch (error) {
        console.error("Error adding gym:", error);
        alert("Failed to add gym");
      }
    } else {
      alert("Please fill in all fields");
    }
  };

  const clearForm = () => {
    setGymData({
      name: "",
      ownerName: "",
      coachName: "",
      address: "",
      pincode: "",
      phone: "",
    });
    setEditMode(false);
    setEditId(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteGym(id);
      alert("Gym deleted successfully");
      fetchGyms();
    } catch (error) {
      console.error("Error deleting gym:", error);
      alert("Failed to delete gym");
    }
  };

  const handleEdit = (gym) => {
    setGymData(gym);
    setEditMode(true);
    setEditId(gym.id);
  };

  const handleUpdate = async () => {
    try {
      await updateGym(editId, gymData);
      alert("Gym updated successfully");
      clearForm();
      fetchGyms();
    } catch (error) {
      console.error("Error updating gym:", error);
      alert("Failed to update gym");
    }
  };

  return (
    <div className="gym-container">
      <h2 className="title">Gym Management</h2>
      <p className="subtitle">Register and manage gym details</p>

      <div className="gym-layout">
        {/* Left Side - Form */}
        <div className="form-section card">
          <h3>{editMode ? "✏️ Edit Gym" : "➕ Add New Gym"}</h3>
          <input type="text" name="name" placeholder="Gym Name *" value={gymData.name} onChange={handleChange} />
          <input type="text" name="ownerName" placeholder="Owner Name *" value={gymData.ownerName} onChange={handleChange} />
          <input type="text" name="coachName" placeholder="Coach Name *" value={gymData.coachName} onChange={handleChange} />
          <input type="text" name="address" placeholder="Address *" value={gymData.address} onChange={handleChange} />
          <input type="text" name="pincode" placeholder="Pincode *" value={gymData.pincode} onChange={handleChange} />
          <input type="text" name="phone" placeholder="Phone *" value={gymData.phone} onChange={handleChange} />

          <div className="button-group">
            {editMode ? (
              <button className="btn update" onClick={handleUpdate}>Update Gym</button>
            ) : (
              <button className="btn add" onClick={handleAddGym}>Add Gym</button>
            )}
            <button className="btn clear" onClick={clearForm}>Clear</button>
          </div>
        </div>

        {/* Right Side - Gym Cards */}
        <div className="gym-list">
          <h3>📋 Registered Gyms</h3>
          <div className="card-grid">
            {gymList.map((gym) => (
              <div className="gym-card" key={gym.id}>
                <h4>{gym.name}</h4>
                <p>👑 <strong>Owner:</strong> {gym.ownerName}</p>
                <p>🧑‍🏫 <strong>Coach:</strong> {gym.coachName}</p>
                <p>📍 <strong>Address:</strong> {gym.address}</p>
                <p>🏷️ <strong>Pincode:</strong> {gym.pincode}</p>
                <p>📞 <strong>Phone:</strong> {gym.phone}</p>
                <div className="card-actions">
                  <button className="btn edit" onClick={() => handleEdit(gym)}>Edit</button>
                  <button className="btn delete" onClick={() => handleDelete(gym.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymManagement;
