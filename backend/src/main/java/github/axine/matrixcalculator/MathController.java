package github.axine.matrixcalculator;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matrix")
@CrossOrigin(origins = "http://localhost:5173")
public class MathController {

    public record RequestCalc(Integer[][] matrix){};
    public record ResponseCalc(Integer determinant){};

    @PostMapping("/determinant")
    public ResponseCalc calc(@RequestBody RequestCalc requestCalc){
        return new ResponseCalc(requestCalc.matrix[0][0]);
    }
}
