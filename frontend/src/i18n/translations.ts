export type Lang = 'ru' | 'en';

/* =========================================================
   ru
   ========================================================= */
const ru = {
  appTitle: 'Матричный калькулятор',
  appSubtitle: 'Линейная алгебра онлайн',

  // --- Матрица ---
  matrixLabel: 'Матрица {name}',
  cellLabel: 'строка {row}, столбец {col}',
  addRow: 'Добавить строку',
  removeRow: 'Удалить последнюю строку',
  addCol: 'Добавить столбец',
  removeCol: 'Удалить последний столбец',
  // TODO: дубль addCol / removeCol — убрать неиспользуемую пару
  addColumn: 'Добавить столбец',
  removeColumn: 'Удалить столбец',

  // --- Действия над матрицей ---
  undo: 'Отменить',
  redo: 'Повторить',
  clear: 'Очистить значения',
  reset: 'Сбросить матрицу',
  resetHint: 'Сбросить к {rows} × {cols}',
  clearHint: 'Очистить все ячейки, сохранив размер',

  // --- Загрузка из файла ---
  upload: 'Загрузить из файла',
  uploadHint: 'CSV, TSV или TXT. Разделитель — запятая, точка с запятой или табуляция',
  dropHere: 'Отпустите файл, чтобы загрузить',
  // TODO: дубль dropHere / dropToUpload — убрать неиспользуемое
  dropToUpload: 'Отпустите файл для загрузки',
  uploadErrorEmpty: 'Файл пуст',
  uploadErrorTooLarge: 'Слишком большая матрица (максимум {max} × {max})',
  uploadErrorRead: 'Не удалось прочитать файл',

  // --- Результат ---
  determinantLabel: 'Определитель',
  resultEmpty: 'Заполните матрицу — результат появится здесь',
  resultLoading: 'Вычисление…',
  fillRemaining: 'Заполните оставшиеся ячейки: {count}',
  invalidCells: 'Некорректных ячеек: {count}',
  copy: 'Копировать',
  copied: 'Скопировано',

  // --- Ошибки ---
  errorNetwork: 'Нет соединения с сервером',
  errorServer: 'Ошибка сервера ({status})',
  errorCompute: 'Не удалось вычислить',

  // --- Настройки ---
  settings: 'Настройки',
  language: 'Язык',
  theme: 'Тема',
  themeSystem: 'Системная',
  themeLight: 'Светлая',
  themeDark: 'Тёмная',

  // --- Режимы / СЛАУ ---
  mode: 'Режим',
  modeDeterminant: 'Определитель',
  modeCramer: 'Метод Крамера',
  vectorLabel: 'Свободные члены',
  solutionLabel: 'Решение системы',
  invalidVectorCells: 'Некорректных значений: {count}',
  fillVectorRemaining: 'Заполните ещё {count} знач.',
  cramerRequiresSquare: 'Для метода Крамера матрица должна быть квадратной',
  // TODO: проверить, нужен ли отдельный requiresSquare, если cramerRequiresSquare уже есть
  requiresSquare: 'Для этой операции нужна квадратная матрица',
  noUniqueSolution: 'Система не имеет единственного решения (det A = 0)',

  // --- Пикер операций ---
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

  opInverseLabel: 'Обратная матрица',
  opInverseDesc: 'Матрица A⁻¹, такая что A · A⁻¹ = E',
  opInverseShape: 'A → A⁻¹',

  opSolveByInverseLabel: 'Метод обратной матрицы',
  opSolveByInverseDesc: 'Решение СЛАУ как x = A⁻¹ · b',
  opSolveByInverseShape: '[A | b] → x₁ … xₙ',

  opGaussLabel: 'Метод Гаусса',
  opGaussDesc: 'Последовательное исключение неизвестных',
  opGaussShape: '[A | b] → x₁ … xₙ',

  opEigenLabel: 'Собственные числа и векторы',
  opEigenDesc: 'Спектр матрицы: A · v = λ · v',
  opEigenShape: 'A → (λ₁, v₁) … (λₙ, vₙ)',

  // --- Тексты результатов ---
  inverseLabel: 'Обратная матрица',
  singularMatrix: 'Матрица вырождена — обратной не существует',
  gaussNoUniqueSolution:
    'Система не имеет единственного решения (нет решений или их бесконечно много)',
  eigenLabel: 'Собственные пары',
  eigenNoReal: 'У матрицы есть комплексные собственные значения — не поддерживается',
};

