import { useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import type { Matrix, Vector } from '../types';

type Props = {
  matrix: Matrix;
  vector: Vector | null;
  onMatrixChange: (m: Matrix) => void;
  onVectorChange: (v: Vector) => void;
  onCommit: (m: Matrix) => void;
  invalidMatrixCells: Set<string>;
  invalidVectorCells: Set<number>;
  maxSize: number;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onReset: () => void;
  onUpload: (file: File) => void;
};

export function AugmentedMatrix({
  matrix,
  vector,
  onMatrixChange,
  onVectorChange,
  onCommit,
  invalidMatrixCells,
  invalidVectorCells,
  maxSize,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  onReset,
  onUpload,
}: Props) {
  const { t } = useI18n();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const hasVector = vector !== null;

  /* ---------- Изменения ---------- */

  const setCell = (r: number, c: number, val: string) => {
    onMatrixChange(matrix.map((row, i) => (i === r ? row.map((v, j) => (j === c ? val : v)) : row)));
  };

  const setVecCell = (i: number, val: string) => {
    if (!vector) return;
    onVectorChange(vector.map((v, idx) => (idx === i ? val : v)));
  };

  const addRow = () => {
    if (rows >= maxSize) return;
    const next = [...matrix, Array.from({ length: cols }, () => '')];
    onMatrixChange(next);
    if (vector) onVectorChange([...vector, '']);
  };

  const removeRow = () => {
    if (rows <= 1) return;
    onMatrixChange(matrix.slice(0, -1));
    if (vector) onVectorChange(vector.slice(0, -1));
  };

  const addCol = () => {
    if (cols >= maxSize) return;
    onMatrixChange(matrix.map(row => [...row, '']));
  };

  const removeCol = () => {
    if (cols <= 1) return;
    onMatrixChange(matrix.map(row => row.slice(0, -1)));
  };

  const handleKey = (
    e: React.KeyboardEvent<HTMLInputElement>,
    r: number,
    c: number,
    kind: 'matrix' | 'vector',
  ) => {
    const lastCol = hasVector ? cols : cols - 1;
    const isLastCell =
      kind === 'vector' ? r === rows - 1 : r === rows - 1 && c === lastCol;

    if (e.key === 'Enter') {
      e.preventDefault();
      if (isLastCell) onCommit(matrix);
      const next = e.currentTarget.closest('.am__content')?.querySelectorAll<HTMLInputElement>('input.am__cell');
      if (!next) return;
      const arr = Array.from(next);
      const idx = arr.indexOf(e.currentTarget);
      if (idx >= 0 && idx + 1 < arr.length) arr[idx + 1].focus();
      else if (idx === arr.length - 1) arr[0].focus();
    }
  };

  /* ---------- Drag & drop ---------- */

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div
      className={`am ${dragging ? 'am--dropping' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* -------- Тулбар -------- */}
      <div className="am__toolbar">
        <div className="am__toolbar-group">
          <ToolButton onClick={onUndo} disabled={!canUndo} label={t('undo')}><IconUndo /></ToolButton>
          <ToolButton onClick={onRedo} disabled={!canRedo} label={t('redo')}><IconRedo /></ToolButton>
        </div>

        <span className="am__toolbar-sep" />

        <div className="am__toolbar-group">
          <ToolButton onClick={addRow} disabled={rows >= maxSize} label={t('addRow')}><IconPlusRow /></ToolButton>
          <ToolButton onClick={removeRow} disabled={rows <= 1} label={t('removeRow')}><IconMinusRow /></ToolButton>
          <ToolButton onClick={addCol} disabled={cols >= maxSize} label={t('addColumn')}><IconPlusCol /></ToolButton>
          <ToolButton onClick={removeCol} disabled={cols <= 1} label={t('removeColumn')}><IconMinusCol /></ToolButton>
        </div>

        <span className="am__toolbar-sep" />

        <div className="am__toolbar-group">
          <ToolButton onClick={() => fileRef.current?.click()} label={t('upload')}><IconUpload /></ToolButton>
          <ToolButton onClick={onClear} label={t('clear')}><IconClear /></ToolButton>
          <ToolButton onClick={onReset} label={t('reset')}><IconReset /></ToolButton>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept=".csv,.txt,text/csv,text/plain"
          hidden
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) onUpload(f);
            e.target.value = '';
          }}
        />
      </div>

      {/* -------- Ввод -------- */}
      <div className="am__body">
        <span className="am__bracket am__bracket--left" aria-hidden="true" />

        <div className="am__content">
          <div
            className="am__grid"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 64px))` }}
          >
            {matrix.map((row, r) =>
              row.map((cell, c) => (
                <input
                  key={`${r}-${c}`}
                  value={cell}
                  onChange={e => setCell(r, c, e.target.value)}
                  onKeyDown={e => handleKey(e, r, c, 'matrix')}
                  onBlur={() => onCommit(matrix)}
                  className={`am__cell ${
                    invalidMatrixCells.has(`${r}-${c}`) ? 'am__cell--invalid' : ''
                  }`}
                  inputMode="decimal"
                  autoComplete="off"
                  spellCheck={false}
                  aria-label={`A${r + 1}${c + 1}`}
                />
              )),
            )}
          </div>

          {hasVector && (
            <>
              <span className="am__divider" aria-hidden="true" />
              <div
                className="am__grid am__grid--vector"
                style={{ gridTemplateColumns: 'minmax(0, 64px)' }}
              >
                {vector!.map((cell, i) => (
                  <input
                    key={i}
                    value={cell}
                    onChange={e => setVecCell(i, e.target.value)}
                    onKeyDown={e => handleKey(e, i, 0, 'vector')}
                    onBlur={() => onCommit(matrix)}
                    className={`am__cell ${
                      invalidVectorCells.has(i) ? 'am__cell--invalid' : ''
                    }`}
                    inputMode="decimal"
                    autoComplete="off"
                    spellCheck={false}
                    aria-label={`b${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <span className="am__bracket am__bracket--right" aria-hidden="true" />

        {hasVector && (
          <div className="am__vector-label" aria-hidden="true">
            b
          </div>
        )}
      </div>

      <div className="am__foot">
        <span className="am__dim">
          A: {rows} × {cols}
          {hasVector && `  ·  b: ${rows} × 1`}
        </span>
        {dragging && <span className="am__drop-hint">{t('dropToUpload')}</span>}
      </div>
    </div>
  );
}

/* ---------- Кнопка тулбара с тултипом ---------- */

function ToolButton({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      className="tool"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

/* ---------- Иконки (минималистичные) ---------- */

function IconUndo() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 14 4 9l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 9h10a6 6 0 0 1 0 12h-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}
function IconRedo() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="m15 14 5-5-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 9H10a6 6 0 0 0 0 12h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}
function IconPlusRow() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="1.6"/><path d="M12 12v8M8 16h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}
function IconMinusRow() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="1.6"/><path d="M8 16h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}
function IconPlusCol() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="4" height="16" rx="1" stroke="currentColor" strokeWidth="1.6"/><path d="M16 8v8M12 12h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}
function IconMinusCol() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="4" height="16" rx="1" stroke="currentColor" strokeWidth="1.6"/><path d="M12 12h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}
function IconUpload() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 16V4M8 8l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}
function IconClear() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7v10a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V7M10 7V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IconReset() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 3v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}