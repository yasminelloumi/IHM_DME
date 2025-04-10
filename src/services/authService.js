import axios from "axios";

const API_URL = "http://localhost:3001";

// Function to authenticate patients
export const authenticatePatient = async (cin, password) => {
    try {
      const response = await axios.get(`${API_URL}/patients?CIN=${cin}&password=${password}`);
      
      console.log("API Response:", response.data); // Log the full response
  
      if (response.data.length > 0) {
        localStorage.setItem("connectedUser", JSON.stringify(response.data[0]));
        return response.data[0];
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error); // Log the error details
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
          // Return the first matching staff member
          const userData = { ...response.data[0], role: endpoint };
          localStorage.setItem("connectedUser", JSON.stringify(userData));
          return userData;
        }
      }
  
      throw new Error("Invalid credentials");
    } catch (error) {
      throw new Error("Error authenticating medical staff");
    }
  };
  