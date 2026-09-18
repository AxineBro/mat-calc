package github.axine.matrixcalculator.domain.operation;

import github.axine.matrixcalculator.domain.exception.InvalidMatrixException;
import github.axine.matrixcalculator.domain.exception.SingularMatrixException;
import github.axine.matrixcalculator.domain.model.Matrix;

public final class Inverses {

    private static final double EPS = 1e-12;

    private Inverses() {
    }

    public static double[][] compute(Matrix m) {
        if (!m.isSquare()) {
            throw new InvalidMatrixException("Inverse requires square matrix");
        }

        int n = m.rows();
        double[][] a = m.toArray();
        double[][] inv = new double[n][n];
        for (int i = 0; i < n; i++) {
            inv[i][i] = 1.0;
        }

        for (int k = 0; k < n; k++) {
            int pivot = k;
            for (int i = k + 1; i < n; i++) {
                if (Math.abs(a[i][k]) > Math.abs(a[pivot][k])) {
                    pivot = i;
                }
            }
            if (Math.abs(a[pivot][k]) < EPS) {
                throw new SingularMatrixException(
                        "Matrix is singular and cannot be inverted");
            }

            if (pivot != k) {
                double[] tmp = a[pivot];   a[pivot]   = a[k];   a[k]   = tmp;
                tmp = inv[pivot];          inv[pivot] = inv[k]; inv[k] = tmp;
            }

            double diag = a[k][k];
            for (int j = 0; j < n; j++) {
                a[k][j]   /= diag;
                inv[k][j] /= diag;
            }

            for (int i = 0; i < n; i++) {
                if (i == k) continue;
                double factor = a[i][k];
                if (Math.abs(factor) < EPS) continue;
                for (int j = 0; j < n; j++) {
                    a[i][j]   -= factor * a[k][j];
                    inv[i][j] -= factor * inv[k][j];
                }
            }
        }

        return inv;
    }
}