import axios from "axios";

const API_URL = "http://localhost:3001";

// Function to authenticate patients
export const authenticatePatient = async (cin, password) => {
  try {
    const response = await axios.get(`${API_URL}/patients?CIN=${cin}&password=${password}`);
    return response.data;
  } catch (error) {
    throw new Error("Error authenticating patient");
  }
};

// Function to authenticate medical staff
export const authenticateStaff = async (matricule, password) => {
    try {
      const endpoints = ['medecins', 'laboratoire', 'centreImagerie'];
  
      for (const endpoint of endpoints) {
        const response = await axios.get(`${API_URL}/${endpoint}?matricule=${matricule}&password=${password}`);
        
        if (response.data.length > 0) {
          return { ...response.data[0], role: endpoint }; // Add role info for context
        }
      }
  
      // If no match found in any table
      throw new Error("Invalid credentials");
    } catch (error) {
      throw new Error("Error authenticating medical staff");
    }
  };
  