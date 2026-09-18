package github.axine.matrixcalculator.application.service;

import github.axine.matrixcalculator.application.registry.OperationRegistry;
import github.axine.matrixcalculator.domain.model.LinearSystem;
import github.axine.matrixcalculator.domain.model.Matrix;
import github.axine.matrixcalculator.domain.operation.OperationType;
import org.springframework.stereotype.Service;

@Service
public class MatrixService {
    private final OperationRegistry registry;

    public MatrixService(OperationRegistry registry) {
        this.registry = registry;
    }

    public double determinant(Matrix matrix) {
        return registry.<Matrix, Double>get(OperationType.DETERMINANT).execute(matrix);
    }

    public double[] solveByCramer(Matrix coefficients, double[] constants) {
        LinearSystem system = new LinearSystem(coefficients, constants);
        return registry.<LinearSystem, double[]>get(OperationType.CRAMER).execute(system);
    }
}