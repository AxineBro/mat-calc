import { useI18n } from '../i18n/I18nContext';
import { OperationPicker } from './OperationPicker';
import { SettingsPanel } from './SettingsPanel';
import type { OperationId } from '../operations';

type Props = {
  mode: OperationId;
  onModeChange: (id: OperationId) => void;
};

export function Header({ mode, onModeChange }: Props) {
  const { t } = useI18n();

  return (
    <header className="header">
      <div className="header__brand">
        <h1>{t('appTitle')}</h1>
        <span className="header__sub">{t('appSubtitle')}</span>
      </div>

      <div className="header__op">
        <OperationPicker value={mode} onChange={onModeChange} />
      </div>

      <div className="header__spacer" />

      <SettingsPanel />
    </header>
  );
}