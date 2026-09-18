import { useEffect, useState } from 'react';
import { ApiError, calculateDeterminant, solveByCramer } from '../api/matrixApi';
import type { OperationId } from '../operations';

export type SolutionError =
  | { kind: 'network' }
  | { kind: 'server'; status?: number }
  | { kind: 'unknown' };

export type SolutionState =
  | { status: 'incomplete'; values: number[] | null }
  | { status: 'loading'; values: number[] | null }
  | { status: 'success'; values: number[] }
  | { status: 'error'; values: number[] | null; error: SolutionError };

const DEBOUNCE_MS = 350;

export function useSolution(
  mode: OperationId,
  matrix: number[][] | null,
  vector: number[] | null,
): SolutionState {
  const [state, setState] = useState<SolutionState>({
    status: 'incomplete',
    values: null,
  });

  useEffect(() => {
    const ready =
      matrix !== null && (mode === 'determinant' || vector !== null);

    if (!ready) {
      setState(prev => ({ status: 'incomplete', values: prev.values }));
      return;
    }

    const controller = new AbortController();
    setState(prev => ({ status: 'loading', values: prev.values }));

    const timer = window.setTimeout(() => {
      const req: Promise<number[]> =
        mode === 'determinant'
          ? calculateDeterminant(matrix!, controller.signal).then(v => [v])
          : solveByCramer(matrix!, vector!, controller.signal);

      req
        .then(values => setState({ status: 'success', values }))
        .catch(err => {
          if (err?.name === 'AbortError') return;
          setState(prev => {
            const error: SolutionError =
              err instanceof ApiError
                ? err.status
                  ? { kind: 'server', status: err.status }
                  : { kind: 'network' }
                : { kind: 'unknown' };
            return { status: 'error', values: prev.values, error };
          });
        });
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [mode, matrix, vector]);

  return state;
}