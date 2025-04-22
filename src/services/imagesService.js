import axios from "axios";

const BASE_URL = "http://localhost:3002";

// Fetch images by patientId
export const getImages = async (patientId) => {
  try {
    const response = await axios.get(`${BASE_URL}/images`, {
      params: { patientId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
};

// Upload an image
export const uploadImage = async (formData) => {
  try {
    if (!formData.get("image")) {
      throw new Error("No image file provided");
    }

    const response = await axios.post(`${BASE_URL}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const deleteImage = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to delete image');
    }

    return result;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};