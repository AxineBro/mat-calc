import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { MatrixInput } from './components/MatrixInput';
import { ResultView } from './components/ResultView';
import { useDeterminant } from './hooks/useDeterminant';
import { useMatrixHistory } from './hooks/useMatrixHistory';
import { I18nProvider, useI18n } from './i18n/I18nContext';
import type { TranslationKey } from './i18n/translations';
import { ThemeProvider } from './theme/ThemeContext';
import { parseMatrix } from './utils/matrix';
import { parseDelimited, type CsvParseError } from './utils/csv';
import type { Matrix } from './types';

const DEFAULT_ROWS = 3;
const DEFAULT_COLS = 3;
const MAX_SIZE = 10;
const STORAGE_KEY = 'matrix.a';

const emptyMatrix = (r: number, c: number): Matrix =>
  Array.from({ length: r }, () => Array.from({ length: c }, () => ''));

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
  } catch {
    /* ignore */
  }
  return emptyMatrix(DEFAULT_ROWS, DEFAULT_COLS);
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

  const [uploadError, setUploadError] = useState<{
    key: TranslationKey;
    params?: Record<string, string | number>;
  } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
    } catch {
      /* ignore */
    }
  }, [a]);

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

  // Автоскрытие сообщения об ошибке загрузки.
  useEffect(() => {
    if (!uploadError) return;
    const timer = window.setTimeout(() => setUploadError(null), 4500);
    return () => window.clearTimeout(timer);
  }, [uploadError]);

  const parsed = useMemo(() => parseMatrix(a), [a]);
  const remote = useDeterminant(parsed);

  const invalidCells = useMemo(
    () => new Set(parsed.ok ? [] : parsed.invalidCells),
    [parsed],
  );

  const handleClear = () => {
    history.commit(a.map(row => row.map(() => '')));
  };

  const handleReset = () => {
    history.commit(emptyMatrix(DEFAULT_ROWS, DEFAULT_COLS));
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
      <Header />
      <main className="workspace">
        <div className="workspace__inputs">
          <MatrixInput
            name="A"
            value={a}
            onChange={history.set}
            onCommit={history.commit}
            onUndo={history.undo}
            onRedo={history.redo}
            canUndo={history.canUndo}
            canRedo={history.canRedo}
            onClear={handleClear}
            onReset={handleReset}
            onUpload={handleUpload}
            resetRows={DEFAULT_ROWS}
            resetCols={DEFAULT_COLS}
            invalidCells={invalidCells}
            maxSize={MAX_SIZE}
          />

          {uploadError && (
            <div className="upload-error" role="alert">
              {t(uploadError.key, uploadError.params)}
            </div>
          )}
        </div>
        <div className="workspace__result">
          <ResultView matrix={a} parsed={parsed} remote={remote} />
        </div>
      </main>
    </div>
  );
}

function errorKey(err: CsvParseError): TranslationKey {
  switch (err) {
    case 'empty':
      return 'uploadErrorEmpty';
    case 'too-large':
      return 'uploadErrorTooLarge';
    case 'bad-format':
    default:
      return 'uploadErrorRead';
  }
}