// models/Drug.js
export class Drug {
    constructor(id, name, dosage, frequency) {
      this.id = id;
      this.name = name;
      this.dosage = dosage;
      this.frequency = frequency;
    }
  }
  
  export const drugList = [
    new Drug(1, "Paracetamol", "500mg", "Twice daily"),
    new Drug(2, "Ibuprofen", "200mg", "Three times daily"),
    new Drug(3, "Amoxicillin", "250mg", "Once daily"),
    new Drug(4, "Aspirin", "100mg", "Once daily"),
    new Drug(5, "Omeprazole", "20mg", "Once daily"),
  ];