package github.axine.matrixcalculator.api.mapper;

import github.axine.matrixcalculator.api.dto.response.SectionResponse;
import github.axine.matrixcalculator.api.dto.response.SolutionResponse;
import github.axine.matrixcalculator.api.dto.response.StepResponse;
import github.axine.matrixcalculator.domain.model.solution.SolutionResult;
import github.axine.matrixcalculator.domain.model.solution.SolutionSection;
import github.axine.matrixcalculator.domain.model.solution.SolutionStep;

import java.util.List;

public final class SolutionDtoMapper {

    private SolutionDtoMapper() {}

    public static SolutionResponse toDto(SolutionResult result) {
        return new SolutionResponse(
                result.answer(),
                result.sections().stream().map(SolutionDtoMapper::toDto).toList()
        );
    }

    private static SectionResponse toDto(SolutionSection s) {
        return new SectionResponse(
                s.title(),
                s.summary(),
                s.steps().stream().map(SolutionDtoMapper::toDto).toList()
        );
    }

    private static StepResponse toDto(SolutionStep s) {
        return new StepResponse(
                s.title(), s.formula(), s.substitution(), s.result(), s.note()
        );
    }
}