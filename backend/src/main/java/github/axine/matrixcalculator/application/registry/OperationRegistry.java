package github.axine.matrixcalculator.application.registry;

import github.axine.matrixcalculator.domain.operation.MatrixOperation;
import github.axine.matrixcalculator.domain.operation.OperationType;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class OperationRegistry {
    private final Map<OperationType, MatrixOperation<?, ?>> operations;

    public OperationRegistry(List<MatrixOperation<?, ?>> ops) {
        this.operations = ops.stream()
                .collect(Collectors.toMap(MatrixOperation::type, Function.identity()));
    }

    @SuppressWarnings("unchecked")
    public <I, O> MatrixOperation<I, O> get(OperationType type) {
        var op = operations.get(type);
        if (op == null) throw new UnsupportedOperationException("Operation not registered: " + type);
        return (MatrixOperation<I, O>) op;
    }
}