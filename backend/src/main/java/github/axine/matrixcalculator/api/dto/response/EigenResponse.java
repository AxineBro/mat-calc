package github.axine.matrixcalculator.api.dto.response;

public record EigenResponse(double[] eigenvalues, double[][] eigenvectors) {
}