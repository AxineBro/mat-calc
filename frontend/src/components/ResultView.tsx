import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useI18n } from '../i18n/I18nContext';
import type { DeterminantState } from '../hooks/useDeterminant';
import type { MatrixParseResult } from '../utils/matrix';
import type { Matrix } from '../types';

type Props = {
  matrix: Matrix;
  parsed: MatrixParseResult;
  remote: DeterminantState;
};

export function ResultView({ matrix, parsed, remote }: Props) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    };
  }, []);

  const total = matrix.reduce((sum, row) => sum + row.length, 0);
  const isCompletelyEmpty =
    !parsed.ok && parsed.emptyCells.length === total;

  const value: number | null = remote.value;

  let statusNode: ReactNode = null;
  let statusKind: 'info' | 'loading' | 'error' | 'success' = 'info';

  if (!parsed.ok) {
    if (parsed.invalidCells.length > 0) {
      statusKind = 'error';
      statusNode = t('invalidCells', { count: parsed.invalidCells.length });
    } else if (!isCompletelyEmpty) {
      statusKind = 'info';
      statusNode = t('fillRemaining', { count: parsed.emptyCells.length });
    }
  } else if (remote.status === 'loading') {
    statusKind = 'loading';
    statusNode = t('resultLoading');
  } else if (remote.status === 'error') {
    statusKind = 'error';
    statusNode =
      remote.error.kind === 'server'
        ? t('errorServer', { status: remote.error.status ?? '?' })
        : remote.error.kind === 'network'
          ? t('errorNetwork')
          : t('errorCompute');
  }

  async function copyValue() {
    if (value === null) return;
    try {
      await navigator.clipboard.writeText(formatNumber(value));
      setCopied(true);
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  const hasValue = value !== null;
  const isStale = hasValue && remote.status !== 'success';

  // Если совсем пусто — не занимаем место статусом
  if (!hasValue && !statusNode && isCompletelyEmpty) {
    return (
      <div className="result result--empty">
        <span>{t('resultEmpty')}</span>
      </div>
    );
  }

  if (!hasValue) {
    return (
      <div className="result" aria-live="polite" aria-atomic="true">
        <div className={`result__placeholder result__placeholder--${statusKind}`}>
          {statusKind === 'loading' && <Spinner />}
          {statusNode}
        </div>
      </div>
    );
  }

  return (
    <div className="result" aria-live="polite" aria-atomic="true">
      <div className={`result__body ${isStale ? 'result__body--stale' : ''}`}>
        <div className="result__head">
          <div className="result__title">
            <span className="result__label">{t('determinantLabel')}</span>
            {parsed.ok && (
              <span className="result__context">
                {parsed.matrix.length} × {parsed.matrix[0]?.length ?? 0}
              </span>
            )}
          </div>
          <button
            type="button"
            className="result__copy"
            onClick={copyValue}
            aria-label={copied ? t('copied') : t('copy')}
            title={copied ? t('copied') : t('copy')}
          >
            {copied ? <IconCheck /> : <IconCopy />}
            <span className="result__copy-text">
              {copied ? t('copied') : t('copy')}
            </span>
          </button>
        </div>
        <div className="result__scalar">{formatNumber(value)}</div>
      </div>

      {statusNode && (
        <div className={`result__status result__status--${statusKind}`}>
          {statusKind === 'loading' && <Spinner />}
          <span>{statusNode}</span>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <span className="spinner" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="3"
        />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function IconCopy() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 15V6a2 2 0 0 1 2-2h9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m5 12 5 5 9-11"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatNumber(n: number): string {
  if (Number.isInteger(n)) return n.toString();
  return Number(n.toFixed(6)).toString();
}