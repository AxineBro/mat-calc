const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function calculateDeterminant(
  matrix: number[][],
  signal?: AbortSignal,
): Promise<number> {
  const res = await fetch(`${API_BASE}/matrix/determinant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matrix }),
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError(text || `Ошибка сервера (${res.status})`, res.status);
  }

  const data = (await res.json()) as { determinant: number };
  return data.determinant;
}