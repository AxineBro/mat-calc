package github.axine.matrixcalculator.domain.operation;

import github.axine.matrixcalculator.domain.model.LinearSystem;
import org.springframework.stereotype.Component;

@Component
public class SolveByInverseOperation
        implements MatrixOperation<LinearSystem, double[]> {

    @Override
    public double[] execute(LinearSystem system) {
        int n = system.size();
        double[][] inv = Inverses.compute(system.coefficients());
        double[] b = system.constants();

        double[] x = new double[n];
        for (int i = 0; i < n; i++) {
            double sum = 0.0;
            for (int j = 0; j < n; j++) {
                sum += inv[i][j] * b[j];
            }
            x[i] = sum;
        }
        return x;
    }

    @Override
    public OperationType type() {
        return OperationType.SOLVE_BY_INVERSE;
    }
}