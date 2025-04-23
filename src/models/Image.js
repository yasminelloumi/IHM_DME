export class Image {
  constructor(id, dateCreation, patientId, url, description, fileName,imgTest) {
    this.id = id;
    this.dateCreation = dateCreation;
    this.patientId = patientId;
    this.url = url;
    this.description = description;
    this.fileName = fileName;
    this.imgTest = imgTest;
  }

  static ajouterImage(imageData) {
    // Get current images from localStorage or initialize empty array
    const images = JSON.parse(localStorage.getItem('patientImages') || '[]');
    
    // Create new image object
    const newImage = new Image(
      Date.now(),
      new Date().toISOString(),
      imageData.patientId,
      imageData.url,
      imageData.description,
      imageData.fileName,
      imageData.imgTest)
    
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