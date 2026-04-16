const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export interface MediaResult {
  type: string;
  title: string;
  url: string;
  thumbnail?: string;
}

export interface SpotifyResult {
  type: string;
  title: string;
  artist: string;
  url: string;
  image?: string;
}

export interface MotivateResponse {
  motivation: string;
  coach: string;
  safety_note: string;
  media?: MediaResult;
  spotify?: SpotifyResult;
}

export async function motivate(coach: string, task: string): Promise<MotivateResponse> {
  const response = await fetch(`${API_BASE}/motivate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ coach, task }),
  });
  if (!response.ok) throw new Error(`Backend error (${response.status})`);
  return response.json();
}

export async function getModels(): Promise<string[]> {
  const response = await fetch(`${API_BASE}/models`);
  if (!response.ok) throw new Error(`Could not fetch models (${response.status})`);
  const payload = (await response.json()) as { models?: string[] };
  return Array.isArray(payload.models) ? payload.models : [];
}
