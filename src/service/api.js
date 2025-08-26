import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

/* -- GYM API -- */
export const getGyms = () => axios.get(`${BASE_URL}/gym/get`);
export const createGym = (data) => axios.post(`${BASE_URL}/gym/create`, data);
export const updateGym = (id, data) => axios.put(`${BASE_URL}/gym/update/${id}`, data);
export const deleteGym = (id) => axios.delete(`${BASE_URL}/gym/delete/${id}`);
export const getGymsDropdown = () => axios.get(`${BASE_URL}/gym/dropdown`); // ✅ Added

/* -- EVENT API -- */
export const getEvents = () => axios.get(`${BASE_URL}/event/get`);
export const createEvent = (data) => axios.post(`${BASE_URL}/event/create`, data);
export const updateEvent = (id, data) => axios.put(`${BASE_URL}/event/update/${id}`, data);
export const deleteEvent = (id) => axios.delete(`${BASE_URL}/event/delete/${id}`);
export const getEventsDropdown = () => axios.get(`${BASE_URL}/event/dropdown`); // ✅ Already present

/* -- REFEREE API -- */
export const getRefereesByEvent = (eventId) =>
  axios.get(`${BASE_URL}/refree/by-event/${eventId}`);

export const createReferee = (data) =>
  axios.post(`${BASE_URL}/refree/create`, {
    ...data,
    gymId: parseInt(data.gymId),
    eventId: parseInt(data.eventId),
  });

export const deleteRefereesByEvent = (eventId) =>
  axios.delete(`${BASE_URL}/refree/delete-by-event/${eventId}`);

/* -- ATHLETE API -- */
export const getAthletes = () => axios.get(`${BASE_URL}/athlete/get`);
export const createAthlete = (data) => axios.post(`${BASE_URL}/athlete/create`, data);
export const updateAthlete = (id, data) => axios.put(`${BASE_URL}/athlete/update/${id}`, data);
export const deleteAthlete = (id) => axios.delete(`${BASE_URL}/athlete/delete/${id}`);
export const getAthletesByEvent = (eventId) =>
  axios.get(`${BASE_URL}/athlete/by-event/${eventId}`);

/* -- SCORE API -- */
export const getScores = () => axios.get(`${BASE_URL}/score/get`);
export const createScore = (data) => axios.post(`${BASE_URL}/score/create`, data);
export const updateScore = (id, data) => axios.put(`${BASE_URL}/score/update/${id}`, data);
export const deleteScore = (id) => axios.delete(`${BASE_URL}/score/delete/${id}`);

/* -- Utility / Dropdown APIs -- */
export const getDisciplines = () => axios.get(`${BASE_URL}/discipline/get`);
