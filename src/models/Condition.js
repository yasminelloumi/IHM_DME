class Condition {
    constructor(id, type, name, diagnosisDate, severity, description, treatment, patientId) {
      this.id = id;
      this.type = type; // "allergy" | "chronic" | "infectious"
      this.name = name;
      this.diagnosisDate = diagnosisDate;
      this.severity = severity;
      this.description = description;
      this.treatment = treatment;
      this.patientId = patientId;
    }
  }
export default Condition;
