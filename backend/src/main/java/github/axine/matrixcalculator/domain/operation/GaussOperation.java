package github.axine.matrixcalculator.domain.operation;

import github.axine.matrixcalculator.domain.exception.InvalidMatrixException;
import github.axine.matrixcalculator.domain.exception.SingularMatrixException;
import github.axine.matrixcalculator.domain.model.LinearSystem;
import org.springframework.stereotype.Component;

@Component
public class GaussOperation implements MatrixOperation<LinearSystem, double[]> {

    private static final double EPS = 1e-12;

    @Override
    public double[] execute(LinearSystem system) {
        if (!system.coefficients().isSquare()) {
            throw new InvalidMatrixException("Gauss method requires square matrix");
        }

        int n = system.size();
        double[][] a = system.coefficients().toArray();
        double[] b = system.constants();

        for (int k = 0; k < n; k++) {
            int pivot = k;
            for (int i = k + 1; i < n; i++) {
                if (Math.abs(a[i][k]) > Math.abs(a[pivot][k])) {
                    pivot = i;
                }
            }
            if (Math.abs(a[pivot][k]) < EPS) {
                throw new SingularMatrixException(
                        "System has no unique solution (matrix is singular)");
            }

            if (pivot != k) {
                double[] tmp = a[pivot]; a[pivot] = a[k]; a[k] = tmp;
                double tb = b[pivot];    b[pivot] = b[k]; b[k] = tb;
            }

            for (int i = k + 1; i < n; i++) {
                double factor = a[i][k] / a[k][k];
                for (int j = k; j < n; j++) {
                    a[i][j] -= factor * a[k][j];
                }
                b[i] -= factor * b[k];
            }
        }

        double[] x = new double[n];
        for (int i = n - 1; i >= 0; i--) {
            double sum = b[i];
            for (int j = i + 1; j < n; j++) {
                sum -= a[i][j] * x[j];
            }
            x[i] = sum / a[i][i];
        }
        return x;
    }

    @Override
    public OperationType type() {
        return OperationType.GAUSS;
    }
}