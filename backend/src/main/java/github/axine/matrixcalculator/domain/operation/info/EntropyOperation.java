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
public class EntropyOperation
        implements MatrixOperation<JointDistribution, SolutionResult> {

    private final InfoMessages msg;

    public EntropyOperation(MessageSource messages) {
        this.msg = new InfoMessages(messages);
    }

    @Override
    public SolutionResult execute(JointDistribution d) {
        double[] px = d.marginalX();
        double[] py = d.marginalY();

        double hx = shannon(px);
        double hy = shannon(py);
        double hxy = jointEntropy(d);

        double[] hGivenYj = new double[d.yCount()];
        for (int j = 0; j < d.yCount(); j++) {
            hGivenYj[j] = partialXGivenY(d, j);
        }
        double[] hGivenXi = new double[d.xCount()];
        for (int i = 0; i < d.xCount(); i++) {
            hGivenXi[i] = partialYGivenX(d, i);
        }

        double hyGiven = 0;
        for (int j = 0; j < d.yCount(); j++) hyGiven += py[j] * hGivenYj[j];
        double hxGiven = 0;
        for (int i = 0; i < d.xCount(); i++) hxGiven += px[i] * hGivenXi[i];

        List<SolutionSection> sections = List.of(
                entropyX(px, hx),
                entropyY(py, hy),
                jointEntropySection(d, hxy),
                partialXGivenY(d, hGivenYj),
                partialYGivenX(d, hGivenXi),
                fullConditional(
                        msg.t("info.entropy.section.full.hy"),
                        "H_Y(X)",
                        EntropyFormulas.ENTROPY_X_GIVEN_Y,
                        py, hGivenYj, hyGiven),
                fullConditional(
                        msg.t("info.entropy.section.full.hx"),
                        "H_X(Y)",
                        EntropyFormulas.ENTROPY_Y_GIVEN_X,
                        px, hGivenXi, hxGiven)
        );

        String answer = msg.t("info.entropy.answer",
                InfoMath.fmt(hx), InfoMath.fmt(hy), InfoMath.fmt(hxy),
                InfoMath.fmt(hyGiven), InfoMath.fmt(hxGiven));

        return new SolutionResult(answer, sections);
    }

    @Override
    public OperationType type() {
        return OperationType.INFO_ENTROPY;
    }

    /* ---------- Секции ---------- */

    private SolutionSection entropyX(double[] px, double hx) {
        List<SolutionStep> steps = new ArrayList<>();
        steps.add(SolutionStep.of(msg.t("info.step.formula"),
                EntropyFormulas.ENTROPY_X));
        steps.add(SolutionStep.substitution(msg.t("info.step.substitution"),
                sumSubstitution(px)));
        steps.add(SolutionStep.result(
                msg.t("info.entropy.result.generic", "H(X)", InfoMath.fmt(hx))));
        steps.add(new SolutionStep(null, null, null, null,
                msg.t("info.entropy.note.zeroLog")));
        return new SolutionSection(msg.t("info.entropy.section.hx"), null, steps);
    }

    private SolutionSection entropyY(double[] py, double hy) {
        List<SolutionStep> steps = new ArrayList<>();
        steps.add(SolutionStep.of(msg.t("info.step.formula"),
                EntropyFormulas.ENTROPY_Y));
        steps.add(SolutionStep.substitution(msg.t("info.step.substitution"),
                sumSubstitution(py)));
        steps.add(SolutionStep.result(
                msg.t("info.entropy.result.generic", "H(Y)", InfoMath.fmt(hy))));
        steps.add(new SolutionStep(null, null, null, null,
                msg.t("info.entropy.note.zeroLog")));
        return new SolutionSection(msg.t("info.entropy.section.hy"), null, steps);
    }

    private SolutionSection jointEntropySection(JointDistribution d, double hxy) {
        List<SolutionStep> steps = new ArrayList<>();
        steps.add(SolutionStep.of(msg.t("info.step.formula"),
                EntropyFormulas.ENTROPY_XY));

        StringBuilder sub = new StringBuilder();
        sub.append("H(XY) = -\\Big(");
        for (int i = 0; i < d.xCount(); i++) {
            if (i > 0) sub.append(" + ");
            sub.append("\\big(");
            for (int j = 0; j < d.yCount(); j++) {
                if (j > 0) sub.append(" + ");
                double p = d.p(i, j);
                sub.append(InfoMath.fmt(p))
                        .append(" \\log_2 ").append(InfoMath.fmt(p));
            }
            sub.append("\\big)");
        }
        sub.append("\\Big)");

        steps.add(SolutionStep.substitution(msg.t("info.step.substitution"),
                sub.toString()));
        steps.add(SolutionStep.result(
                msg.t("info.entropy.result.generic", "H(XY)", InfoMath.fmt(hxy))));
        return new SolutionSection(
                msg.t("info.entropy.section.hxy"), null, steps);
    }

    private SolutionSection partialXGivenY(JointDistribution d, double[] hGivenYj) {
        List<SolutionStep> steps = new ArrayList<>();
        steps.add(SolutionStep.of(
                msg.t("info.entropy.formula.partial.x"),
                EntropyFormulas.ENTROPY_X_GIVEN_YJ));
        for (int j = 0; j < d.yCount(); j++) {
            double py = d.py(j);
            steps.add(SolutionStep.result(
                    msg.t("info.entropy.partial.column", j + 1, InfoMath.fmt(py))));
            if (py <= 0) {
                steps.add(SolutionStep.result(
                        msg.t("info.entropy.partial.zero.y", j + 1)));
                continue;
            }
            StringBuilder sub = new StringBuilder();
            sub.append("H_{y_").append(j + 1).append("}(X) = -\\Big(");
            for (int i = 0; i < d.xCount(); i++) {
                if (i > 0) sub.append(" + ");
                double cond = d.conditionalXGivenY(i, j);
                sub.append(InfoMath.fmt(cond))
                        .append(" \\log_2 ").append(InfoMath.fmt(cond));
            }
            sub.append("\\Big)");
            steps.add(SolutionStep.substitution(null, sub.toString()));
            steps.add(SolutionStep.result(
                    msg.t("info.entropy.result.generic",
                            "H_{y_" + (j + 1) + "}(X)",
                            InfoMath.fmt(hGivenYj[j]))));
        }
        return new SolutionSection(
                msg.t("info.entropy.section.partial.x"), null, steps);
    }

    private SolutionSection partialYGivenX(JointDistribution d, double[] hGivenXi) {
        List<SolutionStep> steps = new ArrayList<>();
        steps.add(SolutionStep.of(
                msg.t("info.entropy.formula.partial.y"),
                EntropyFormulas.ENTROPY_Y_GIVEN_XI));
        for (int i = 0; i < d.xCount(); i++) {
            double px = d.px(i);
            steps.add(SolutionStep.result(
                    msg.t("info.entropy.partial.row", i + 1, InfoMath.fmt(px))));
            if (px <= 0) {
                steps.add(SolutionStep.result(
                        msg.t("info.entropy.partial.zero.x", i + 1)));
                continue;
            }
            StringBuilder sub = new StringBuilder();
            sub.append("H_{x_").append(i + 1).append("}(Y) = -\\Big(");
            for (int j = 0; j < d.yCount(); j++) {
                if (j > 0) sub.append(" + ");
                double cond = d.conditionalYGivenX(i, j);
                sub.append(InfoMath.fmt(cond))
                        .append(" \\log_2 ").append(InfoMath.fmt(cond));
            }
            sub.append("\\Big)");
            steps.add(SolutionStep.substitution(null, sub.toString()));
            steps.add(SolutionStep.result(
                    msg.t("info.entropy.result.generic",
                            "H_{x_" + (i + 1) + "}(Y)",
                            InfoMath.fmt(hGivenXi[i]))));
        }
        return new SolutionSection(
                msg.t("info.entropy.section.partial.y"), null, steps);
    }

    private SolutionSection fullConditional(String sectionTitle,
                                            String label,
                                            String formula,
                                            double[] weights,
                                            double[] partials,
                                            double total) {
        List<SolutionStep> steps = new ArrayList<>();
        steps.add(SolutionStep.of(msg.t("info.step.formula"), formula));

        StringBuilder sub = new StringBuilder();
        sub.append(label).append(" = ");
        for (int j = 0; j < weights.length; j++) {
            if (j > 0) sub.append(" + ");
            sub.append(InfoMath.fmt(weights[j]))
                    .append(" \\cdot ").append(InfoMath.fmt(partials[j]));
        }
        steps.add(SolutionStep.substitution(msg.t("info.step.substitution"),
                sub.toString()));
        steps.add(SolutionStep.result(
                msg.t("info.entropy.result.generic", label, InfoMath.fmt(total))));
        return new SolutionSection(sectionTitle, null, steps);
    }

    /* ---------- Математика ---------- */

    private static double shannon(double[] p) {
        double h = 0;
        for (double pi : p) {
            if (pi > 0) h -= pi * InfoMath.log2(pi);
        }
        return h;
    }

    private static double jointEntropy(JointDistribution d) {
        double h = 0;
        for (int i = 0; i < d.xCount(); i++) {
            for (int j = 0; j < d.yCount(); j++) {
                double p = d.p(i, j);
                if (p > 0) h -= p * InfoMath.log2(p);
            }
        }
        return h;
    }

    private static double partialXGivenY(JointDistribution d, int j) {
        double h = 0;
        for (int i = 0; i < d.xCount(); i++) {
            double p = d.conditionalXGivenY(i, j);
            if (!Double.isNaN(p) && p > 0) h -= p * InfoMath.log2(p);
        }
        return h;
    }

    private static double partialYGivenX(JointDistribution d, int i) {
        double h = 0;
        for (int j = 0; j < d.yCount(); j++) {
            double p = d.conditionalYGivenX(i, j);
            if (!Double.isNaN(p) && p > 0) h -= p * InfoMath.log2(p);
        }
        return h;
    }

    private static String sumSubstitution(double[] p) {
        StringBuilder sb = new StringBuilder("H = -\\Big(");
        for (int i = 0; i < p.length; i++) {
            if (i > 0) sb.append(" + ");
            sb.append(InfoMath.fmt(p[i]))
                    .append(" \\log_2 ").append(InfoMath.fmt(p[i]));
        }
        sb.append("\\Big)");
        return sb.toString();
    }
}