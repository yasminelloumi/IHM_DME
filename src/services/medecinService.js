import Medecin from '../models/Medecins';

export const getById = async (id) => {
  try {
    const response = await fetch(`http://localhost:3001/medecins/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch doctor with ID ${id}`);
    }
    const data = await response.json();
    return new Medecin(
      data.id,
      data.matricule,
      data.nom,
      data.prenom,
      data.specialite,
      data.adresse,
      data.password,
      data.tel,
      data.role
    );
  } catch (error) {
    console.error(`Error fetching doctor with ID ${id}:`, error);
    throw error;
  }
}