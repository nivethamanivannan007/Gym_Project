import React, { useEffect, useState } from 'react';
import './athlete.css';
import {
  getAthletes,
  createAthlete,
  updateAthlete,
  deleteAthlete,
  getGymsDropdown,
  getEventsDropdown
} from '../service/api';

const getWeightCategory = (age, weight, gender) => {
  if (!age || !weight || !gender) return "";
  const ageNum = parseInt(age);
  const weightNum = parseFloat(weight);
  gender = gender.toLowerCase();

  let ageCategory = "";
  if (ageNum >= 14 && ageNum <= 18) ageCategory = "Sun Junior";
  else if (ageNum >= 19 && ageNum <= 23) ageCategory = "Junior";
  else if (ageNum >= 24 && ageNum <= 39) ageCategory = "Senior";
  else if (ageNum >= 40 && ageNum <= 49) ageCategory = "Master 1";
  else if (ageNum >= 50 && ageNum <= 59) ageCategory = "Master 2";
  else if (ageNum >= 60 && ageNum <= 69) ageCategory = "Master 3";
  else if (ageNum >= 70 && ageNum <= 79) ageCategory = "Master 4";
  else if (ageNum >= 80 && ageNum <= 99) ageCategory = "Master 5";
  else return "Invalid Age";

  const weightRanges = {
    male: {
      "Sun Junior": weightNum <= 53,
      "Junior": weightNum >= 54 && weightNum <= 59,
      "Senior": weightNum >= 60 && weightNum <= 66,
      "Master 1": weightNum >= 67 && weightNum <= 74,
      "Master 2": weightNum >= 75 && weightNum <= 83,
      "Master 3": weightNum >= 84 && weightNum <= 93,
      "Master 4": weightNum >= 94 && weightNum <= 105,
      "Master 5": weightNum >= 106,
    },
    female: {
      "Sun Junior": weightNum <= 43,
      "Junior": weightNum >= 44 && weightNum <= 47,
      "Senior": weightNum >= 48 && weightNum <= 52,
      "Master 1": weightNum >= 53 && weightNum <= 57,
      "Master 2": weightNum >= 58 && weightNum <= 63,
      "Master 3": weightNum >= 64 && weightNum <= 69,
      "Master 4": weightNum >= 70 && weightNum <= 76,
      "Master 5": weightNum >= 77,
    },
  };

  const genderKey = gender === "male" ? "male" : "female";
  const isValidWeight = weightRanges[genderKey][ageCategory];

  return isValidWeight ? ageCategory : "Invalid Weight for Age Category";
};

