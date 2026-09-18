package github.axine.matrixcalculator.domain.operation;

import github.axine.matrixcalculator.domain.model.Matrix;
import org.springframework.stereotype.Component;

@Component
public class InverseOperation implements MatrixOperation<Matrix, double[][]> {

    @Override
    public double[][] execute(Matrix m) {
        return Inverses.compute(m);
    }

    @Override
    public OperationType type() {
        return OperationType.INVERSE;
    }
}