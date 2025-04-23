class Patient {
  constructor(id, CIN, nom, prenom, tel, dateNaissance, nationalite, password, qrCode, role, bloodType, lastVisit) {
    this.id = id;
    this.CIN = CIN;
    this.nom = nom;
    this.prenom = prenom;
    this.tel = tel;
    this.dateNaissance = dateNaissance;
    this.nationalite = nationalite;
    this.password = password;
    this.role = role;
    this.bloodType = bloodType;
    this.lastVisit = lastVisit;
  }

  getAge() {
    const today = new Date();
    const birthDate = new Date(this.dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--; // Birthday hasn't happened this year
    }
    return age;
  }
}