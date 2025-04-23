export default class DME {
  constructor(
    id,
    patientId,
    medecinId,
    dateConsultation,
    reason,
    diagnostiques = [],
    ordonnances = [],
    laboTest = [],
    imgTest = [],
    notes = ""
  ) {
    this.id = id;
    this.patientId = patientId;
    this.medecinId = medecinId;
    this.dateConsultation = dateConsultation;
    this.reason = reason;
    this.diagnostiques = Array.isArray(diagnostiques) ? diagnostiques : [];
    this.ordonnances = Array.isArray(ordonnances) 
      ? ordonnances.map(med => typeof med === 'string' ? { name: med } : med)
      : [];
    this.laboTest = Array.isArray(laboTest) ? laboTest : [];
    this.imgTest = Array.isArray(imgTest) ? imgTest : [];
    this.notes = notes;
  }
}