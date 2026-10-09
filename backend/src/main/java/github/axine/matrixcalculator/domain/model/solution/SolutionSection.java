package github.axine.matrixcalculator.domain.model.solution;

import java.util.List;

public record SolutionSection(
        String title,
        String summary,
        List<SolutionStep> steps
) {}