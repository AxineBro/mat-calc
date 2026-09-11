package github.axine.matrixcalculator.domain.operation;

import github.axine.matrixcalculator.domain.exception.InvalidMatrixException;
import github.axine.matrixcalculator.domain.model.Matrix;
import org.springframework.stereotype.Component;

@Component
public class DeterminantOperation implements MatrixOperation<Matrix, Double> {

    private static final double EPS = 1e-12;

    @Override
    public Double execute(Matrix m) {
        if (!m.isSquare()) {
            throw new InvalidMatrixException("Determinant requires square matrix");
        }

        int n = m.rows();
        double[][] a = m.toArray();
        double det = 1.0;

        for (int k = 0; k < n; k++) {
            int pivot = k;

            for (int i = k + 1; i < n; i++) {
                if (Math.abs(a[i][k]) > Math.abs(a[pivot][k])) {
                    pivot = i;
                }
            }

            if (Math.abs(a[pivot][k]) < EPS) {
                return 0.0;
            }

            if (pivot != k) {
                double[] tmp = a[pivot];
                a[pivot] = a[k];
                a[k] = tmp;
                det = -det;
            }

            det *= a[k][k];

            for (int i = k + 1; i < n; i++) {
                double factor = a[i][k] / a[k][k];
                for (int j = k; j < n; j++) {
                    a[i][j] -= factor * a[k][j];
                }
            }
        }

        return det;
    }

    @Override
    public OperationType type() {
        return OperationType.DETERMINANT;
    }
}