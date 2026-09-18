import type { ReactNode } from 'react';

export type OperationId = 'determinant' | 'cramer';
export type OperationCategory = 'matrix' | 'system';

export type OperationDef = {
  id: OperationId;
  category: OperationCategory;
  /** ключ перевода для названия */
  labelKey: string;
  /** ключ перевода для короткого описания (показывается в дропдауне) */
  descriptionKey: string;
  /** ключ перевода для подписи входных данных, напр. "A → число" */
  shapeKey: string;
  icon: ReactNode;
  /** Нужен ли вектор свободных членов — если да, показываем augmented-вид */
  requiresVector: boolean;
  /** Требуется ли квадратная матрица */
  requiresSquare: boolean;
};

export const OPERATIONS: OperationDef[] = [
  {
    id: 'determinant',
    category: 'matrix',
    labelKey: 'opDeterminantLabel',
    descriptionKey: 'opDeterminantDesc',
    shapeKey: 'opDeterminantShape',
    icon: <IconScalar />,
    requiresVector: false,
    requiresSquare: true,
  },
  {
    id: 'cramer',
    category: 'system',
    labelKey: 'opCramerLabel',
    descriptionKey: 'opCramerDesc',
    shapeKey: 'opCramerShape',
    icon: <IconSystem />,
    requiresVector: true,
    requiresSquare: true,
  },
  // Сюда добавляешь новые — UI подхватит автоматически.
  // Например:
  // { id: 'inverse', category: 'matrix', ... requiresVector: false, requiresSquare: true }
];

export const OPERATION_BY_ID = Object.fromEntries(
  OPERATIONS.map(o => [o.id, o]),
) as Record<OperationId, OperationDef>;

export const CATEGORY_ORDER: OperationCategory[] = ['matrix', 'system'];
export const CATEGORY_LABEL_KEY: Record<OperationCategory, string> = {
  matrix: 'opCategoryMatrix',
  system: 'opCategorySystem',
};

/* ---------- Иконки ---------- */

function IconScalar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 9h.01M15 15h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function IconSystem() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 4H4v16h4M16 4h4v16h-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 4v16" stroke="currentColor" strokeWidth="1.7" strokeDasharray="2 2.5" />
    </svg>
  );
}