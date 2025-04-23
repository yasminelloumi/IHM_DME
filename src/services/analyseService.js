import axios from "axios";

const API_URL = "http://localhost:3001";
export const getLabTrends = async () => {
  const response = await axios.get(`${API_URL}/lab-trends`);
  return response.data;
};