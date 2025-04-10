import axios from "axios";

const API_URL = "http://localhost:3001";

// Fetch patient profile by ID
export const getPatientProfile = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/patients/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching patient profile");
  }
};

// Update patient profile
export const updatePatientProfile = async (id, updatedData) => {
  try {
    const response = await axios.patch(`${API_URL}/patients/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw new Error("Error updating patient profile");
  }
};
