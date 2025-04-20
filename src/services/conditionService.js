import axios from "axios";


const API_URL = "http://localhost:3001";

export const getConditionsByPatientId = async (patientId) => {
  const res = await fetch(`${API_URL}/conditions?patientId=${patientId}`);
  if (!res.ok) throw new Error("Failed to fetch conditions");
  return await res.json();
};
export const createCondition = async (conditionData) => {
  try {
    const response = await axios.post(`${API_URL}/conditions`, conditionData);
    return response.data;
  } catch (error) {
    console.error("Error creating condition:", error);
    throw error;
  }
};

