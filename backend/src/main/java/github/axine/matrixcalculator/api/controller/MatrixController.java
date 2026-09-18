package github.axine.matrixcalculator.api.controller;

import github.axine.matrixcalculator.api.dto.request.LinearSystemRequest;
import github.axine.matrixcalculator.api.dto.request.MatrixRequest;
import github.axine.matrixcalculator.api.dto.response.LinearSystemResponse;
import github.axine.matrixcalculator.api.dto.response.MatrixResponse;
import github.axine.matrixcalculator.api.dto.response.MatrixResultResponse;
import github.axine.matrixcalculator.api.mapper.MatrixDtoMapper;
import github.axine.matrixcalculator.application.service.MatrixService;
import github.axine.matrixcalculator.domain.model.Matrix;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matrix")
@CrossOrigin(origins = "http://localhost:5173")
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
}