export class Image {
  constructor(id, dateCreation, patientId, url, description) {
    this.id = id;
    this.dateCreation = dateCreation;
    this.patientId = patientId;
    this.url = url;
    this.description = description;
  }

  static ajouterImage(imageData) {
    // Get current images from localStorage or initialize empty array
    const images = JSON.parse(localStorage.getItem('patientImages') || '[]');
    
    // Create new image object
    const newImage = new Image(
      Date.now(), // Using timestamp as ID
      new Date().toISOString(),
      imageData.patientId,
      imageData.url,
      imageData.description
    );
    
    // Add to array and save back to localStorage
    images.push(newImage);
    localStorage.setItem('patientImages', JSON.stringify(images));
    
    return newImage;
  }

  static getImagesByPatientId(patientId) {
    const images = JSON.parse(localStorage.getItem('patientImages') || '[]');
    return images.filter(image => image.patientId === patientId);
  }
}