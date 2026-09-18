import { useEffect, useState } from 'react';
import {
  ApiError,
  calculateDeterminant,
  calculateEigen,
  calculateInverse,
  solveByCramer,
  solveByGauss,
  solveByInverse,
  type EigenPair,
} from '../api/matrixApi';
import type { OperationId } from '../operations';

export type SolutionResult =
  | { kind: 'scalar'; value: number }
  | { kind: 'vector'; value: number[] }
  | { kind: 'matrix'; value: number[][] }
  | { kind: 'eigen'; value: EigenPair[] };

export type SolutionError =
  | { kind: 'network' }
  | { kind: 'server'; status?: number }
  | { kind: 'unknown' };

export type SolutionState =
  | { status: 'incomplete'; result: SolutionResult | null }
  | { status: 'loading'; result: SolutionResult | null }
  | { status: 'success'; result: SolutionResult }
  | { status: 'error'; result: SolutionResult | null; error: SolutionError };

const DEBOUNCE_MS = 350;

export function useSolution(
  mode: OperationId,
  matrix: number[][] | null,
  vector: number[] | null,
): SolutionState {
  const [state, setState] = useState<SolutionState>({
    status: 'incomplete',
    result: null,
  });

  useEffect(() => {
    const needsVector =
  mode === 'cramer' || mode === 'solveByInverse' || mode === 'gauss';
    const ready = matrix !== null && (!needsVector || vector !== null);

    if (!ready) {
      setState(prev => ({ status: 'incomplete', result: prev.result }));
      return;
    }

    const controller = new AbortController();
    setState(prev => ({ status: 'loading', result: prev.result }));

    const timer = window.setTimeout(() => {
        const signal = controller.signal;

        const req: Promise<SolutionResult> = (() => {
            switch (mode) {
            case 'determinant':
                return calculateDeterminant(matrix!, signal).then(
                v => ({ kind: 'scalar', value: v }) as SolutionResult,
                );
            case 'inverse':
                return calculateInverse(matrix!, signal).then(
                v => ({ kind: 'matrix', value: v }) as SolutionResult,
                );
            case 'cramer':
                return solveByCramer(matrix!, vector!, signal).then(
                v => ({ kind: 'vector', value: v }) as SolutionResult,
                );
            case 'solveByInverse':
                return solveByInverse(matrix!, vector!, signal).then(
                v => ({ kind: 'vector', value: v }) as SolutionResult,
                );
            case 'gauss':
                return solveByGauss(matrix!, vector!, signal).then(
                v => ({ kind: 'vector', value: v }) as SolutionResult,
                );
            case 'eigen':
                return calculateEigen(matrix!, signal).then(
                    v => ({ kind: 'eigen', value: v }) as SolutionResult,
                );
            }
        })();

        req
            .then(result => setState({ status: 'success', result }))
            .catch(err => {
            if (err?.name === 'AbortError') return;
            setState(prev => {
                const error: SolutionError =
                err instanceof ApiError
                    ? err.status
                    ? { kind: 'server', status: err.status }
                    : { kind: 'network' }
                    : { kind: 'unknown' };
                return { status: 'error', result: prev.result, error };
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