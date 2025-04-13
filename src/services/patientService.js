import axios from "axios";


const API_URL = "http://localhost:3001";

export const getAllPatients = async () => {
  const response = await api.get('/patients');
  return response.data;
};

export const addPatient = async (patient) => {
  const response = await api.post('/patients', patient);
  return response.data;
};
export const getPatientByCIN = async (cin) => {
  const response = await api.get(`/patients?cin=${cin}`);
  return response.data[0]; // because it returns an array
};
