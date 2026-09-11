package github.axine.matrixcalculator.domain.model;

import github.axine.matrixcalculator.domain.exception.InvalidMatrixException;

public final class Matrix {
    private final double[][] values;
    private final int rows;
    private final int cols;

    public Matrix(double[][] values) {
        if (values == null) {
            throw new InvalidMatrixException("Matrix must not be null");
        }
        if (values.length == 0) {
            throw new InvalidMatrixException("Matrix must not be empty");
        }
        if (values[0] == null || values[0].length == 0) {
            throw new InvalidMatrixException("Matrix row must not be empty");
        }

        int expectedCols = values[0].length;

        for (double[] value : values) {
            if (value == null) {
                throw new InvalidMatrixException("Matrix row must not be null");
            }
            if (value.length != expectedCols) {
                throw new InvalidMatrixException("Matrix must be rectangular");
            }
        }

        this.values = deepCopy(values);
        this.rows = values.length;
        this.cols = expectedCols;
    }

    public double get(int i, int j) {
        return values[i][j];
    }

    public int rows() {
        return rows;
    }

    public int cols() {
        return cols;
    }

    public boolean isSquare() {
        return rows == cols;
    }

    public double[][] toArray() {
        return deepCopy(values);
    }

    private static double[][] deepCopy(double[][] src) {
        double[][] copy = new double[src.length][];
        for (int i = 0; i < src.length; i++) {
            copy[i] = src[i].clone();
        }
        return copy;
    }
}