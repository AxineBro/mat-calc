package github.axine.matrixcalculator.domain.operation;

public interface MatrixOperation<I, O> {
    O execute(I input);
    OperationType type();
}
