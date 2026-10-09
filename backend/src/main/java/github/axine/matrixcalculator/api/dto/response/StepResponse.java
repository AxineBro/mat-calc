package github.axine.matrixcalculator.api.dto.response;

public record StepResponse(String title,
                           String formula,
                           String substitution,
                           String result,
                           String note) {}