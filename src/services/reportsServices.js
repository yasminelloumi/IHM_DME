import axios from "axios";

const JSON_SERVER_URL = "http://localhost:3001"; // For JSON data
const FILE_SERVER_URL = "http://localhost:3002"; // For file uploads

// For submitting reports (file upload)
export const submitReport = async (formData) => {
  try {
    // Validate FormData contents
    const requiredFields = ['file', 'patientId', 'description', 'dmeId', 'labTest'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Debug log FormData contents
    console.log("Service layer FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`);
    }

    const response = await axios.post(`${FILE_SERVER_URL}/reports`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; // Expected: { id, filePath, patientId, description, dmeId, labTest, fileName, ... }
  } catch (error) {
    console.error('Error submitting report:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    const errorMessage = error.response?.data?.message || error.message || 'Failed to submit report. Please try again.';
    throw new Error(errorMessage);
  }
};

// For fetching reports by patient (from JSON server)
export const getReportsByPatient = async (patientId) => {
  try {
    const response = await axios.get(`${JSON_SERVER_URL}/reports?patientId=${patientId}`);
    console.log("Fetched reports for patient", patientId, ":", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || 'Failed to fetch reports. Please try again.');
  }
};

// Get all reports (from JSON server)
export const getReports = async () => {
  try {
    const response = await axios.get(`${JSON_SERVER_URL}/reports`);
    console.log("Fetched all reports:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching all reports:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || 'Failed to fetch all reports. Please try again.');
  }
};