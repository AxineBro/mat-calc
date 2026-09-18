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

  mode: 'Режим',
  modeDeterminant: 'Определитель',
  modeCramer: 'Метод Крамера',
  vectorLabel: 'Свободные члены',
  solutionLabel: 'Решение системы',
  invalidVectorCells: 'Некорректных значений: {count}',
  fillVectorRemaining: 'Заполните ещё {count} знач.',
  cramerRequiresSquare: 'Для метода Крамера матрица должна быть квадратной',
  noUniqueSolution: 'Система не имеет единственного решения (det A = 0)',
  addRow: 'Добавить строку',
  removeRow: 'Удалить строку',

  operationLabel: 'Операция',
  operationSearch: 'Поиск операции…',
  operationNoResults: 'Ничего не найдено',
  opCategoryMatrix: 'Матрица',
  opCategorySystem: 'Системы уравнений',
  opDeterminantLabel: 'Определитель',
  opDeterminantDesc: 'Скалярная характеристика квадратной матрицы',
  opDeterminantShape: 'A → число',
  opCramerLabel: 'Метод Крамера',
  opCramerDesc: 'Решение СЛАУ через определители',
  opCramerShape: '[A | b] → x₁ … xₙ',

  addRow: 'Добавить строку',
  removeRow: 'Удалить строку',
  addColumn: 'Добавить столбец',
  removeColumn: 'Удалить столбец',
  upload: 'Загрузить CSV',
  clear: 'Очистить',
  reset: 'Сбросить',
  undo: 'Отменить',
  redo: 'Повторить',
  dropToUpload: 'Отпустите файл для загрузки',

  solutionLabel: 'Решение системы',
  invalidVectorCells: 'Некорректных значений: {count}',
  fillVectorRemaining: 'Заполните ещё {count} знач.',
  requiresSquare: 'Для этой операции нужна квадратная матрица',
  noUniqueSolution: 'Система не имеет единственного решения (det A = 0)',

  opInverseLabel: 'Обратная матрица',
  opInverseDesc: 'Матрица A⁻¹, такая что A · A⁻¹ = E',
  opInverseShape: 'A → A⁻¹',

  inverseLabel: 'Обратная матрица',
  singularMatrix: 'Матрица вырождена — обратной не существует',

  opSolveByInverseLabel: 'Метод обратной матрицы',
  opSolveByInverseDesc: 'Решение СЛАУ как x = A⁻¹ · b',
  opSolveByInverseShape: '[A | b] → x₁ … xₙ',
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

  mode: 'Mode',
  modeDeterminant: 'Determinant',
  modeCramer: "Cramer's rule",
  vectorLabel: 'Constants',
  solutionLabel: 'System solution',
  invalidVectorCells: 'Invalid values: {count}',
  fillVectorRemaining: 'Fill {count} more value(s)',
  cramerRequiresSquare: 'Cramer’s rule requires a square matrix',
  noUniqueSolution: 'System has no unique solution (det A = 0)',
  addRow: 'Add row',
  removeRow: 'Remove row',

  operationLabel: 'Operation',
  operationSearch: 'Search operations…',
  operationNoResults: 'No results',
  opCategoryMatrix: 'Matrix',
  opCategorySystem: 'Linear systems',
  opDeterminantLabel: 'Determinant',
  opDeterminantDesc: 'Scalar characteristic of a square matrix',
  opDeterminantShape: 'A → number',
  opCramerLabel: "Cramer's rule",
  opCramerDesc: 'Solve SLE via determinants',
  opCramerShape: '[A | b] → x₁ … xₙ',

  addRow: 'Add row',
  removeRow: 'Remove row',
  addColumn: 'Add column',
  removeColumn: 'Remove column',
  upload: 'Upload CSV',
  clear: 'Clear',
  reset: 'Reset',
  undo: 'Undo',
  redo: 'Redo',
  dropToUpload: 'Drop file to upload',

  solutionLabel: 'System solution',
  invalidVectorCells: 'Invalid values: {count}',
  fillVectorRemaining: 'Fill {count} more value(s)',
  requiresSquare: 'This operation requires a square matrix',
  noUniqueSolution: 'No unique solution (det A = 0)',

  opInverseLabel: 'Inverse matrix',
  opInverseDesc: 'Matrix A⁻¹ such that A · A⁻¹ = E',
  opInverseShape: 'A → A⁻¹',

  inverseLabel: 'Inverse matrix',
  singularMatrix: 'Matrix is singular — no inverse exists',

  opSolveByInverseLabel: 'Inverse-matrix method',
  opSolveByInverseDesc: 'Solve SLE as x = A⁻¹ · b',
  opSolveByInverseShape: '[A | b] → x₁ … xₙ',
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