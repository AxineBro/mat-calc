import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Применяем тему до первого кадра, чтобы не мигало
(function applyInitialTheme() {
  const mode = localStorage.getItem('theme');
  const resolved =
    !mode || mode === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : mode;
  document.documentElement.dataset.theme = resolved;
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);