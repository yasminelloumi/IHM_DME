// Report.js
export class Report {
  constructor(id, patientId, fileName, description, timestamp, filePath = null) {
    this.id = id;
    this.patientId = patientId;
    this.fileName = fileName;
    this.description = description;
    this.timestamp = timestamp; 
    this.filePath = filePath;
  }
}