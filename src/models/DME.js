class DME {
  constructor(id, patientCIN, diagnostiques, ordonnances) {
    this.id = id;
    this.patientCIN = patientCIN;
    this.diagnostiques = diagnostiques;
    this.ordonnances = ordonnances;
  }

  
    consulterDME() {
      // Logic to display the DME
    }
  
    consulterProfile() {
      // Logic to show profile
    }
  
    modifierProfile(newProfile) {
      // Logic to update profile
    }
  
    ajouterDiagnostique(diagnostique) {
      this.diagnostiques.push(diagnostique);
    }
  
    ajouterOrdonnance(ordonnance) {
      this.ordonnances.push(ordonnance);
    }
  
    modifierDiagnostique(index, newDiagnostique) {
      if (index >= 0 && index < this.diagnostiques.length) {
        this.diagnostiques[index] = newDiagnostique;
      }
    }
  }
  