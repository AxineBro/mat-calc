import type { ReactNode } from 'react';
import type { TranslationKey } from './i18n/translations';

export type OperationId =
  | 'determinant'
  | 'inverse'
  | 'cramer'
  | 'solveByInverse'
  | 'gauss'
  | 'eigen';


export type OperationCategory = 'matrix' | 'system';
export type ResultKind = 'scalar' | 'vector' | 'matrix' | 'eigen';

export type OperationDef = {
  id: OperationId;
  category: OperationCategory;
  labelKey: TranslationKey;
  descriptionKey: TranslationKey;
  shapeKey: TranslationKey;
  icon: ReactNode;
  requiresVector: boolean;
  requiresSquare: boolean;
  resultKind: ResultKind;
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
    resultKind: 'scalar',
  },
  {
    id: 'eigen',
    category: 'matrix',
    labelKey: 'opEigenLabel',
    descriptionKey: 'opEigenDesc',
    shapeKey: 'opEigenShape',
    icon: <IconEigen />,
    requiresVector: false,
    requiresSquare: true,
    resultKind: 'eigen',
  },
  {
    id: 'inverse',
    category: 'matrix',
    labelKey: 'opInverseLabel',
    descriptionKey: 'opInverseDesc',
    shapeKey: 'opInverseShape',
    icon: <IconInverse />,
    requiresVector: false,
    requiresSquare: true,
    resultKind: 'matrix',
  },
  {
    id: 'gauss',
    category: 'system',
    labelKey: 'opGaussLabel',
    descriptionKey: 'opGaussDesc',
    shapeKey: 'opGaussShape',
    icon: <IconGauss />,
    requiresVector: true,
    requiresSquare: true,
    resultKind: 'vector',
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
    resultKind: 'vector',
  },
  {
    id: 'solveByInverse',
    category: 'system',
    labelKey: 'opSolveByInverseLabel',
    descriptionKey: 'opSolveByInverseDesc',
    shapeKey: 'opSolveByInverseShape',
    icon: <IconInverseSystem />,
    requiresVector: true,
    requiresSquare: true,
    resultKind: 'vector',
  },
];

export const OPERATION_BY_ID = Object.fromEntries(
  OPERATIONS.map(o => [o.id, o]),
) as Record<OperationId, OperationDef>;

export const CATEGORY_ORDER: OperationCategory[] = ['matrix', 'system'];
export const CATEGORY_LABEL_KEY: Record<OperationCategory, TranslationKey> = {
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

function IconInverse() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="8" height="18" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13" y="3" width="8" height="18" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10 12h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M14 9l3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
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

function IconInverseSystem() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 4H4v16h3M17 4h3v16h-3"
        stroke="currentColor" strokeWidth="1.7"
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 4v16"
        stroke="currentColor" strokeWidth="1.7" strokeDasharray="2 2.5" />
      <path d="M10 12h4M14 9l3 3-3 3"
        stroke="currentColor" strokeWidth="1.7"
        strokeLinecap="round" strokeLinejoin="round"
        transform="translate(-3 0)" />
    </svg>
  );
}

function IconGauss() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="6" height="4" rx="1"
        stroke="currentColor" strokeWidth="1.6" />
      <rect x="9" y="10" width="6" height="4" rx="1"
        stroke="currentColor" strokeWidth="1.6" />
      <rect x="15" y="16" width="6" height="4" rx="1"
        stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 3v18" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 2.4" />
    </svg>
  );
}

function IconEigen() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20 9 4M4 20l6-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 6h6M14 12h6M14 18h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity="0.55" />
      <circle cx="18" cy="18" r="2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}