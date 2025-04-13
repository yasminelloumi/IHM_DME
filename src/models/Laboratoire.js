// Laboratoire.js
export class Laboratoire {
  constructor(id, matricule, nom, adresse, password) {
    this.id = id;
    this.matricule = matricule;
    this.nom = nom;
    this.adresse = adresse;
    this.password = password;
  }

  // Optionally add methods like:
  ajouterRapport(rapport) {
    // logic to add a report
  }
}
