

import axios from "axios";
export const getAllPatients = async () => {
  const response = await api.get('/patients');
  return response.data;
};

export const addPatient = async (patient) => {
  const response = await api.post('/patients', patient);
  return response.data;
};


export const getPatientById = async (patientId) => {
  try {
    const response = await axios.get(`http://localhost:3001/patients/${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient:", error);
    throw error;
  }
};