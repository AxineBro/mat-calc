package github.axine.matrixcalculator.domain.operation;

import github.axine.matrixcalculator.domain.exception.SingularMatrixException;
import github.axine.matrixcalculator.domain.model.LinearSystem;
import github.axine.matrixcalculator.domain.model.Matrix;
import org.springframework.stereotype.Component;

@Component
public class CramerOperation implements MatrixOperation<LinearSystem, double[]> {

    private static final double EPS = 1e-12;

    @Override
    public double[] execute(LinearSystem system) {
        Matrix a = system.coefficients();
        double[] b = system.constants();
        int n = system.size();

        double detA = Determinants.compute(a);
        if (Math.abs(detA) < EPS) {
            throw new SingularMatrixException(
                    "System has no unique solution (det A = 0)");
        }

        double[] solution = new double[n];
        for (int i = 0; i < n; i++) {
            Matrix replaced = system.withColumnReplaced(i, b);
            solution[i] = Determinants.compute(replaced) / detA;
        }
        return solution;
    }

    @Override
    public OperationType type() {
        return OperationType.CRAMER;
    }
}