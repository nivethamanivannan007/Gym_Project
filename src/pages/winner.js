import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import './WinnerDashboard.css';

const WinnerDashboard = () => {
  const [scores, setScores] = useState([]);
  const [winners, setWinners] = useState([]);
  const [genderFilter, setGenderFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [disciplineFilter, setDisciplineFilter] = useState('');
  const [eventList, setEventList] = useState([]);
  const [disciplineList, setDisciplineList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [scoreRes, eventRes, disciplineRes] = await Promise.all([
        axios.get('http://localhost:5000/api/score/get'),
        axios.get('http://localhost:5000/api/event/get'),
        axios.get('http://localhost:5000/api/discipline/get'),
      ]);

      setScores(scoreRes.data);
      setEventList(eventRes.data);
      setDisciplineList(disciplineRes.data);
      processWinners(scoreRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const processWinners = (data) => {
    const grouped = {};

    data.forEach((item) => {
      const key = `${item.athleteId}-${item.eventId}-${item.disciplineId}`;
      const maxLift = Math.max(item.trial1 || 0, item.trial2 || 0, item.trial3 || 0);

      if (!grouped[key] || maxLift > grouped[key].maxLift) {
        grouped[key] = {
          athleteId: item.athleteId,
          eventId: item.eventId,
          disciplineId: item.disciplineId,
          athlete: item.athlete,
          maxLift,
          createdAt: item.createdAt,
        };
      }
    });

    setWinners(Object.values(grouped));
  };

  const filteredWinners = useMemo(() => {
    return winners.filter((w) => {
      const genderMatch = genderFilter === '' || w.athlete?.gender === genderFilter;
      const eventMatch = eventFilter === '' || w.eventId.toString() === eventFilter;
      const disciplineMatch = disciplineFilter === '' || w.disciplineId?.toString() === disciplineFilter;
      return genderMatch && eventMatch && disciplineMatch;
    });
  }, [winners, genderFilter, eventFilter, disciplineFilter]);

  return (
    <div className="winner-dashboard">
      <h2>🏆 Sports Winner Dashboard</h2>

      <div className="filters">
        <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}>
          <option value="">All Events</option>
          {eventList.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>

        <select value={disciplineFilter} onChange={(e) => setDisciplineFilter(e.target.value)}>
          <option value="">All Disciplines</option>
          {disciplineList.map((discipline) => (
            <option key={discipline.id} value={discipline.id}>
              {discipline.name}
            </option>
          ))}
        </select>
      </div>

      {filteredWinners.length === 0 ? (
        <p className="no-data">No winners found for the selected filters.</p>
      ) : (
        <table className="winner-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Athlete</th>
              <th>Gender</th>
              <th>Weight</th>
              <th>Category</th>
              <th>Max Lift</th>
              <th>Event</th>
              <th>Discipline</th>
              <th>Aadhar</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredWinners.map((w, i) => {
              const event = eventList.find((e) => e.id === w.eventId);
              const discipline = disciplineList.find((d) => d.id === w.disciplineId);
              const winDate = w.createdAt ? new Date(w.createdAt).toLocaleDateString() : 'N/A';
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{w.athlete?.name || 'N/A'}</td>
                  <td>{w.athlete?.gender || 'N/A'}</td>
                  <td>{w.athlete?.weight || 'N/A'}</td>
                  <td>{w.athlete?.weightCategory || 'N/A'}</td>
                  <td>{w.maxLift}</td>
                  <td>{event?.name || 'N/A'}</td>
                  <td>{discipline?.name || 'N/A'}</td>
                  <td>{w.athlete?.aadharNumber || 'N/A'}</td>
                  <td>{winDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WinnerDashboard;
