import axios from "axios";

// Add a new report
const JSON_SERVER_URL = "http://localhost:3001"; // For JSON data
const FILE_SERVER_URL = "http://localhost:3002"; // For file uploads

// For submitting reports (file upload)
export const submitReport = async (formData) => {
  try {
    const response = await axios.post(`${FILE_SERVER_URL}/reports`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting report:', error);
    throw new Error('Failed to submit report.');
  }
};

// For fetching reports (from JSON server)
export const getReportsByPatient = async (patientId) => {
  try {
    const response = await axios.get(`${JSON_SERVER_URL}/reports?patientId=${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw new Error("Failed to fetch reports.");
  }
};

// Get all reports
export const getReports = async () => {
  try {
    const response = await axios.get(`${API_URL}/reports`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all reports:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error("Failed to fetch all reports. Please try again.");
  }
};