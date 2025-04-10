const API_BASE = "http://localhost:3001";

export async function getStaffMedical() {
  const response = await fetch(`${API_BASE}/staff`);
  return response.json();
}
