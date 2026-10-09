package github.axine.matrixcalculator.domain.operation.info;

import github.axine.matrixcalculator.domain.formula.EntropyFormulas;
import github.axine.matrixcalculator.domain.model.JointDistribution;
import github.axine.matrixcalculator.domain.model.solution.SolutionResult;
import github.axine.matrixcalculator.domain.model.solution.SolutionSection;
import github.axine.matrixcalculator.domain.model.solution.SolutionStep;
import github.axine.matrixcalculator.domain.operation.MatrixOperation;
import github.axine.matrixcalculator.domain.operation.OperationType;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class MarginalsOperation
        implements MatrixOperation<JointDistribution, SolutionResult> {

    private static final double INDEP_EPS = 1e-6;

    private final InfoMessages msg;

    public MarginalsOperation(MessageSource messages) {
        this.msg = new InfoMessages(messages);
    }

    @Override
    public SolutionResult execute(JointDistribution d) {
        List<SolutionStep> steps = new ArrayList<>();

        steps.add(SolutionStep.of(msg.t("info.marginals.step.x"),
                EntropyFormulas.MARGINAL_X));
        for (int i = 0; i < d.xCount(); i++) {
            StringBuilder sub = new StringBuilder();
            sub.append("p(x_").append(i + 1).append(") = ");
            for (int j = 0; j < d.yCount(); j++) {
                if (j > 0) sub.append(" + ");
                sub.append(InfoMath.fmt(d.p(i, j)));
            }
            steps.add(SolutionStep.substitution(null, sub.toString()));
            steps.add(SolutionStep.result(
                    "p(x_" + (i + 1) + ") = " + InfoMath.fmt(d.px(i))));
        }

        steps.add(SolutionStep.of(msg.t("info.marginals.step.y"),
                EntropyFormulas.MARGINAL_Y));
        for (int j = 0; j < d.yCount(); j++) {
            StringBuilder sub = new StringBuilder();
            sub.append("p(y_").append(j + 1).append(") = ");
            for (int i = 0; i < d.xCount(); i++) {
                if (i > 0) sub.append(" + ");
                sub.append(InfoMath.fmt(d.p(i, j)));
            }
            steps.add(SolutionStep.substitution(null, sub.toString()));
            steps.add(SolutionStep.result(
                    "p(y_" + (j + 1) + ") = " + InfoMath.fmt(d.py(j))));
        }

        SolutionSection marginals = new SolutionSection(
                msg.t("info.marginals.section"), null, steps);

        List<SolutionStep> checkSteps = new ArrayList<>();
        checkSteps.add(SolutionStep.of(msg.t("info.marginals.criterion"),
                EntropyFormulas.INDEPENDENCE_CHECK));

        double maxDev = 0;
        List<String> violations = new ArrayList<>();
        for (int i = 0; i < d.xCount(); i++) {
            for (int j = 0; j < d.yCount(); j++) {
                double joint = d.p(i, j);
                double product = d.px(i) * d.py(j);
                double dev = Math.abs(joint - product);
                maxDev = Math.max(maxDev, dev);
                if (dev > INDEP_EPS) {
                    violations.add(String.format("(x_%d, y_%d)", i + 1, j + 1));
                }
                String sub = String.format(
                        "p(x_%d, y_%d) = %s,  p(x_%d)·p(y_%d) = %s · %s = %s,  |Δ| = %s",
                        i + 1, j + 1, InfoMath.fmt(joint),
                        i + 1, j + 1, InfoMath.fmt(d.px(i)), InfoMath.fmt(d.py(j)),
                        InfoMath.fmt(product), InfoMath.fmt(dev));
                checkSteps.add(SolutionStep.substitution(null, sub));
            }
        }

        boolean independent = violations.isEmpty();
        String verdict = independent
                ? msg.t("info.marginals.independent")
                : msg.t("info.marginals.dependent", String.join(", ", violations));
        checkSteps.add(SolutionStep.result(verdict));

        SolutionSection independence = new SolutionSection(
                msg.t("info.marginals.section.independence"), verdict, checkSteps);

        String answer = independent
                ? msg.t("info.marginals.answer.independent")
                : msg.t("info.marginals.answer.dependent");

        return new SolutionResult(answer, List.of(marginals, independence));
    }

    @Override
    public OperationType type() {
        return OperationType.INFO_MARGINALS;
    }
}