const AthleteReg = () => {
  const [getdata, setgetdata] = useState([]);
  const [gyms, setGyms] = useState([]);
  const [events, setEvents] = useState([]);
  const [view, setview] = useState({
    name: '', dob: '', age: '', gender: '', weight: '', weightCategory: '',
    aadharNumber: '', mobile: '', eventId: '', gymId: ''
  });

  const [photo, setphoto] = useState(null);
  const [aadhar, setaadhar] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
    fetchGymsAndEvents();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getAthletes();
      setgetdata(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const fetchGymsAndEvents = async () => {
    const gymRes = await getGymsDropdown();
    const eventRes = await getEventsDropdown();
    setGyms(gymRes.data);
    setEvents(eventRes.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...view, [name]: value };

    if ((name === "age" || name === "weight" || name === "gender") &&
      updated.age && updated.weight && updated.gender) {
      updated.weightCategory = getWeightCategory(updated.age, updated.weight, updated.gender);
    }

    setview(updated);
  };

  const handleEdit = (athlete) => {
    setview({
      name: athlete.name,
      dob: athlete.dob.split("T")[0],
      age: athlete.age,
      gender: athlete.gender,
      weight: athlete.weight,
      weightCategory: athlete.weightCategory,
      aadharNumber: athlete.aadharNumber,
      mobile: athlete.mobile,
      eventId: athlete.eventId,
      gymId: athlete.gymId
    });
    setIsEdit(true);
    setEditId(athlete.id);
    setphoto(null);
    setaadhar(null);
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{12}$/.test(view.aadharNumber)) {
      alert("Aadhar number must be exactly 12 digits.");
      return;
    }

    if (!/^\d{10}$/.test(view.mobile)) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }

    const data = new FormData();
    Object.keys(view).forEach((key) => {
      data.append(key, view[key]);
    });
    if (photo) data.append("photo", photo);
    if (aadhar) data.append("aadhar", aadhar);

    try {
      if (isEdit) {
        await updateAthlete(editId, data);
        alert("Athlete Updated Successfully");
      } else {
        await createAthlete(data);
        alert("Athlete Registered Successfully");
      }

      setIsEdit(false);
      setEditId(null);
      setview({ name: '', dob: '', age: '', gender: '', weight: '', weightCategory: '', aadharNumber: '', mobile: '', eventId: '', gymId: '' });
      setphoto(null);
      setaadhar(null);
      fetchData();
    } catch (error) {
      console.error("Error submitting form", error);
      alert(error.response?.data?.error || "Error saving athlete");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAthlete(id);
      alert("Deleted successfully");
      fetchData();
    } catch (error) {
      alert("Error deleting athlete");
    }
  };

  return (
    <div className="athlete-container">
      <h2>{isEdit ? 'Edit Athlete' : 'Athlete Registration'}</h2>
      <form onSubmit={handlesubmit} className="athlete-form">
        <label>Name<input type="text" name="name" value={view.name} onChange={handleChange} required /></label>
        <label>DOB<input type="date" name="dob" value={view.dob} onChange={handleChange} required /></label>
        <label>Age<input type="number" name="age" value={view.age} onChange={handleChange} required /></label>
        <label>Gender<select name="gender" value={view.gender} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select></label>
        <label>Weight<input type="number" name="weight" value={view.weight} onChange={handleChange} required /></label>
        <label>Weight Category<input type="text" name="weightCategory" value={view.weightCategory} readOnly style={{ backgroundColor: "#f0f0f0" }} /></label>
        <label>Aadhar Number<input type="text" name="aadharNumber" value={view.aadharNumber} onChange={handleChange} required /></label>
        <label>Mobile<input type="text" name="mobile" value={view.mobile} onChange={handleChange} required /></label>

        <label>Event<select name="eventId" value={view.eventId} onChange={handleChange} required>
          <option value="">Select Event</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select></label>

        <label>Gym<select name="gymId" value={view.gymId} onChange={handleChange} required>
          <option value="">Select Gym</option>
          {gyms.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select></label>

        <label>Photo<input type="file" onChange={(e) => setphoto(e.target.files[0])} /></label>
        <label>Aadhar<input type="file" onChange={(e) => setaadhar(e.target.files[0])} /></label>
        <button type="submit">{isEdit ? 'Update' : 'Submit'}</button>
      </form>

      <table className="athlete-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>DOB</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Weight</th>
            <th>Weight Category</th>
            <th>Mobile</th>
            <th>Photo</th>
            <th>Aadhar</th>
            <th>Event</th>
            <th>Gym</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {getdata.map((data) => (
            <tr key={data.id}>
              <td>{data.name}</td>
              <td>{new Date(data.dob).toLocaleDateString()}</td>
              <td>{data.age}</td>
              <td>{data.gender}</td>
              <td>{data.weight}</td>
              <td>{data.weightCategory}</td>
              <td>{data.mobile}</td>
              <td>{data.photoUrl && <img src={`http://localhost:5000/uploads/${data.photoUrl}`} alt="photo" width="50" />}</td>
              <td>{data.aadharUrl && <img src={`http://localhost:5000/uploads/${data.aadharUrl}`} alt="aadhar" width="50" />}</td>
              <td>{data.event?.name || data.eventId}</td>
              <td>{data.gym?.name || data.gymId}</td>
              <td><button onClick={() => handleEdit(data)}>Edit</button></td>
              <td><button onClick={() => handleDelete(data.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AthleteReg;
