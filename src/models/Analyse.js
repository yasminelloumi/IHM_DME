// Analyse.js
class Analyse {
  constructor(id, dateCreation, dmeId, testType, result, value) {
    this.id = id;
    this.dateCreation = dateCreation;
    this.dmeId = dmeId;
    this.testType = testType; // e.g., "CBC", "Blood Glucose"
    this.result = result;     // e.g., "Normal", "High", etc.
    this.value = value;       // e.g., 5.6 mmol/L
  }

  ajouterAnalyse(analyseData) {
    // Logic to add an analysis
    // e.g., saving to DB or sending to API
  }

  static getTrendByPatient(patientId, testType) {
    // Method for fetching trend data over time (stubbed for now)
    // Call your service or backend endpoint to get this
  }
}

export default Analyse;
