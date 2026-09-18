package github.axine.matrixcalculator.domain.operation;

import github.axine.matrixcalculator.domain.exception.InvalidMatrixException;
import github.axine.matrixcalculator.domain.model.Matrix;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class EigenOperation implements MatrixOperation<Matrix, EigenOperation.Result> {

    private static final double EPS = 1e-10;
    private static final int MAX_ITER = 1500;

    public record Result(double[] eigenvalues, double[][] eigenvectors) {
    }

    @Override
    public Result execute(Matrix m) {
        if (!m.isSquare()) {
            throw new InvalidMatrixException(
                    "Eigen-decomposition requires square matrix");
        }

        int n = m.rows();
        double[][] a = m.toArray();

        double[] values = eigenvaluesQR(a, n);
        double[][] vectors = new double[n][n];

        for (int i = 0; i < n; i++) {
            double[] v = eigenvectorFor(a, values[i], n);
            if (v == null) {
                throw new InvalidMatrixException(
                        "Failed to compute eigenvector for eigenvalue " + values[i]);
            }
            vectors[i] = v;
        }
        return new Result(values, vectors);
    }

    @Override
    public OperationType type() {
        return OperationType.EIGEN;
    }

    private static double[] eigenvaluesQR(double[][] input, int n) {
        double[][] a = deepCopy(input);

        for (int iter = 0; iter < MAX_ITER; iter++) {
            if (subdiagonalSmall(a, n)) break;

            double shift = wilkinsonShift(a, n);
            double[][] shifted = new double[n][n];
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    shifted[i][j] = a[i][j];
                }
                shifted[i][i] -= shift;
            }

            double[][] q = identity(n);
            double[][] r = deepCopy(shifted);
            householderQR(r, q, n);

            a = multiply(r, q);
            for (int i = 0; i < n; i++) {
                a[i][i] += shift;
            }
        }

        for (int i = 1; i < n; i++) {
            double scale = Math.abs(a[i][i]) + Math.abs(a[i - 1][i - 1]) + 1.0;
            if (Math.abs(a[i][i - 1]) > EPS * scale) {
                throw new InvalidMatrixException(
                        "Matrix has complex eigenvalues (not supported)");
            }
        }

        double[] ev = new double[n];
        for (int i = 0; i < n; i++) {
            ev[i] = roundNearZero(a[i][i]);
        }
        return ev;
    }

    private static boolean subdiagonalSmall(double[][] a, int n) {
        for (int i = 1; i < n; i++) {
            double scale = Math.abs(a[i][i]) + Math.abs(a[i - 1][i - 1]) + 1.0;
            if (Math.abs(a[i][i - 1]) > EPS * scale) return false;
        }
        return true;
    }

    private static double wilkinsonShift(double[][] a, int n) {
        double d = (a[n - 2][n - 2] - a[n - 1][n - 1]) / 2.0;
        double bc = a[n - 2][n - 1] * a[n - 1][n - 2];
        double disc = d * d + bc;
        if (disc < 0) {
            return a[n - 1][n - 1];
        }
        double sd = Math.sqrt(disc);
        double mu1 = a[n - 1][n - 1] - bc / (d + sd);
        double mu2 = a[n - 1][n - 1] - bc / (d - sd);
        return Math.abs(mu1 - a[n - 1][n - 1]) < Math.abs(mu2 - a[n - 1][n - 1])
                ? mu1
                : mu2;
    }

    private static void householderQR(double[][] r, double[][] q, int n) {
        for (int k = 0; k < n - 1; k++) {
            double norm = 0;
            for (int i = k; i < n; i++) norm += r[i][k] * r[i][k];
            norm = Math.sqrt(norm);
            if (norm < EPS) continue;

            double alpha = r[k][k] > 0 ? -norm : norm;
            double[] v = new double[n - k];
            for (int i = k; i < n; i++) v[i - k] = r[i][k];
            v[0] -= alpha;
            double vn = 0;
            for (double x : v) vn += x * x;
            vn = Math.sqrt(vn);
            if (vn < EPS) continue;
            for (int i = 0; i < v.length; i++) v[i] /= vn;

            for (int j = 0; j < n; j++) {
                double s = 0;
                for (int i = k; i < n; i++) s += v[i - k] * r[i][j];
                for (int i = k; i < n; i++) r[i][j] -= 2 * s * v[i - k];
            }

            for (int i = 0; i < n; i++) {
                double s = 0;
                for (int j = k; j < n; j++) s += q[i][j] * v[j - k];
                for (int j = k; j < n; j++) q[i][j] -= 2 * s * v[j - k];
            }
        }
    }

    private static double[] eigenvectorFor(double[][] a, double lambda, int n) {
        double[][] m = new double[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                m[i][j] = a[i][j];
            }
            m[i][i] -= lambda;
        }

        int rank = 0;
        int[] pivotCol = new int[n];
        Arrays.fill(pivotCol, -1);

        for (int col = 0; col < n && rank < n; col++) {
            int pivot = -1;
            double maxAbs = EPS;
            for (int row = rank; row < n; row++) {
                if (Math.abs(m[row][col]) > maxAbs) {
                    maxAbs = Math.abs(m[row][col]);
                    pivot = row;
                }
            }
            if (pivot == -1) continue;

            double[] tmp = m[pivot]; m[pivot] = m[rank]; m[rank] = tmp;

            double div = m[rank][col];
            for (int j = col; j < n; j++) m[rank][j] /= div;

            for (int row = 0; row < n; row++) {
                if (row == rank) continue;
                double f = m[row][col];
                if (Math.abs(f) < EPS) continue;
                for (int j = col; j < n; j++) m[row][j] -= f * m[rank][j];
            }
            pivotCol[rank] = col;
            rank++;
        }

        boolean[] isPivot = new boolean[n];
        for (int i = 0; i < rank; i++) isPivot[pivotCol[i]] = true;

        int freeCol = -1;
        for (int c = 0; c < n; c++) {
            if (!isPivot[c]) { freeCol = c; break; }
        }
        if (freeCol == -1) return null;

        double[] v = new double[n];
        v[freeCol] = 1.0;
        for (int i = rank - 1; i >= 0; i--) {
            int pc = pivotCol[i];
            double sum = 0;
            for (int j = pc + 1; j < n; j++) sum += m[i][j] * v[j];
            v[pc] = -sum;
        }

        double norm = 0;
        for (double x : v) norm += x * x;
        norm = Math.sqrt(norm);
        if (norm < EPS) return null;
        for (int i = 0; i < n; i++) v[i] = roundNearZero(v[i] / norm);
        return v;
    }

    private static double[][] identity(int n) {
        double[][] m = new double[n][n];
        for (int i = 0; i < n; i++) m[i][i] = 1.0;
        return m;
    }

    private static double[][] deepCopy(double[][] src) {
        double[][] c = new double[src.length][];
        for (int i = 0; i < src.length; i++) c[i] = src[i].clone();
        return c;
    }

    private static double[][] multiply(double[][] x, double[][] y) {
        int n = x.length;
        double[][] z = new double[n][n];
        for (int i = 0; i < n; i++) {
            for (int k = 0; k < n; k++) {
                if (Math.abs(x[i][k]) < EPS) continue;
                double xik = x[i][k];
                for (int j = 0; j < n; j++) {
                    z[i][j] += xik * y[k][j];
                }
            }
        }
        return z;
    }

    private static double roundNearZero(double x) {
        return Math.abs(x) < 1e-9 ? 0.0 : x;
    }
}