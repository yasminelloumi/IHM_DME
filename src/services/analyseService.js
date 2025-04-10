const API_BASE = "http://localhost:3001";

export async function getAnalyses() {
  const response = await fetch(`${API_BASE}/analyses`);
  return response.json();
}

export async function addAnalyse(analyseData) {
  const response = await fetch(`${API_BASE}/analyses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(analyseData),
  });
  return response.json();
}
