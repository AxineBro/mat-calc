import type { Matrix } from '../types';

export type MatrixParseResult =
  | { ok: true; matrix: number[][] }
  | { ok: false; emptyCells: string[]; invalidCells: string[] };

export function parseMatrix(m: Matrix): MatrixParseResult {
  const result: number[][] = [];
  const invalidCells: string[] = [];
  const emptyCells: string[] = [];

  for (let r = 0; r < m.length; r++) {
    const row: number[] = [];
    for (let c = 0; c < m[r].length; c++) {
      const raw = m[r][c].trim();
      if (raw === '') {
        emptyCells.push(`${r}-${c}`);
        row.push(NaN);
        continue;
      }
      const normalized = raw.replace(',', '.');
      const n = Number(normalized);
      if (!Number.isFinite(n)) {
        invalidCells.push(`${r}-${c}`);
        row.push(NaN);
      } else {
        row.push(n);
      }
    }
    result.push(row);
  }

  if (emptyCells.length > 0 || invalidCells.length > 0) {
    return { ok: false, emptyCells, invalidCells };
  }
  return { ok: true, matrix: result };
}