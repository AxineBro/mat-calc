import { useI18n } from '../i18n/I18nContext';
import { SettingsPanel } from './SettingsPanel';

export function Header() {
  const { t } = useI18n();
  return (
    <header className="header">
      <div className="header__brand">
        <h1>{t('appTitle')}</h1>
        <span className="header__sub">{t('appSubtitle')}</span>
      </div>
      <SettingsPanel />
    </header>
  );
}