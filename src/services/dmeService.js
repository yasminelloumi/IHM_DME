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
    const response = await fetch('http://localhost:3001/dme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dmeData)
    });

    if (!response.ok) {
      throw new Error('Failed to create DME');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
// Remove a specific laboTest from a DME's laboTest array
export const removeLaboTest = async (dmeId, laboTestToRemove) => {
  try {
    // 1. Fetch current DME object
    const dmeRes = await fetch(`${apiUrl}/dme/${dmeId}`);
    if (!dmeRes.ok) throw new Error("Failed to fetch DME");
    const dme = await dmeRes.json();

    // 2. Filter out the laboTest
    const updatedLaboTests = dme.laboTest.filter(test => test !== laboTestToRemove);

    // 3. Send PATCH request with updated array
    const patchRes = await fetch(`${apiUrl}/dme/${dmeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ laboTest: updatedLaboTests }),
    });

    if (!patchRes.ok) {
      throw new Error(`Failed to update DME: ${patchRes.status}`);
    }

    const data = await patchRes.json();
    console.log(`Updated laboTest for DME ${dmeId}:`, data);
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to remove laboTest. Please try again.");
  }
};
