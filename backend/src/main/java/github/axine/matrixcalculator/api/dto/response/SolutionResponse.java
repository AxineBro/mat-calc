package github.axine.matrixcalculator.api.dto.response;

import java.util.List;

public record SolutionResponse(String answer, List<SectionResponse> sections) {}