import axios from "axios";

const API_URL = "http://localhost:3001";

// Get reports for a patient
export const getReportsByPatient = async (patientId) => {
  const res = await axios.get(`${API_URL}/reports?patientId=${patientId}`);
  return res.data;
};

// Add a new report (simulate PDF upload via metadata)
export const getLabStats = async () => {
    const response = await axios.get(`${API_URL}/lab-stats`);
    return response.data;
  };
  
  export const getRecentTestTypes = async () => {
    const response = await axios.get(`${API_URL}/test-types`);
    return response.data;
  };
