package github.axine.matrixcalculator.api.error;

import github.axine.matrixcalculator.domain.exception.InvalidMatrixException;
import github.axine.matrixcalculator.domain.exception.SingularMatrixException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidMatrixException.class)
    public ResponseEntity<ApiError> handle(InvalidMatrixException ex) {
        return ResponseEntity.badRequest().body(new ApiError(ex.getMessage()));
    }

    @ExceptionHandler(SingularMatrixException.class)
    public ResponseEntity<ApiError> handle(SingularMatrixException ex) {
        return ResponseEntity.badRequest().body(new ApiError(ex.getMessage()));
    }
}