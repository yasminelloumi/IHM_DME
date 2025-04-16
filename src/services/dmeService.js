// src/services/dmeService.js

const apiUrl = "http://localhost:3001"; // Replace with your backend API URL

// Fetch all DMEs for a specific patient by CIN (or patient ID)
export const getDMEByPatientCIN = async (patientCIN) => {
  try {
    const response = await fetch(`${apiUrl}/patient/${patientCIN}`);
    if (!response.ok) throw new Error("Failed to fetch DME data");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const getDMEByPatientId = async (patientId) => {
  try {
    const response = await fetch(`${apiUrl}/dme?patientId=${patientId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch DME records. Please check your connection and try again.");
  }
};
// Fetch a specific DME by its ID
export const getDMEById = async (dmeId) => {
  try {
    const response = await fetch(`${apiUrl}/${dmeId}`);
    if (!response.ok) throw new Error("Failed to fetch DME data");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Create a new DME
export const createDME = async (dmeData) => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dmeData),
    });
    if (!response.ok) throw new Error("Failed to create DME");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};


