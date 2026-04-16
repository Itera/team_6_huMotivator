const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export interface MotivateResponse {
  motivation: string;
  coach: string;
  safety_note: string;
  media?: {
    type: string;
    title: string;
    url: string;
    thumbnail?: string;
  };
  spotify?: {
    type: string;
    title: string;
    artist: string;
    url: string;
    image?: string;
  };
}

export async function motivate(coach: string, task: string): Promise<MotivateResponse> {
  const params = new URLSearchParams({ coach, task });
  const response = await fetch(`${API_BASE}/motivate?${params}`);
  if (!response.ok) throw new Error(`Backend error (${response.status})`);
  return response.json();
}

export async function getModels(): Promise<string[]> {
  const response = await fetch(`${API_BASE}/models`);
  if (!response.ok) throw new Error(`Could not fetch models (${response.status})`);
  const payload = (await response.json()) as { models?: string[] };
  return Array.isArray(payload.models) ? payload.models : [];
}
