package github.axine.matrixcalculator.domain.operation;

import github.axine.matrixcalculator.domain.exception.InvalidMatrixException;
import github.axine.matrixcalculator.domain.model.Matrix;
import org.springframework.stereotype.Component;

@Component
public class DeterminantOperation implements MatrixOperation<Matrix, Double> {

    @Override
    public Double execute(Matrix m) {
        if (!m.isSquare()) {
            throw new InvalidMatrixException("Determinant requires square matrix");
        }
        return Determinants.compute(m);
    }

    @Override
    public OperationType type() {
        return OperationType.DETERMINANT;
    }
}