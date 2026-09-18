export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const API_BASE = '/api/matrix';

async function postJson<T>(
  url: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const data = await response.json();
      if (data && typeof data.message === 'string') message = data.message;
    } catch {
    }
    throw new ApiError(message, response.status);
  }
  return response.json() as Promise<T>;
}

export async function calculateDeterminant(
  matrix: number[][],
  signal?: AbortSignal,
): Promise<number> {
  const data = await postJson<{ determinant: number }>(
    `${API_BASE}/determinant`,
    { matrix },
    signal,
  );
  return data.determinant;
}

export async function solveByCramer(
  matrix: number[][],
  constants: number[],
  signal?: AbortSignal,
): Promise<number[]> {
  const data = await postJson<{ solution: number[] }>(
    `${API_BASE}/solve/cramer`,
    { matrix, constants },
    signal,
  );
  return data.solution;
}

export async function calculateInverse(
  matrix: number[][],
  signal?: AbortSignal,
): Promise<number[][]> {
  const data = await postJson<{ matrix: number[][] }>(
    `${API_BASE}/inverse`,
    { matrix },
    signal,
  );
  return data.matrix;
}

export async function solveByInverse(
  matrix: number[][],
  constants: number[],
  signal?: AbortSignal,
): Promise<number[]> {
  const data = await postJson<{ solution: number[] }>(
    `${API_BASE}/solve/inverse`,
    { matrix, constants },
    signal,
  );
  return data.solution;
}

export async function solveByGauss(
  matrix: number[][],
  constants: number[],
  signal?: AbortSignal,
): Promise<number[]> {
  const data = await postJson<{ solution: number[] }>(
    `${API_BASE}/solve/gauss`,
    { matrix, constants },
    signal,
  );
  return data.solution;
}

export type EigenPair = { eigenvalue: number; eigenvector: number[] };

export async function calculateEigen(
  matrix: number[][],
  signal?: AbortSignal,
): Promise<EigenPair[]> {
  const data = await postJson<{
    eigenvalues: number[];
    eigenvectors: number[][];
  }>(`${API_BASE}/eigen`, { matrix }, signal);

  return data.eigenvalues.map((ev, i) => ({
    eigenvalue: ev,
    eigenvector: data.eigenvectors[i],
  }));
}