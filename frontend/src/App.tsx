import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { AugmentedMatrix } from './components/AugmentedMatrix';
import { OperationPicker } from './components/OperationPicker';
import { ResultView } from './components/ResultView';
import { useSolution } from './hooks/useSolution';
import { useMatrixHistory } from './hooks/useMatrixHistory';
import { I18nProvider, useI18n } from './i18n/I18nContext';
import type { TranslationKey } from './i18n/translations';
import { ThemeProvider } from './theme/ThemeContext';
import { parseMatrix } from './utils/matrix';
import { parseVector } from './utils/vector';
import { parseDelimited, type CsvParseError } from './utils/csv';
import { OPERATION_BY_ID, type OperationId } from './operations';
import type { Matrix, Vector } from './types';

const DEFAULT_ROWS = 3;
const DEFAULT_COLS = 3;
const MAX_SIZE = 10;
const STORAGE_KEY = 'matrix.a';
const STORAGE_B_KEY = 'matrix.b';
const STORAGE_MODE_KEY = 'matrix.mode';

const emptyMatrix = (r: number, c: number): Matrix =>
  Array.from({ length: r }, () => Array.from({ length: c }, () => ''));
const emptyVector = (n: number): Vector =>
  Array.from({ length: n }, () => '');

function loadInitial(): Matrix {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (
        Array.isArray(parsed) &&
        parsed.length > 0 &&
        parsed.length <= MAX_SIZE &&
        Array.isArray(parsed[0]) &&
        parsed.every(
          row =>
            Array.isArray(row) &&
            row.length <= MAX_SIZE &&
            row.every(c => typeof c === 'string'),
        )
      ) {
        return parsed as Matrix;
      }
    }
  } catch {}
  return emptyMatrix(DEFAULT_ROWS, DEFAULT_COLS);
}

function loadMode(): OperationId {
  const v = localStorage.getItem(STORAGE_MODE_KEY);
  return v === 'cramer' ? 'cramer' : 'determinant';
}

function loadVector(size: number): Vector {
  try {
    const raw = localStorage.getItem(STORAGE_B_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (
        Array.isArray(parsed) &&
        parsed.length <= MAX_SIZE &&
        parsed.every(c => typeof c === 'string')
      ) {
        const arr = parsed as Vector;
        if (arr.length === size) return arr;
        if (arr.length < size) return [...arr, ...emptyVector(size - arr.length)];
        return arr.slice(0, size);
      }
    }
  } catch {}
  return emptyVector(size);
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <Calculator />
      </I18nProvider>
    </ThemeProvider>
  );
}

function Calculator() {
  const { t } = useI18n();
  const history = useMatrixHistory(loadInitial);
  const a = history.value;

  const [mode, setMode] = useState<OperationId>(loadMode);
  const [b, setB] = useState<Vector>(() => loadVector(a.length));

  const [uploadError, setUploadError] = useState<{
    key: TranslationKey;
    params?: Record<string, string | number>;
  } | null>(null);

  const operation = OPERATION_BY_ID[mode];
  const needsVector = operation.requiresVector;

  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(a)); } catch {} }, [a]);
  useEffect(() => { try { localStorage.setItem(STORAGE_B_KEY, JSON.stringify(b)); } catch {} }, [b]);
  useEffect(() => { try { localStorage.setItem(STORAGE_MODE_KEY, mode); } catch {} }, [mode]);

  useEffect(() => {
    setB(prev => {
      if (prev.length === a.length) return prev;
      if (prev.length < a.length) {
        return [...prev, ...emptyVector(a.length - prev.length)];
      }
      return prev.slice(0, a.length);
    });
  }, [a.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const k = e.key.toLowerCase();
      const isUndo = k === 'z' && !e.shiftKey;
      const isRedo = (k === 'z' && e.shiftKey) || k === 'y';
      if (!isUndo && !isRedo) return;
      e.preventDefault();
      if (isUndo) history.undo();
      else history.redo();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [history]);

  useEffect(() => {
    if (!uploadError) return;
    const timer = window.setTimeout(() => setUploadError(null), 4500);
    return () => window.clearTimeout(timer);
  }, [uploadError]);

  const parsed = useMemo(() => parseMatrix(a), [a]);
  const parsedVector = useMemo(() => (needsVector ? parseVector(b) : null), [b, needsVector]);

  const matrixForApi = parsed.ok ? parsed.matrix : null;
  const vectorForApi =
    needsVector &&
    parsedVector?.ok &&
    matrixForApi &&
    matrixForApi.length === parsedVector.vector.length
      ? parsedVector.vector
      : null;

  const remote = useSolution(mode, matrixForApi, vectorForApi);

  const invalidMatrixCells = useMemo(
    () => new Set(parsed.ok ? [] : parsed.invalidCells),
    [parsed],
  );
  const invalidVectorCells = useMemo(
    () => new Set(parsedVector?.ok === false ? parsedVector.invalidCells : []),
    [parsedVector],
  );

  const handleClear = () => {
    history.commit(a.map(row => row.map(() => '')));
    setB(emptyVector(b.length));
  };
  const handleReset = () => {
    history.commit(emptyMatrix(DEFAULT_ROWS, DEFAULT_COLS));
    setB(emptyVector(DEFAULT_ROWS));
  };

  async function handleUpload(file: File) {
    let text: string;
    try {
      text = await file.text();
    } catch {
      setUploadError({ key: 'uploadErrorRead' });
      return;
    }
    const result = parseDelimited(text, MAX_SIZE);
    if (!result.ok) {
      setUploadError({ key: errorKey(result.error), params: { max: MAX_SIZE } });
      return;
    }
    setUploadError(null);
    history.commit(result.matrix);
  }

  return (
    <div className="app">
      <Header mode={mode} onModeChange={setMode} />

      <main className="workspace">
        <section className="workspace__inputs">
          <AugmentedMatrix
            matrix={a}
            vector={needsVector ? b : null}
            onMatrixChange={history.set}
            onVectorChange={setB}
            onCommit={history.commit}
            invalidMatrixCells={invalidMatrixCells}
            invalidVectorCells={invalidVectorCells}
            maxSize={MAX_SIZE}
            resetRows={DEFAULT_ROWS}
            resetCols={DEFAULT_COLS}
            canUndo={history.canUndo}
            canRedo={history.canRedo}
            onUndo={history.undo}
            onRedo={history.redo}
            onClear={handleClear}
            onReset={handleReset}
            onUpload={handleUpload}
          />

          {uploadError && (
            <div className="upload-error" role="alert">
              {t(uploadError.key, uploadError.params)}
            </div>
          )}
        </section>

        <aside className="workspace__result">
          <ResultView
            operation={operation}
            matrix={a}
            parsed={parsed}
            vector={needsVector ? b : null}
            parsedVector={parsedVector}
            remote={remote}
          />
        </aside>
      </main>
    </div>
  );
}

function errorKey(err: CsvParseError): TranslationKey {
  switch (err) {
    case 'empty': return 'uploadErrorEmpty';
    case 'too-large': return 'uploadErrorTooLarge';
    case 'bad-format':
    default: return 'uploadErrorRead';
  }
}