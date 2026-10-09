import { Fragment, useMemo, useRef } from 'react';
import type { JointDistribution } from '../types';

type Props = {
  value: JointDistribution;
  onChange: (v: JointDistribution) => void;
  onCommit?: (v: JointDistribution) => void;
  invalidCells: Set<string>;
  maxSize: number;
  minSize?: number;
};

const NORM_EPS = 1e-6;

export function JointDistributionInput({
  value,
  onChange,
  onCommit,
  invalidCells,
  maxSize,
  minSize = 1,
}: Props) {
  const rows = value.length;
  const cols = value[0]?.length ?? 0;
  const refs = useRef<(HTMLInputElement | null)[][]>([]);

  const setCell = (r: number, c: number, v: string) => {
    const next = value.map((row, i) =>
      i === r ? row.map((cell, j) => (j === c ? v : cell)) : row,
    );
    onChange(next);
  };

  const addRow = () => {
    if (rows >= maxSize) return;
    onChange([...value, Array.from({ length: cols }, () => '')]);
  };
  const removeRow = () => {
    if (rows <= minSize) return;
    onChange(value.slice(0, -1));
  };
  const addCol = () => {
    if (cols >= maxSize) return;
    onChange(value.map(r => [...r, '']));
  };
  const removeCol = () => {
    if (cols <= minSize) return;
    onChange(value.map(r => r.slice(0, -1)));
  };

  const focusCell = (r: number, c: number) => {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    const el = refs.current[r]?.[c];
    el?.focus();
    el?.select();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    r: number,
    c: number,
  ) => {
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
  };

  const stats = useMemo(() => {
    let sum = 0;
    let allValid = true;
    let hasContent = false;
    for (const row of value) {
      for (const cell of row) {
        const s = cell.trim();
        if (s === '') continue;
        hasContent = true;
        const n = Number(s.replace(',', '.'));
        if (!Number.isFinite(n) || n < 0) {
          allValid = false;
          continue;
        }
        sum += n;
      }
    }
    const sumOk = hasContent && allValid && Math.abs(sum - 1) < NORM_EPS;
    return { sum, allValid, hasContent, sumOk };
  }, [value]);

  return (
    <div className="joint">
      <div className="joint__toolbar">
        <span className="joint__dim">
          X: {rows} · Y: {cols}
        </span>
        <div className="joint__buttons">
          <button type="button" className="tool" onClick={addRow} disabled={rows >= maxSize} aria-label="+X">+X</button>
          <button type="button" className="tool" onClick={removeRow} disabled={rows <= minSize} aria-label="−X">−X</button>
          <button type="button" className="tool" onClick={addCol} disabled={cols >= maxSize} aria-label="+Y">+Y</button>
          <button type="button" className="tool" onClick={removeCol} disabled={cols <= minSize} aria-label="−Y">−Y</button>
        </div>
      </div>

      <div className="joint__grid-wrap">
        <div
          className="joint__grid"
          style={{
            gridTemplateColumns: `44px repeat(${cols}, minmax(0, 76px))`,
          }}
        >
          <div className="joint__corner" aria-hidden="true" />

          {Array.from({ length: cols }).map((_, j) => (
            <div key={`h-${j}`} className="joint__header joint__header--y">
              y{subscript(j + 1)}
            </div>
          ))}

          {value.map((row, r) => (
            <Fragment key={`row-${r}`}>
              <div className="joint__header joint__header--x">
                x{subscript(r + 1)}
              </div>
              {row.map((cell, c) => {
                const key = `${r}-${c}`;
                const isInvalid = invalidCells.has(key);
                return (
                  <input
                    key={key}
                    ref={el => {
                      if (!refs.current[r]) refs.current[r] = [];
                      refs.current[r][c] = el;
                    }}
                    className={`joint__cell ${isInvalid ? 'joint__cell--invalid' : ''}`}
                    value={cell}
                    onChange={e => setCell(r, c, e.target.value)}
                    onKeyDown={e => handleKeyDown(e, r, c)}
                    onBlur={() => onCommit?.(value)}
                    inputMode="decimal"
                    autoComplete="off"
                    spellCheck={false}
                    aria-label={`p(x${r + 1}, y${c + 1})`}
                  />
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      <div
        className={`joint__sum ${
          stats.sumOk ? 'joint__sum--ok' : 'joint__sum--err'
        }`}
      >
        <span className="joint__sum-label">Σ =</span>
        <span className="joint__sum-value">{stats.sum.toFixed(4)}</span>
        {stats.hasContent && !stats.allValid && (
          <span className="joint__sum-hint">
            все вероятности должны быть ≥ 0
          </span>
        )}
        {stats.hasContent && stats.allValid && !stats.sumOk && (
          <span className="joint__sum-hint">сумма должна быть равна 1</span>
        )}
        {stats.sumOk && <span className="joint__sum-hint">✓</span>}
      </div>
    </div>
  );
}

function subscript(n: number): string {
  const SUBS: Record<string, string> = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  };
  return String(n)
    .split('')
    .map(c => SUBS[c] ?? c)
    .join('');
}