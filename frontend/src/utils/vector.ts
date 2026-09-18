import type { Vector } from '../types';

export type VectorParseResult =
  | { ok: true; vector: number[] }
  | { ok: false; emptyCells: number[]; invalidCells: number[] };

export function parseVector(v: Vector): VectorParseResult {
  const result: number[] = [];
  const emptyCells: number[] = [];
  const invalidCells: number[] = [];

  for (let i = 0; i < v.length; i++) {
    const raw = v[i].trim();
    if (raw === '') {
      emptyCells.push(i);
      result.push(NaN);
      continue;
    }
    const n = Number(raw.replace(',', '.'));
    if (!Number.isFinite(n)) {
      invalidCells.push(i);
      result.push(NaN);
    } else {
      result.push(n);
    }
  }

  if (emptyCells.length > 0 || invalidCells.length > 0) {
    return { ok: false, emptyCells, invalidCells };
  }
  return { ok: true, vector: result };
}