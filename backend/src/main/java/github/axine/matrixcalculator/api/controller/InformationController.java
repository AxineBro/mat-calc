package github.axine.matrixcalculator.api.controller;

import github.axine.matrixcalculator.api.dto.request.JointDistributionRequest;
import github.axine.matrixcalculator.api.dto.response.SolutionResponse;
import github.axine.matrixcalculator.api.mapper.SolutionDtoMapper;
import github.axine.matrixcalculator.application.service.InformationService;
import github.axine.matrixcalculator.domain.exception.InvalidProbabilityException;
import github.axine.matrixcalculator.domain.model.JointDistribution;
import github.axine.matrixcalculator.domain.model.solution.SolutionResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/info")
@CrossOrigin(origins = "http://localhost:5173")
public class InformationController {

    private final InformationService service;

    public InformationController(InformationService service) {
        this.service = service;
    }

    @PostMapping("/marginals")
    public SolutionResponse marginals(@RequestBody JointDistributionRequest r) {
        return handle(service::marginals, r.probabilities());
    }

    @PostMapping("/conditionals")
    public SolutionResponse conditionals(@RequestBody JointDistributionRequest r) {
        return handle(service::conditionals, r.probabilities());
    }

    @PostMapping("/entropy")
    public SolutionResponse entropy(@RequestBody JointDistributionRequest r) {
        return handle(service::entropy, r.probabilities());
    }

    private SolutionResponse handle(java.util.function.Function<JointDistribution, SolutionResult> f,
                                    Double[][] probabilities) {
        if (probabilities == null) {
            throw new InvalidProbabilityException("probabilities must not be null");
        }
        double[][] p = new double[probabilities.length][];
        for (int i = 0; i < probabilities.length; i++) {
            if (probabilities[i] == null) {
                throw new InvalidProbabilityException("row " + (i + 1) + " is null");
            }
            p[i] = new double[probabilities[i].length];
            for (int j = 0; j < probabilities[i].length; j++) {
                if (probabilities[i][j] == null) {
                    throw new InvalidProbabilityException(
                            "cell (" + (i + 1) + "," + (j + 1) + ") is null");
                }
                p[i][j] = probabilities[i][j];
            }
        }
        return SolutionDtoMapper.toDto(f.apply(new JointDistribution(p)));
    }
}