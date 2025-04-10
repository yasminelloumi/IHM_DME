const API_BASE = "http://localhost:3001";

export async function getDMEById(id) {
  const response = await fetch(`${API_BASE}/dme/${id}`);
  return response.json();
}

export async function updateDMEProfile(id, newProfile) {
  const response = await fetch(`${API_BASE}/dme/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProfile),
  });
  return response.json();
}
