package github.axine.matrixcalculator.application.service;

import github.axine.matrixcalculator.application.registry.OperationRegistry;
import github.axine.matrixcalculator.domain.model.JointDistribution;
import github.axine.matrixcalculator.domain.model.solution.SolutionResult;
import github.axine.matrixcalculator.domain.operation.OperationType;
import org.springframework.stereotype.Service;

@Service
public class InformationService {
    private final OperationRegistry registry;

    public InformationService(OperationRegistry registry) {
        this.registry = registry;
    }

    public SolutionResult marginals(JointDistribution d) {
        return registry.<JointDistribution, SolutionResult>
                get(OperationType.INFO_MARGINALS).execute(d);
    }

    public SolutionResult conditionals(JointDistribution d) {
        return registry.<JointDistribution, SolutionResult>
                get(OperationType.INFO_CONDITIONALS).execute(d);
    }

    public SolutionResult entropy(JointDistribution d) {
        return registry.<JointDistribution, SolutionResult>
                get(OperationType.INFO_ENTROPY).execute(d);
    }
}