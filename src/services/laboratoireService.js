const API_BASE = "http://localhost:3001";

export async function getMedecins() {
  const response = await fetch(`${API_BASE}/medecins`);
  return response.json();
}
