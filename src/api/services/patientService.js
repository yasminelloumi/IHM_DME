import api from '../services/api';

export const getAllPatients = async () => {
  const response = await api.get('/patients');
  return response.data;
};

export const addPatient = async (patient) => {
  const response = await api.post('/patients', patient);
  return response.data;
};