import axios from "axios";


const API_URL = "http://localhost:3001";

export const getAllPatients = async () => {
  const response = await axios.get(`${API_URL}/patients`);
  return response.data;
};
export const addPatient = async (patient) => {
  const response = await api.post('/patients', patient);
  return response.data;
};
export const getPatientByCIN = async (cin) => {
  try {
    const response = await axios.get(`${API_URL}/patients?cin=${cin}`);
    return response.data[0]; // Assuming the data is returned as an array
  } catch (error) {
    console.error("Error fetching patient data:", error);
    return null;
  }
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