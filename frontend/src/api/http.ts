export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function postJson<T>(
  url: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': document.documentElement.lang || 'ru',
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const data = await response.json();
      if (data && typeof data.message === 'string') message = data.message;
    } catch {}
    throw new ApiError(message, response.status);
  }
  return response.json() as Promise<T>;
}