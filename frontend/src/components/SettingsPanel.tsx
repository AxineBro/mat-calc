import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { useTheme, type ThemeMode } from '../theme/ThemeContext';
import type { Lang } from '../i18n/translations';

export function SettingsPanel() {
  const { t, lang, setLang } = useI18n();
  const { mode, setMode } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="settings" ref={rootRef}>
      <button
        type="button"
        className="settings__trigger"
        onClick={() => setOpen(v => !v)}
        aria-label={t('settings')}
        aria-expanded={open}
        aria-haspopup="dialog"
        title={t('settings')}
      >
        <IconGear />
      </button>

      {open && (
        <div className="settings__panel" role="dialog" aria-label={t('settings')}>
          <div className="settings__group">
            <span className="settings__label">{t('language')}</span>
            <Segmented<Lang>
              value={lang}
              onChange={setLang}
              ariaLabel={t('language')}
              options={[
                { value: 'ru', label: 'Русский', ariaLabel: 'Русский' },
                { value: 'en', label: 'English', ariaLabel: 'English' },
              ]}
            />
          </div>

          <div className="settings__group">
            <span className="settings__label">{t('theme')}</span>
            <Segmented<ThemeMode>
              value={mode}
              onChange={setMode}
              ariaLabel={t('theme')}
              options={[
                {
                  value: 'system',
                  label: (
                    <>
                      <IconMonitor />
                      <span>{t('themeSystem')}</span>
                    </>
                  ),
                  ariaLabel: t('themeSystem'),
                },
                {
                  value: 'light',
                  label: (
                    <>
                      <IconSun />
                      <span>{t('themeLight')}</span>
                    </>
                  ),
                  ariaLabel: t('themeLight'),
                },
                {
                  value: 'dark',
                  label: (
                    <>
                      <IconMoon />
                      <span>{t('themeDark')}</span>
                    </>
                  ),
                  ariaLabel: t('themeDark'),
                },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Segmented control (полный ARIA radiogroup) ---------- */

type SegOption<T extends string> = {
  value: T;
  label: ReactNode;
  ariaLabel: string;
};

function Segmented<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (v: T) => void;
  options: SegOption<T>[];
  ariaLabel: string;
}) {
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIdx = options.findIndex(o => o.value === value);

  function onKeyDown(e: React.KeyboardEvent, idx: number) {
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      next = (idx + 1) % options.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      next = (idx - 1 + options.length) % options.length;
    } else if (e.key === 'Home') {
      next = 0;
    } else if (e.key === 'End') {
      next = options.length - 1;
    }
    if (next >= 0) {
      e.preventDefault();
      onChange(options[next].value);
      btnRefs.current[next]?.focus();
    }
  }

  return (
    <div className="segmented" role="radiogroup" aria-label={ariaLabel}>
      {options.map((opt, idx) => {
        const isActive = opt.value === value;
        const isTabbable = isActive || (activeIdx === -1 && idx === 0);
        return (
          <button
            key={opt.value}
            ref={el => {
              btnRefs.current[idx] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={opt.ariaLabel}
            tabIndex={isTabbable ? 0 : -1}
            className={`segmented__btn ${isActive ? 'segmented__btn--active' : ''}`}
            onClick={() => onChange(opt.value)}
            onKeyDown={e => onKeyDown(e, idx)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Иконки ---------- */

function IconGear() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.98 19.3a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.62 15a1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.62 8.94a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.09c0 .68.41 1.3 1.03 1.56.6.26 1.3.13 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9c.26.62.88 1.03 1.56 1.03H21a2 2 0 1 1 0 4h-.09c-.68 0-1.3.41-1.56 1.03Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMonitor() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 20h8M12 16v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}