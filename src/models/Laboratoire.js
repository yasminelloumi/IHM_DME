export class Laboratoire {
  constructor(id, matricule, nom, adresse, password) {
    this.id = id;
    this.matricule = matricule;
    this.nom = nom;
    this.adresse = adresse;
    this.password = password;
    this.role = this.role;
  }

  // Optionally add methods like:
  async ajouterRapport(report) {
    try {
      // Call the API to save the report
      const response = await submitReport(report);
      return response;
    } catch (error) {
      console.error("Error adding report:", error);
      throw error;
    }
  }
}
