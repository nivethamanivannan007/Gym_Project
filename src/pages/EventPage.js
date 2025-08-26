import React, { useEffect, useState } from 'react';
import './event.css';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getGyms,
  getRefereesByEvent,
  createReferee,
  deleteRefereesByEvent
} from '../service/api';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [gyms, setGyms] = useState([]);
  const [refereesByEvent, setRefereesByEvent] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editEventId, setEditEventId] = useState(null);

  const [eventData, setEventData] = useState({
    name: '',
    location: '',
    date: '',
    time: '',
    organiserGymId: '',
    refereeName: ''
  });

  useEffect(() => {
    fetchEvents();
    fetchGyms();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data);
      fetchRefereesForAllEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  const fetchRefereesForAllEvents = async (eventsList) => {
    const all = {};
    for (const event of eventsList) {
      try {
        const res = await getRefereesByEvent(event.id);
        all[event.id] = res.data;
      } catch (err) {
        console.error(`Error fetching referees for event ${event.id}`);
      }
    }
    setRefereesByEvent(all);
  };

  const fetchGyms = async () => {
    try {
      const res = await getGyms();
      setGyms(res.data);
    } catch (err) {
      console.error('Failed to fetch gyms:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { name, location, date, time, organiserGymId, refereeName } = eventData;
    if (!name || !location || !date || !time || !organiserGymId || !refereeName) {
      return alert('Please fill in all fields including referee');
    }

    try {
      if (isEditing) {
        await updateEvent(editEventId, {
          name,
          location,
          date: new Date(date),
          time,
          organiserGymId: parseInt(organiserGymId)
        });

        await deleteRefereesByEvent(editEventId);

        await createReferee({
          name: refereeName,
          gymId: parseInt(organiserGymId),
          eventId: editEventId
        });

        alert('Event and Referee updated successfully');
      } else {
        const eventRes = await createEvent({
          name,
          location,
          date: new Date(date),
          time,
          organiserGymId: parseInt(organiserGymId)
        });

        const newEventId = eventRes.data.id;

        await createReferee({
          name: refereeName,
          gymId: parseInt(organiserGymId),
          eventId: newEventId
        });

        alert('Event and Referee created successfully');
      }

      setEventData({ name: '', location: '', date: '', time: '', organiserGymId: '', refereeName: '' });
      setIsEditing(false);
      setEditEventId(null);
      fetchEvents();
    } catch (err) {
      console.error('Submit Error:', err);
      alert('Failed to submit event');
    }
  };

  const handleEdit = (event) => {
    setIsEditing(true);
    setEditEventId(event.id);
    setEventData({
      name: event.name,
      location: event.location,
      date: event.date.split('T')[0],
      time: event.time,
      organiserGymId: event.organiserGymId.toString(),
      refereeName: (refereesByEvent[event.id]?.[0]?.name || '')
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event and its referee(s)?')) {
      try {
        await deleteRefereesByEvent(id);
        await deleteEvent(id);
        fetchEvents();
        alert('Event and its referees deleted successfully');
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete event or referees');
      }
    }
  };

  return (
    <div className="event-container">
      <h2 className="page-title">Event Management</h2>
      <p className="page-subtitle">Create and manage powerlifting competitions</p>

      <div className="event-layout">
        {/* Left Side: Form */}
        <div className="card event-form">
          <h3 className="card-title">{isEditing ? 'Edit Event' : '➕ Create New Event'}</h3>
          <p className="card-subtitle">Set up a new powerlifting competition event</p>

          <input type="text" name="name" placeholder="Event Name *" value={eventData.name} onChange={handleChange} />
          <select name="organiserGymId" value={eventData.organiserGymId} onChange={handleChange}>
            <option value="">Select organizing gym *</option>
            {gyms.map((gym) => (
              <option key={gym.id} value={gym.id}>{gym.name}</option>
            ))}
          </select>
          <input type="text" name="location" placeholder="Location *" value={eventData.location} onChange={handleChange} />
          <input type="date" name="date" value={eventData.date} onChange={handleChange} />
          <input type="text" name="time" placeholder="Event Time *" value={eventData.time} onChange={handleChange} />
          <input type="text" name="refereeName" placeholder="Referee Name *" value={eventData.refereeName} onChange={handleChange} />

          <div className="button-group">
            <button className="btn clear" onClick={() => setEventData({ name: '', location: '', date: '', time: '', organiserGymId: '', refereeName: '' })}>Cancel</button>
            <button className="btn add" onClick={handleSubmit}>
              {isEditing ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </div>

        {/* Right Side: Events List */}
        <div className="card event-list">
          <h3 className="card-title">📅 Existing Events</h3>
          <div className="event-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <h4>{event.name}</h4>
                <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                <p>📍 {event.location}</p>
                <p>🏋️‍♂️ {refereesByEvent[event.id]?.length || 0} referees</p>
                <div className="card-actions">
                  <button className="btn edit" onClick={() => handleEdit(event)}>Edit</button>
                  <button className="btn delete" onClick={() => handleDelete(event.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManagement;
