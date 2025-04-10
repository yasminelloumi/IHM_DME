const API_BASE = "http://localhost:3001";

// GET /dme/:id — Fetch DME by ID
export async function getDMEById(id) {
  const response = await fetch(`${API_BASE}/dme/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch DME with ID ${id}`);
  }
  return response.json();
}

// PUT /dme/:id — Update DME profile
export async function updateDMEProfile(id, newProfile) {
  const response = await fetch(`${API_BASE}/dme/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newProfile),
  });
  if (!response.ok) {
    throw new Error(`Failed to update DME with ID ${id}`);
  }
  return response.json();
}
