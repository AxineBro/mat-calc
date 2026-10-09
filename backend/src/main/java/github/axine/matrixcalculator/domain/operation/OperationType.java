package github.axine.matrixcalculator.domain.operation;

public enum OperationType {
    // --- матрицы ---
    DETERMINANT,
    CRAMER,
    INVERSE,
    SOLVE_BY_INVERSE,
    GAUSS,
    EIGEN,
    // --- теория информации ---
    INFO_MARGINALS,
    INFO_CONDITIONALS,
    INFO_ENTROPY
}