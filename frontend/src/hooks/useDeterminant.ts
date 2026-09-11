import { useEffect, useState } from 'react';
import { calculateDeterminant, ApiError } from '../api/matrixApi';
import type { MatrixParseResult } from '../utils/matrix';

export type DeterminantError =
  | { kind: 'network' }
  | { kind: 'server'; status?: number }
  | { kind: 'unknown' };

export type DeterminantState =
  | { status: 'incomplete'; value: number | null }
  | { status: 'loading'; value: number | null }
  | { status: 'success'; value: number }
  | { status: 'error'; value: number | null; error: DeterminantError };

const DEBOUNCE_MS = 400;

export function useDeterminant(parsed: MatrixParseResult): DeterminantState {
  const [state, setState] = useState<DeterminantState>({
    status: 'incomplete',
    value: null,
  });

  useEffect(() => {
    if (!parsed.ok) {
      setState(prev => ({ status: 'incomplete', value: prev.value }));
      return;
    }

    const controller = new AbortController();
    setState(prev => ({ status: 'loading', value: prev.value }));

    const timer = setTimeout(() => {
      calculateDeterminant(parsed.matrix, controller.signal)
        .then(value => setState({ status: 'success', value }))
        .catch(err => {
          if (err?.name === 'AbortError') return;
          setState(prev => {
            const error: DeterminantError =
              err instanceof ApiError
                ? err.status
                  ? { kind: 'server', status: err.status }
                  : { kind: 'network' }
                : { kind: 'unknown' };
            return { status: 'error', value: prev.value, error };
          });
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [parsed]);

  return state;
}