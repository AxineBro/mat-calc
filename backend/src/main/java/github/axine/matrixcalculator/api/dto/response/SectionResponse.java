package github.axine.matrixcalculator.api.dto.response;

import java.util.List;

public record SectionResponse(String title, String summary, List<StepResponse> steps) {}