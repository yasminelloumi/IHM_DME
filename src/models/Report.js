export class Report {
  constructor(id, patientId, fileName, description, timestamp, dmeId, filePath = null, labTest) {
    this.id = id;
    this.patientId = patientId;
    this.fileName = fileName;
    this.description = description;
    this.timestamp = timestamp;
    this.filePath = filePath;
    this.dmeId = dmeId;
    this.labTest = labTest;
  }
}