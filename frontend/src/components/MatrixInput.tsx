import { useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import type { Matrix } from '../types';

type Props = {
  name: string;
  value: Matrix;
  onChange: (m: Matrix) => void;
  onCommit?: (m: Matrix) => void;
  onClear?: () => void;
  onReset?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onUpload?: (file: File) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  resetRows?: number;
  resetCols?: number;
  invalidCells?: Set<string>;
  readOnly?: boolean;
  minSize?: number;
  maxSize?: number;
};

export function MatrixInput({
  name,
  value,
  onChange,
  onCommit,
  onClear,
  onReset,
  onUndo,
  onRedo,
  onUpload,
  canUndo = false,
  canRedo = false,
  resetRows = 3,
  resetCols = 3,
  invalidCells,
  readOnly,
  minSize = 1,
  maxSize = 10,
}: Props) {
  const { t } = useI18n();
  const rows = value.length;
  const cols = value[0]?.length ?? 0;
  const refs = useRef<(HTMLInputElement | null)[][]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const commit = onCommit ?? onChange;
  const canAddRow = !readOnly && rows < maxSize;
  const canRemoveRow = !readOnly && rows > minSize;
  const canAddCol = !readOnly && cols < maxSize;
  const canRemoveCol = !readOnly && cols > minSize;
  const isEmpty = value.every(row => row.every(cell => cell.trim() === ''));

  function addRow() {
    if (!canAddRow) return;
    commit([
      ...value.map(r => r.slice()),
      Array.from({ length: cols }, () => ''),
    ]);
  }
  function removeRow() {
    if (!canRemoveRow) return;
    commit(value.slice(0, -1).map(r => r.slice()));
  }
  function addCol() {
    if (!canAddCol) return;
    commit(value.map(r => [...r, '']));
  }
  function removeCol() {
    if (!canRemoveCol) return;
    commit(value.map(r => r.slice(0, -1)));
  }

  function setCell(r: number, c: number, v: string) {
    const next = value.map(row => row.slice());
    next[r][c] = v;
    onChange(next);
  }

  function focusCell(r: number, c: number) {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    const el = refs.current[r]?.[c];
    el?.focus();
    el?.select();
  }

  function handleKeyDown(e: React.KeyboardEvent, r: number, c: number) {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        focusCell(r, c + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        focusCell(r, c - 1);
        break;
      case 'ArrowDown':
      case 'Enter':
        e.preventDefault();
        focusCell(r + 1, c);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusCell(r - 1, c);
        break;
    }
  }

  function handlePaste(e: React.ClipboardEvent, r: number, c: number) {
    const text = e.clipboardData.getData('text');
    if (!text.includes('\t') && !text.includes('\n')) return;
    e.preventDefault();

    const grid = text
      .replace(/\r/g, '')
      .trim()
      .split('\n')
      .map(l => l.split('\t'));

    const requiredRows = r + grid.length;
    const requiredCols = c + Math.max(...grid.map(row => row.length));
    const newRows = Math.max(rows, Math.min(maxSize, requiredRows));
    const newCols = Math.max(cols, Math.min(maxSize, requiredCols));

    const next: Matrix = Array.from({ length: newRows }, (_, i) =>
      Array.from({ length: newCols }, (_, j) => value[i]?.[j] ?? ''),
    );
    grid.forEach((row, i) =>
      row.forEach((cell, j) => {
        if (next[r + i]?.[c + j] !== undefined) {
          next[r + i][c + j] = cell.trim();
        }
      }),
    );
    commit(next);
  }

  function pickFile() {
    if (!onUpload) return;
    fileInputRef.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && onUpload) onUpload(file);
    e.target.value = '';
  }

  function handleDragOver(e: React.DragEvent) {
    if (!onUpload) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragging) setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    if (!onUpload) return;
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    if (!onUpload) return;
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onUpload(file);
  }

  const gridLabel = t('matrixLabel', { name });
  const showToolbar = !readOnly && (onUndo || onClear || onReset || onUpload);

  return (
    <section
      className={`matrix ${isDragging ? 'matrix--dropping' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="matrix__header">
        <span className="matrix__name">{gridLabel}</span>

        <div className="matrix__tools">
          {showToolbar && (
            <div className="matrix__toolbar" role="group" aria-label={gridLabel}>
              {onUndo && (
                <button
                  type="button"
                  className="tool-btn"
                  onClick={onUndo}
                  disabled={!canUndo}
                  title={t('undo')}
                  aria-label={t('undo')}
                >
                  <IconUndo />
                </button>
              )}
              {onRedo && (
                <button
                  type="button"
                  className="tool-btn"
                  onClick={onRedo}
                  disabled={!canRedo}
                  title={t('redo')}
                  aria-label={t('redo')}
                >
                  <IconRedo />
                </button>
              )}

              <span className="tool-sep" aria-hidden="true" />

              {onUpload && (
                <button
                  type="button"
                  className="tool-btn"
                  onClick={pickFile}
                  title={t('uploadHint')}
                  aria-label={t('upload')}
                >
                  <IconUpload />
                </button>
              )}
              {onClear && (
                <button
                  type="button"
                  className="tool-btn"
                  onClick={onClear}
                  disabled={isEmpty}
                  title={t('clearHint')}
                  aria-label={t('clear')}
                >
                  <IconEraser />
                </button>
              )}
              {onReset && (
                <button
                  type="button"
                  className="tool-btn"
                  onClick={onReset}
                  title={t('resetHint', { rows: resetRows, cols: resetCols })}
                  aria-label={t('reset')}
                >
                  <IconRefresh />
                </button>
              )}
            </div>
          )}

          <span className="matrix__dim">
            {rows} × {cols}
          </span>
        </div>
      </div>

      <div className="matrix__body">
        <span className="matrix__bracket matrix__bracket--left" aria-hidden="true" />

        <div
          className="matrix__grid"
          style={{ gridTemplateColumns: `repeat(${cols}, 64px)` }}
          role="group"
          aria-label={gridLabel}
        >
          {value.map((row, r) =>
            row.map((cell, c) => {
              const isInvalid = invalidCells?.has(`${r}-${c}`) ?? false;
              return (
                <input
                  key={`${r}-${c}`}
                  ref={el => {
                    if (!refs.current[r]) refs.current[r] = [];
                    refs.current[r][c] = el;
                  }}
                  className={`matrix__cell ${isInvalid ? 'matrix__cell--invalid' : ''}`}
                  value={cell}
                  readOnly={readOnly}
                  onChange={e => setCell(r, c, e.target.value)}
                  onKeyDown={e => handleKeyDown(e, r, c)}
                  onPaste={e => handlePaste(e, r, c)}
                  aria-label={t('cellLabel', { row: r + 1, col: c + 1 })}
                  aria-invalid={isInvalid || undefined}
                  inputMode="decimal"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
              );
            }),
          )}
        </div>

        <span className="matrix__bracket matrix__bracket--right" aria-hidden="true" />

        {!readOnly && (
          <div className="matrix__edge matrix__edge--col">
            <button
              type="button"
              className="edge-btn"
              onClick={addCol}
              disabled={!canAddCol}
              title={t('addCol')}
              aria-label={t('addCol')}
            >
              +
            </button>
            <button
              type="button"
              className="edge-btn"
              onClick={removeCol}
              disabled={!canRemoveCol}
              title={t('removeCol')}
              aria-label={t('removeCol')}
            >
              −
            </button>
          </div>
        )}

        {!readOnly && (
          <div className="matrix__edge matrix__edge--row">
            <button
              type="button"
              className="edge-btn"
              onClick={addRow}
              disabled={!canAddRow}
              title={t('addRow')}
              aria-label={t('addRow')}
            >
              +
            </button>
            <button
              type="button"
              className="edge-btn"
              onClick={removeRow}
              disabled={!canRemoveRow}
              title={t('removeRow')}
              aria-label={t('removeRow')}
            >
              −
            </button>
          </div>
        )}
      </div>

      {onUpload && (
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain"
          onChange={onFileChange}
          className="matrix__file-input"
          tabIndex={-1}
          aria-hidden="true"
        />
      )}

      {isDragging && (
        <div className="matrix__drop-overlay" aria-hidden="true">
          <span>{t('dropHere')}</span>
        </div>
      )}
    </section>
  );
}

/* ---------- Иконки ---------- */

function IconUndo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 14 4 9l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 9h10a6 6 0 0 1 0 12h-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconRedo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m15 14 5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 9H10a6 6 0 0 0 0 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3v12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="m7 8 5-5 5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconEraser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 15 6-6 8 8-4 4H9l-4-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M11 9 17 3l4 4-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 21h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 3v5h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 21v-5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}