const API_URL = "http://localhost:3001/images";

export const getImages = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch images');
    }
    
    return data.data || data; // Handle both formats
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
};

export const uploadImage = async (imageData) => {
  try {
    const formData = new FormData();
    formData.append('file', imageData.file);
    formData.append('patientId', imageData.patientId);
    formData.append('description', imageData.description);
    formData.append('dateCreated', imageData.dateCreated || new Date().toISOString());

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Upload failed');
    }
    
    return result.data;
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
    console.error("Error deleting image:", error);
    throw error;
  }
};