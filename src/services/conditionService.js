import axios from "axios";


const API_URL = "http://localhost:3001";

export const getConditionsByPatientId = async (patientId) => {
  const res = await fetch(`${API_URL}/conditions?patientId=${patientId}`);
  if (!res.ok) throw new Error("Failed to fetch conditions");
  return await res.json();
};


