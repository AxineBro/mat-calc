import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useI18n } from '../i18n/I18nContext';
import type { SolutionState } from '../hooks/useSolution';
import type { MatrixParseResult } from '../utils/matrix';
import type { VectorParseResult } from '../utils/vector';
import type { OperationDef } from '../operations';
import type { Matrix, Vector } from '../types';

type Props = {
  operation: OperationDef;
  matrix: Matrix;
  parsed: MatrixParseResult;
  vector: Vector | null;
  parsedVector: VectorParseResult | null;
  remote: SolutionState;
};

function formatNumber(n: number): string {
  if (Number.isInteger(n)) return n.toString();
  return Number(n.toFixed(6)).toString();
}

export function ResultView({
  operation,
  matrix,
  parsed,
  vector,
  parsedVector,
  remote,
}: Props) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);
  const result = remote.result;

  useEffect(() => {
    return () => {
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    };
  }, []);

  /* ---------- Валидация ---------- */
  const totalCells = matrix.reduce((s, r) => s + r.length, 0);
  const isCompletelyEmpty = !parsed.ok && parsed.emptyCells.length === totalCells;

  const matrixIsSquare =
    parsed.ok &&
    parsed.matrix.length > 0 &&
    parsed.matrix.length === parsed.matrix[0]?.length;

  const needsVector = operation.requiresVector;
  const vectorEmptyCompletely =
    needsVector &&
    parsedVector &&
    !parsedVector.ok &&
    parsedVector.emptyCells.length === (vector?.length ?? 0);

  let statusNode: ReactNode = null;
  let statusKind: 'info' | 'loading' | 'error' = 'info';

  if (!parsed.ok) {
    if (parsed.invalidCells.length > 0) {
      statusKind = 'error';
      statusNode = t('invalidCells', { count: parsed.invalidCells.length });
    } else if (!isCompletelyEmpty) {
      statusKind = 'info';
      statusNode = t('fillRemaining', { count: parsed.emptyCells.length });
    }
  } else if (operation.requiresSquare && !matrixIsSquare) {
    statusKind = 'error';
    statusNode = t('requiresSquare');
  } else if (needsVector && parsedVector && !parsedVector.ok) {
    if (parsedVector.invalidCells.length > 0) {
      statusKind = 'error';
      statusNode = t('invalidVectorCells', {
        count: parsedVector.invalidCells.length,
      });
    } else if (!vectorEmptyCompletely) {
      statusKind = 'info';
      statusNode = t('fillVectorRemaining', {
        count: parsedVector.emptyCells.length,
      });
    }
  } else if (remote.status === 'loading') {
    statusKind = 'loading';
    statusNode = t('resultLoading');
  } else if (remote.status === 'error') {
    statusKind = 'error';
    if (remote.error.kind === 'server') {
      if (operation.id === 'cramer') {
        statusNode = t('noUniqueSolution');
      } else if (operation.id === 'inverse' || operation.id === 'solveByInverse') {
        statusNode = t('singularMatrix');
      } else {
        statusNode = t('errorServer', { status: remote.error.status ?? '?' });
      }
    } else if (remote.error.kind === 'network') {
      statusNode = t('errorNetwork');
    } else {
      statusNode = t('errorCompute');
    }
  }

  const hasResult = result !== null;
  const isStale = hasResult && remote.status !== 'success';

  /* ---------- Копирование ---------- */
  async function copyValue() {
    if (!result) return;
    let text = '';
    if (result.kind === 'scalar') text = formatNumber(result.value);
    else if (result.kind === 'vector')
      text = result.value.map((v, i) => `x${i + 1} = ${formatNumber(v)}`).join('\n');
    else
      text = result.value
        .map(row => row.map(formatNumber).join('\t'))
        .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  /* ---------- Пустой стейт ---------- */
  if (!hasResult && !statusNode && isCompletelyEmpty) {
    return (
      <div className="card card--empty">
        <div className="empty">
          <div className="empty__icon"><IconSparkle /></div>
          <div className="empty__text">{t('resultEmpty')}</div>
        </div>
      </div>
    );
  }

  if (!hasResult) {
    return (
      <div className="card" aria-live="polite">
        <div className={`placeholder placeholder--${statusKind}`}>
          {statusKind === 'loading' && <Spinner />}
          <span>{statusNode}</span>
        </div>
      </div>
    );
  }

  const resultLabel =
    operation.resultKind === 'scalar'
      ? t('determinantLabel')
      : operation.resultKind === 'vector'
        ? t('solutionLabel')
        : t('inverseLabel');

  return (
    <div className="card" aria-live="polite">
      <div className={`card__body ${isStale ? 'card__body--stale' : ''}`}>
        <div className="card__head">
          <div className="card__title">
            <span className="card__label">{resultLabel}</span>
            {parsed.ok && (
              <span className="card__context">
                {parsed.matrix.length} × {parsed.matrix[0]?.length ?? 0}
              </span>
            )}
          </div>

          <button
            type="button"
            className="copy"
            onClick={copyValue}
            aria-label={copied ? t('copied') : t('copy')}
          >
            {copied ? <IconCheck /> : <IconCopy />}
            <span>{copied ? t('copied') : t('copy')}</span>
          </button>
        </div>

        {result.kind === 'scalar' && (
          <div className="scalar">{formatNumber(result.value)}</div>
        )}

        {result.kind === 'vector' && (
          <div className="solution">
            {result.value.map((v, i) => (
              <div key={i} className="solution__chip">
                <span className="solution__var">
                  x<sub>{i + 1}</sub>
                </span>
                <span className="solution__eq">=</span>
                <span className="solution__val">{formatNumber(v)}</span>
              </div>
            ))}
          </div>
        )}

        {result.kind === 'matrix' && (
          <div className="matrix-result">
            <span className="matrix-result__bracket matrix-result__bracket--left" aria-hidden="true" />
            <div
              className="matrix-result__grid"
              style={{
                gridTemplateColumns: `repeat(${result.value[0]?.length ?? 0}, minmax(0, 72px))`,
              }}
            >
              {result.value.flatMap((row, r) =>
                row.map((v, c) => (
                  <div key={`${r}-${c}`} className="matrix-result__cell">
                    {formatNumber(v)}
                  </div>
                )),
              )}
            </div>
            <span className="matrix-result__bracket matrix-result__bracket--right" aria-hidden="true" />
          </div>
        )}
      </div>

      {statusNode && (
        <div className={`card__status card__status--${statusKind}`}>
          {statusKind === 'loading' && <Spinner />}
          <span>{statusNode}</span>
        </div>
      )}
    </div>
  );
}

/* ---------- Мелкие иконки / спиннер ---------- */
function Spinner() {
  return (
    <span className="spinner" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </span>
  );
}
function IconCopy() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M5 15V6a2 2 0 0 1 2-2h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}
function IconCheck() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 5 5 9-11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IconSparkle() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
}