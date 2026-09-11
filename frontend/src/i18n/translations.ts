export type Lang = 'ru' | 'en';

const ru = {
  appTitle: 'Матричный калькулятор',
  appSubtitle: 'Линейная алгебра онлайн',

  matrixLabel: 'Матрица {name}',
  cellLabel: 'строка {row}, столбец {col}',
  addRow: 'Добавить строку',
  removeRow: 'Удалить последнюю строку',
  addCol: 'Добавить столбец',
  removeCol: 'Удалить последний столбец',

  determinantLabel: 'Определитель',
  resultEmpty: 'Заполните матрицу — результат появится здесь',
  resultLoading: 'Вычисление…',
  fillRemaining: 'Заполните оставшиеся ячейки: {count}',
  invalidCells: 'Некорректных ячеек: {count}',
  copy: 'Копировать',
  copied: 'Скопировано',

  errorNetwork: 'Нет соединения с сервером',
  errorServer: 'Ошибка сервера ({status})',
  errorCompute: 'Не удалось вычислить',

  settings: 'Настройки',
  language: 'Язык',
  theme: 'Тема',
  themeSystem: 'Системная',
  themeLight: 'Светлая',
  themeDark: 'Тёмная',

  undo: 'Отменить',
  redo: 'Повторить',
  clear: 'Очистить значения',
  reset: 'Сбросить матрицу',
  resetHint: 'Сбросить к {rows} × {cols}',
  clearHint: 'Очистить все ячейки, сохранив размер',

  upload: 'Загрузить из файла',
  uploadHint: 'CSV, TSV или TXT. Разделитель — запятая, точка с запятой или табуляция',
  dropHere: 'Отпустите файл, чтобы загрузить',
  uploadErrorEmpty: 'Файл пуст',
  uploadErrorTooLarge: 'Слишком большая матрица (максимум {max} × {max})',
  uploadErrorRead: 'Не удалось прочитать файл',
};

export type TranslationKey = keyof typeof ru;

const en: Record<TranslationKey, string> = {
  appTitle: 'Matrix calculator',
  appSubtitle: 'Linear algebra online',

  matrixLabel: 'Matrix {name}',
  cellLabel: 'row {row}, column {col}',
  addRow: 'Add row',
  removeRow: 'Remove last row',
  addCol: 'Add column',
  removeCol: 'Remove last column',

  determinantLabel: 'Determinant',
  resultEmpty: 'Fill the matrix — the result will appear here',
  resultLoading: 'Computing…',
  fillRemaining: 'Remaining cells: {count}',
  invalidCells: 'Invalid cells: {count}',
  copy: 'Copy',
  copied: 'Copied',

  errorNetwork: 'Cannot reach the server',
  errorServer: 'Server error ({status})',
  errorCompute: 'Failed to compute',

  settings: 'Settings',
  language: 'Language',
  theme: 'Theme',
  themeSystem: 'System',
  themeLight: 'Light',
  themeDark: 'Dark',

  undo: 'Undo',
  redo: 'Redo',
  clear: 'Clear values',
  reset: 'Reset matrix',
  resetHint: 'Reset to {rows} × {cols}',
  clearHint: 'Clear all cells, keeping the size',

  upload: 'Upload from file',
  uploadHint: 'CSV, TSV or TXT. Delimiter — comma, semicolon or tab',
  dropHere: 'Drop the file to upload',
  uploadErrorEmpty: 'The file is empty',
  uploadErrorTooLarge: 'Matrix too large (max {max} × {max})',
  uploadErrorRead: 'Could not read the file',
};

export const dictionaries: Record<Lang, Record<TranslationKey, string>> = {
  ru,
  en,
};

export function interpolate(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    params[k] !== undefined ? String(params[k]) : `{${k}}`,
  );
}