const API_BASE = "http://localhost:3001";

export async function getImages() {
  const response = await fetch(`${API_BASE}/images`);
  return response.json();
}

export async function addImage(imageData) {
  const response = await fetch(`${API_BASE}/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(imageData),
  });
  return response.json();
}
