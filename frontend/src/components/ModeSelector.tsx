import { useI18n } from '../i18n/I18nContext';
import type { CalculatorMode } from '../types';

type Props = {
  mode: CalculatorMode;
  onChange: (m: CalculatorMode) => void;
};

const MODES: CalculatorMode[] = ['determinant', 'cramer'];

export function ModeSelector({ mode, onChange }: Props) {
  const { t } = useI18n();

  return (
    <div className="mode-selector" role="tablist" aria-label={t('mode')}>
      {MODES.map(m => {
        const active = mode === m;
        return (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={active}
            className={`mode-selector__btn ${active ? 'mode-selector__btn--active' : ''}`}
            onClick={() => onChange(m)}
          >
            {m === 'determinant' ? t('modeDeterminant') : t('modeCramer')}
          </button>
        );
      })}
    </div>
  );
}