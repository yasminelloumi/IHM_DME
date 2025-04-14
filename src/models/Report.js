// Report.js
export class Report {
  constructor(id, patientId, fileName, description, timestamp, filePath = null) {
    this.id = id;
    this.patientId = patientId;
    this.fileName = fileName;
    this.description = description;
    this.timestamp = timestamp; // ISO string (e.g., "2025-04-10T09:15:00.000Z")
    this.filePath = filePath; // Path to file (e.g., "Uploads/1698765432100-test.pdf") or null
  }
}