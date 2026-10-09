package github.axine.matrixcalculator.domain.model.solution;

import java.util.List;

public record SolutionResult(
        String answer,
        List<SolutionSection> sections
) {}