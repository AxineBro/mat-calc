package github.axine.matrixcalculator.domain.model;

import github.axine.matrixcalculator.domain.exception.InvalidMatrixException;

public final class LinearSystem {

    private final Matrix coefficients;
    private final double[] constants;

    public LinearSystem(Matrix coefficients, double[] constants) {
        if (coefficients == null) {
            throw new InvalidMatrixException("Coefficient matrix must not be null");
        }
        if (!coefficients.isSquare()) {
            throw new InvalidMatrixException("Coefficient matrix must be square");
        }
        if (constants == null) {
            throw new InvalidMatrixException("Constants vector must not be null");
        }
        if (constants.length != coefficients.rows()) {
            throw new InvalidMatrixException(
                    "Constants vector size must equal matrix order");
        }
        this.coefficients = coefficients;
        this.constants = constants.clone();
    }

    public Matrix coefficients() {
        return coefficients;
    }

    public int size() {
        return constants.length;
    }

    public double[] constants() {
        return constants.clone();
    }

    public Matrix withColumnReplaced(int column, double[] replacement) {
        double[][] a = coefficients.toArray();
        for (int i = 0; i < a.length; i++) {
            a[i][column] = replacement[i];
        }
        return new Matrix(a);
    }
}