export type TranslationKey = keyof typeof ru;

/* =========================================================
   en
   ========================================================= */
const en: Record<TranslationKey, string> = {
  appTitle: 'Matrix calculator',
  appSubtitle: 'Linear algebra online',

  // --- Matrix ---
  matrixLabel: 'Matrix {name}',
  cellLabel: 'row {row}, column {col}',
  addRow: 'Add row',
  removeRow: 'Remove last row',
  addCol: 'Add column',
  removeCol: 'Remove last column',
  addColumn: 'Add column',
  removeColumn: 'Remove column',

  // --- Actions ---
  undo: 'Undo',
  redo: 'Redo',
  clear: 'Clear values',
  reset: 'Reset matrix',
  resetHint: 'Reset to {rows} × {cols}',
  clearHint: 'Clear all cells, keeping the size',

  // --- Upload ---
  upload: 'Upload from file',
  uploadHint: 'CSV, TSV or TXT. Delimiter — comma, semicolon or tab',
  dropHere: 'Drop the file to upload',
  dropToUpload: 'Drop file to upload',
  uploadErrorEmpty: 'The file is empty',
  uploadErrorTooLarge: 'Matrix too large (max {max} × {max})',
  uploadErrorRead: 'Could not read the file',

  // --- Result ---
  determinantLabel: 'Determinant',
  resultEmpty: 'Fill the matrix — the result will appear here',
  resultLoading: 'Computing…',
  fillRemaining: 'Remaining cells: {count}',
  invalidCells: 'Invalid cells: {count}',
  copy: 'Copy',
  copied: 'Copied',

  // --- Errors ---
  errorNetwork: 'Cannot reach the server',
  errorServer: 'Server error ({status})',
  errorCompute: 'Failed to compute',

  // --- Settings ---
  settings: 'Settings',
  language: 'Language',
  theme: 'Theme',
  themeSystem: 'System',
  themeLight: 'Light',
  themeDark: 'Dark',

  // --- Modes / SLE ---
  mode: 'Mode',
  modeDeterminant: 'Determinant',
  modeCramer: "Cramer's rule",
  vectorLabel: 'Constants',
  solutionLabel: 'System solution',
  invalidVectorCells: 'Invalid values: {count}',
  fillVectorRemaining: 'Fill {count} more value(s)',
  cramerRequiresSquare: 'Cramer’s rule requires a square matrix',
  requiresSquare: 'This operation requires a square matrix',
  noUniqueSolution: 'System has no unique solution (det A = 0)',

  // --- Operation picker ---
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

  opInverseLabel: 'Inverse matrix',
  opInverseDesc: 'Matrix A⁻¹ such that A · A⁻¹ = E',
  opInverseShape: 'A → A⁻¹',

  opSolveByInverseLabel: 'Inverse-matrix method',
  opSolveByInverseDesc: 'Solve SLE as x = A⁻¹ · b',
  opSolveByInverseShape: '[A | b] → x₁ … xₙ',

  opGaussLabel: 'Gaussian elimination',
  opGaussDesc: 'Sequential elimination of unknowns',
  opGaussShape: '[A | b] → x₁ … xₙ',

  opEigenLabel: 'Eigenvalues & eigenvectors',
  opEigenDesc: 'Spectrum of the matrix: A · v = λ · v',
  opEigenShape: 'A → (λ₁, v₁) … (λₙ, vₙ)',

  // --- Result texts ---
  inverseLabel: 'Inverse matrix',
  singularMatrix: 'Matrix is singular — no inverse exists',
  gaussNoUniqueSolution:
    'System has no unique solution (none or infinitely many)',
  eigenLabel: 'Eigenpairs',
  eigenNoReal: 'Matrix has complex eigenvalues — not supported',
};

/* =========================================================
   Экспорт и утилиты
   ========================================================= */
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