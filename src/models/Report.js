// Report.js
export class Report {
    constructor(id, patientId, fileName, description, timestamp) {
      this.id = id;
      this.patientId = patientId; // Corrected spelling
      this.fileName = fileName;
      this.description = description;
      this.timestamp = timestamp; // ISO string (e.g., "2025-04-10T09:15:00.000Z")
    }
  }