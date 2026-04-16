const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export interface MotivateResponse {
  motivation: string;
  model_used: string;
  safety_note: string;
}

export async function motivate(task: string, model: string): Promise<MotivateResponse> {
  const response = await fetch(`${API_BASE}/motivate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task, model }),
  });

  if (!response.ok) {
    throw new Error(`Backend error (${response.status})`);
  }

  return response.json();
}

export async function getModels(): Promise<string[]> {
  const response = await fetch(`${API_BASE}/models`);
  if (!response.ok) {
    throw new Error(`Could not fetch models (${response.status})`);
  }

  const payload = (await response.json()) as { models?: string[] };
  return Array.isArray(payload.models) ? payload.models : [];
}
