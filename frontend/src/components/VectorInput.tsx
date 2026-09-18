import { useI18n } from '../i18n/I18nContext';
import type { Vector } from '../types';

type Props = {
  name: string;
  value: Vector;
  onChange: (v: Vector) => void;
  invalidCells?: Set<number>;
  maxSize: number;
};

export function VectorInput({
  name,
  value,
  onChange,
  invalidCells,
  maxSize,
}: Props) {
  const { t } = useI18n();

  const handleCellChange = (i: number, val: string) => {
    onChange(value.map((v, idx) => (idx === i ? val : v)));
  };

  const addRow = () => {
    if (value.length >= maxSize) return;
    onChange([...value, '']);
  };

  const removeRow = () => {
    if (value.length <= 1) return;
    onChange(value.slice(0, -1));
  };

  return (
    <div className="vector">
      <div className="vector__header">
        <span className="vector__name">
          {t('vectorLabel')} {name}
        </span>
        <span className="vector__dim">{value.length} × 1</span>
      </div>

      <div className="vector__body">
        <div className="vector__bracket vector__bracket--left" />

        <div className="vector__grid">
          {value.map((cell, i) => (
            <input
              key={i}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              value={cell}
              onChange={e => handleCellChange(i, e.target.value)}
              aria-label={`${name}${i + 1}`}
              className={`matrix__cell ${
                invalidCells?.has(i) ? 'matrix__cell--invalid' : ''
              }`}
            />
          ))}
        </div>

        <div className="vector__bracket vector__bracket--right" />

        <div className="vector__edge">
          <button
            type="button"
            className="edge-btn"
            onClick={addRow}
            disabled={value.length >= maxSize}
            aria-label={t('addRow')}
            title={t('addRow')}
          >
            +
          </button>
          <button
            type="button"
            className="edge-btn"
            onClick={removeRow}
            disabled={value.length <= 1}
            aria-label={t('removeRow')}
            title={t('removeRow')}
          >
            −
          </button>
        </div>
      </div>
    </div>
  );
}