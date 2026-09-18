package github.axine.matrixcalculator.api.dto.request;

public record LinearSystemRequest(Double[][] matrix, Double[] constants) {
}