package github.axine.matrixcalculator.api.controller;

import github.axine.matrixcalculator.api.dto.request.LinearSystemRequest;
import github.axine.matrixcalculator.api.dto.request.MatrixRequest;
import github.axine.matrixcalculator.api.dto.response.EigenResponse;
import github.axine.matrixcalculator.api.dto.response.LinearSystemResponse;
import github.axine.matrixcalculator.api.dto.response.MatrixResponse;
import github.axine.matrixcalculator.api.dto.response.MatrixResultResponse;
import github.axine.matrixcalculator.api.mapper.MatrixDtoMapper;
import github.axine.matrixcalculator.application.service.MatrixService;
import github.axine.matrixcalculator.domain.model.Matrix;
import github.axine.matrixcalculator.domain.operation.EigenOperation;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matrix")
public class MatrixController {

    private final MatrixService matrixService;

    public MatrixController(MatrixService matrixService) {
        this.matrixService = matrixService;
    }

    @PostMapping("/determinant")
    public MatrixResponse determinant(@RequestBody MatrixRequest matrixRequest) {
        Matrix matrix = MatrixDtoMapper.toDomain(matrixRequest.matrix());
        double determinant = matrixService.determinant(matrix);
        return new MatrixResponse(determinant);
    }

    @PostMapping("/solve/cramer")
    public LinearSystemResponse solveByCramer(@RequestBody LinearSystemRequest request) {
        Matrix coefficients = MatrixDtoMapper.toDomain(request.matrix());
        double[] constants = MatrixDtoMapper.toVector(request.constants());
        double[] solution = matrixService.solveByCramer(coefficients, constants);
        return new LinearSystemResponse(solution);
    }

    @PostMapping("/inverse")
    public MatrixResultResponse inverse(@RequestBody MatrixRequest matrixRequest) {
        Matrix matrix = MatrixDtoMapper.toDomain(matrixRequest.matrix());
        double[][] inverse = matrixService.inverse(matrix);
        return new MatrixResultResponse(inverse);
    }

    @PostMapping("/solve/inverse")
    public LinearSystemResponse solveByInverse(@RequestBody LinearSystemRequest request) {
        Matrix coefficients = MatrixDtoMapper.toDomain(request.matrix());
        double[] constants = MatrixDtoMapper.toVector(request.constants());
        double[] solution = matrixService.solveByInverse(coefficients, constants);
        return new LinearSystemResponse(solution);
    }

    @PostMapping("/solve/gauss")
    public LinearSystemResponse solveByGauss(@RequestBody LinearSystemRequest request) {
        Matrix coefficients = MatrixDtoMapper.toDomain(request.matrix());
        double[] constants = MatrixDtoMapper.toVector(request.constants());
        double[] solution = matrixService.solveByGauss(coefficients, constants);
        return new LinearSystemResponse(solution);
    }

    @PostMapping("/eigen")
    public EigenResponse eigen(@RequestBody MatrixRequest matrixRequest) {
        Matrix matrix = MatrixDtoMapper.toDomain(matrixRequest.matrix());
        EigenOperation.Result r = matrixService.eigen(matrix);
        return new EigenResponse(r.eigenvalues(), r.eigenvectors());
    }
}