// src/services/reportsServices.js
import axios from "axios";

const API_URL = "http://localhost:3001";

// Add a new report
export const submitReport = async (formData) => {
  try {
    console.log("Submitting FormData:", Array.from(formData.entries()));
    const response = await axios.post(`${API_URL}/reports`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting report:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(error.response?.data?.details || "Failed to submit report. Please try again.");
  }
};

// Get reports for a specific patient
export const getReportsByPatient = async (patientId) => {
  try {
    const response = await axios.get(`${API_URL}/reports?patientId=${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reports for patient:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error("Failed to fetch reports. Please try again.");
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