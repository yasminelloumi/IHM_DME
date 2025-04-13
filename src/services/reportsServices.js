import axios from "axios";

const API_URL = "http://localhost:3001"; 

export const submitReport = async (formData) => {
  const response = await axios.post(`${API_URL}/reports`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getReports = async () => {
  const response = await axios.get(`${API_URL}/reports`);
  return response.data;
};