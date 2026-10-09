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
public class ConditionalsOperation
        implements MatrixOperation<JointDistribution, SolutionResult> {

    private final InfoMessages msg;

    public ConditionalsOperation(MessageSource messages) {
        this.msg = new InfoMessages(messages);
    }

    @Override
    public SolutionResult execute(JointDistribution d) {
        List<SolutionSection> sections = List.of(
                xGivenY(d),
                yGivenX(d)
        );
        return new SolutionResult(msg.t("info.conditionals.answer"), sections);
    }

    private SolutionSection xGivenY(JointDistribution d) {
        List<SolutionStep> steps = new ArrayList<>();
        steps.add(SolutionStep.of(msg.t("info.step.formula"),
                EntropyFormulas.CONDITIONAL_X_GIVEN_Y));

        for (int j = 0; j < d.yCount(); j++) {
            double py = d.py(j);
            if (py <= 0) {
                steps.add(SolutionStep.result(
                        msg.t("info.conditionals.undefined.y", j + 1)));
                continue;
            }
            steps.add(SolutionStep.result(
                    msg.t("info.conditionals.column", j + 1, InfoMath.fmt(py))));
            for (int i = 0; i < d.xCount(); i++) {
                double pxy = d.p(i, j);
                double cond = pxy / py;
                String sub = String.format(
                        "p(x_%d | y_%d) = %s / %s",
                        i + 1, j + 1, InfoMath.fmt(pxy), InfoMath.fmt(py));
                steps.add(SolutionStep.substitution(null, sub));
                steps.add(SolutionStep.result(String.format(
                        "p(x_%d | y_%d) = %s", i + 1, j + 1, InfoMath.fmt(cond))));
            }
        }
        return new SolutionSection(
                msg.t("info.conditionals.section.xGivenY"), null, steps);
    }

    private SolutionSection yGivenX(JointDistribution d) {
        List<SolutionStep> steps = new ArrayList<>();
        steps.add(SolutionStep.of(msg.t("info.step.formula"),
                EntropyFormulas.CONDITIONAL_Y_GIVEN_X));

        for (int i = 0; i < d.xCount(); i++) {
            double px = d.px(i);
            if (px <= 0) {
                steps.add(SolutionStep.result(
                        msg.t("info.conditionals.undefined.x", i + 1)));
                continue;
            }
            steps.add(SolutionStep.result(
                    msg.t("info.conditionals.row", i + 1, InfoMath.fmt(px))));
            for (int j = 0; j < d.yCount(); j++) {
                double pxy = d.p(i, j);
                double cond = pxy / px;
                String sub = String.format(
                        "p(y_%d | x_%d) = %s / %s",
                        j + 1, i + 1, InfoMath.fmt(pxy), InfoMath.fmt(px));
                steps.add(SolutionStep.substitution(null, sub));
                steps.add(SolutionStep.result(String.format(
                        "p(y_%d | x_%d) = %s", j + 1, i + 1, InfoMath.fmt(cond))));
            }
        }
        return new SolutionSection(
                msg.t("info.conditionals.section.yGivenX"), null, steps);
    }

    @Override
    public OperationType type() {
        return OperationType.INFO_CONDITIONALS;
    }
}