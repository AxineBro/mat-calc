import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import {
  CATEGORY_LABEL_KEY,
  CATEGORY_ORDER,
  OPERATIONS,
  OPERATION_BY_ID,
  type OperationCategory,
  type OperationDef,
  type OperationId,
} from '../operations';

type Props = {
  value: OperationId;
  onChange: (id: OperationId) => void;
};

export function OperationPicker({ value, onChange }: Props) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [focusIndex, setFocusIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const current = OPERATION_BY_ID[value];
  const showSearch = OPERATIONS.length > 6;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return OPERATIONS;
    return OPERATIONS.filter(
      o =>
        t(o.labelKey).toLowerCase().includes(q) ||
        t(o.descriptionKey).toLowerCase().includes(q),
    );
  }, [query, t]);

  const grouped = useMemo(() => {
    const map: Record<OperationCategory, OperationDef[]> = {
      matrix: [],
      system: [],
    };
    for (const op of filtered) map[op.category].push(op);
    return CATEGORY_ORDER.map(cat => ({ cat, ops: map[cat] })).filter(
      g => g.ops.length > 0,
    );
  }, [filtered]);

  const flat = useMemo(() => grouped.flatMap(g => g.ops), [grouped]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    const idx = OPERATIONS.findIndex(o => o.id === value);
    setFocusIndex(Math.max(idx, 0));
    requestAnimationFrame(() => {
      if (showSearch) searchRef.current?.focus();
      else itemRefs.current[Math.max(idx, 0)]?.focus();
    });
  }, [open, showSearch, value]);

  const pick = (id: OperationId) => {
    onChange(id);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (flat.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (focusIndex + 1) % flat.length;
      setFocusIndex(next);
      itemRefs.current[next]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = (focusIndex - 1 + flat.length) % flat.length;
      setFocusIndex(next);
      itemRefs.current[next]?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flat[focusIndex]) pick(flat[focusIndex].id);
    }
  };

  return (
    <div className="op" ref={rootRef}>
      <button
        type="button"
        className={`op__trigger ${open ? 'op__trigger--open' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="op__trigger-icon">{current.icon}</span>
        <span className="op__trigger-body">
          <span className="op__trigger-label">{t(current.labelKey)}</span>
          <span className="op__trigger-shape">{t(current.shapeKey)}</span>
        </span>
        <span className="op__trigger-chevron" aria-hidden="true">
          <ChevronIcon />
        </span>
      </button>

      {open && (
        <div
          className="op__panel"
          role="listbox"
          aria-label={t('operationLabel')}
          onKeyDown={onKeyDown}
        >
          {showSearch && (
            <div className="op__search">
              <SearchIcon />
              <input
                ref={searchRef}
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setFocusIndex(0);
                }}
                placeholder={t('operationSearch')}
                className="op__search-input"
              />
            </div>
          )}

          <div className="op__list">
            {flat.length === 0 && (
              <div className="op__empty">{t('operationNoResults')}</div>
            )}
            {grouped.map(({ cat, ops }) => (
              <div key={cat} className="op__group">
                <div className="op__group-label">
                  {t(CATEGORY_LABEL_KEY[cat])}
                </div>
                {ops.map(op => {
                  const idx = flat.indexOf(op);
                  const selected = op.id === value;
                  return (
                    <button
                      key={op.id}
                      ref={el => {
                        itemRefs.current[idx] = el;
                      }}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      className={`op__item ${
                        selected ? 'op__item--selected' : ''
                      }`}
                      onClick={() => pick(op.id)}
                      onMouseEnter={() => setFocusIndex(idx)}
                    >
                      <span className="op__item-icon">{op.icon}</span>
                      <span className="op__item-body">
                        <span className="op__item-label">{t(op.labelKey)}</span>
                        <span className="op__item-desc">
                          {t(op.descriptionKey)}
                        </span>
                      </span>
                      {selected && (
                        <span className="op__item-check" aria-hidden="true">
                          <CheckIcon />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 12 5 5 9-11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}