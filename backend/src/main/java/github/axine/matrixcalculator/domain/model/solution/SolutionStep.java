package github.axine.matrixcalculator.domain.model.solution;

public record SolutionStep(
        String title,
        String formula,
        String substitution,
        String result,
        String note
) {
    public static SolutionStep of(String title, String formula) {
        return new SolutionStep(title, formula, null, null, null);
    }
    public static SolutionStep substitution(String formula, String substitution) {
        return new SolutionStep(null, formula, substitution, null, null);
    }
    public static SolutionStep result(String result) {
        return new SolutionStep(null, null, null, result, null);
    }
}