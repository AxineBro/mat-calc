package github.axine.matrixcalculator.api.mapper;

import github.axine.matrixcalculator.domain.exception.InvalidMatrixException;
import github.axine.matrixcalculator.domain.model.Matrix;

public final class MatrixDtoMapper {

    private MatrixDtoMapper() {
    }

    public static Matrix toDomain(Number[][] dto) {
        if (dto == null) {
            throw new InvalidMatrixException("Matrix must not be null");
        }
        if (dto.length == 0) {
            throw new InvalidMatrixException("Matrix must not be empty");
        }

        double[][] values = new double[dto.length][];

        for (int i = 0; i < dto.length; i++) {
            if (dto[i] == null) {
                throw new InvalidMatrixException("Matrix row must not be null");
            }
            values[i] = new double[dto[i].length];
            for (int j = 0; j < dto[i].length; j++) {
                if (dto[i][j] == null) {
                    throw new InvalidMatrixException("Matrix element must not be null");
                }
                values[i][j] = dto[i][j].doubleValue();
            }
        }

        return new Matrix(values);
    }

    public static double[] toVector(Number[] dto) {
        if (dto == null) {
            throw new InvalidMatrixException("Constants vector must not be null");
        }
        if (dto.length == 0) {
            throw new InvalidMatrixException("Constants vector must not be empty");
        }
        double[] values = new double[dto.length];
        for (int i = 0; i < dto.length; i++) {
            if (dto[i] == null) {
                throw new InvalidMatrixException("Constants vector element must not be null");
            }
            values[i] = dto[i].doubleValue();
        }
        return values;
    }
}