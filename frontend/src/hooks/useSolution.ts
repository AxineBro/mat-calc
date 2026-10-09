import { useEffect, useState } from 'react';
import { ApiError } from '../api/http';
import { useI18n } from '../i18n/I18nContext';
import {
  calculateDeterminant,
  calculateEigen,
  calculateInverse,
  solveByCramer,
  solveByGauss,
  solveByInverse,
  type EigenPair,
} from '../api/matrixApi';
import {
  solveConditionals,
  solveEntropy,
  solveMarginals,
  type SolutionResponseDto,
} from '../api/infoApi';
import type { OperationId } from '../operations';

export type SolutionResult =
  | { kind: 'scalar'; value: number }
  | { kind: 'vector'; value: number[] }
  | { kind: 'matrix'; value: number[][] }
  | { kind: 'eigen'; value: EigenPair[] }
  | { kind: 'sections'; value: SolutionResponseDto };

export type SolutionError =
  | { kind: 'network' }
  | { kind: 'server'; status?: number; message?: string }
  | { kind: 'unknown' };

export type SolutionState =
  | { status: 'incomplete'; result: SolutionResult | null }
  | { status: 'loading'; result: SolutionResult | null }
  | { status: 'success'; result: SolutionResult }
  | { status: 'error'; result: SolutionResult | null; error: SolutionError };

export type SolutionInputs = {
  matrix: number[][] | null;
  vector: number[] | null;
  joint: number[][] | null;
};

const DEBOUNCE_MS = 350;

function isReady(mode: OperationId, inputs: SolutionInputs): boolean {
  switch (mode) {
    case 'determinant':
    case 'inverse':
    case 'eigen':
      return inputs.matrix !== null;
    case 'cramer':
    case 'gauss':
    case 'solveByInverse':
      return inputs.matrix !== null && inputs.vector !== null;
    case 'infoMarginals':
    case 'infoConditionals':
    case 'infoEntropy':
      return inputs.joint !== null;
    default:
      return false;
  }
}

export function useSolution(
  mode: OperationId,
  inputs: SolutionInputs,
): SolutionState {
  const { lang } = useI18n();

  const [state, setState] = useState<SolutionState>({
    status: 'incomplete',
    result: null,
  });

  // Сбрасываем результат при смене операции
  useEffect(() => {
    setState({ status: 'incomplete', result: null });
  }, [mode]);

  useEffect(() => {
    if (!isReady(mode, inputs)) {
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
            return calculateDeterminant(inputs.matrix!, signal).then(
              v => ({ kind: 'scalar', value: v }) as SolutionResult,
            );
          case 'inverse':
            return calculateInverse(inputs.matrix!, signal).then(
              v => ({ kind: 'matrix', value: v }) as SolutionResult,
            );
          case 'cramer':
            return solveByCramer(inputs.matrix!, inputs.vector!, signal).then(
              v => ({ kind: 'vector', value: v }) as SolutionResult,
            );
          case 'solveByInverse':
            return solveByInverse(inputs.matrix!, inputs.vector!, signal).then(
              v => ({ kind: 'vector', value: v }) as SolutionResult,
            );
          case 'gauss':
            return solveByGauss(inputs.matrix!, inputs.vector!, signal).then(
              v => ({ kind: 'vector', value: v }) as SolutionResult,
            );
          case 'eigen':
            return calculateEigen(inputs.matrix!, signal).then(
              v => ({ kind: 'eigen', value: v }) as SolutionResult,
            );
          case 'infoMarginals':
            return solveMarginals(inputs.joint!, signal).then(
              v => ({ kind: 'sections', value: v }) as SolutionResult,
            );
          case 'infoConditionals':
            return solveConditionals(inputs.joint!, signal).then(
              v => ({ kind: 'sections', value: v }) as SolutionResult,
            );
          case 'infoEntropy':
            return solveEntropy(inputs.joint!, signal).then(
              v => ({ kind: 'sections', value: v }) as SolutionResult,
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
                  ? { kind: 'server', status: err.status, message: err.message }
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
  }, [mode, inputs, lang]);

  return state;
}