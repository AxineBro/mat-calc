package github.axine.matrixcalculator.domain.model;

import github.axine.matrixcalculator.domain.exception.InvalidProbabilityException;

public final class JointDistribution {

    private static final double NORM_EPS = 1e-6;

    private final double[][] p;
    private final int n;
    private final int k;
    private final double[] marginalX;
    private final double[] marginalY;

    public JointDistribution(double[][] p) {
        validate(p);
        this.p = deepCopy(p);
        this.n = p.length;
        this.k = p[0].length;
        this.marginalX = computeMarginalX();
        this.marginalY = computeMarginalY();
    }

    private static void validate(double[][] p) {
        if (p == null || p.length == 0) {
            throw new InvalidProbabilityException(
                    "Joint distribution must not be empty");
        }
        if (p[0] == null || p[0].length == 0) {
            throw new InvalidProbabilityException(
                    "Joint distribution row must not be empty");
        }
        int k = p[0].length;
        double sum = 0;
        for (int i = 0; i < p.length; i++) {
            if (p[i] == null) {
                throw new InvalidProbabilityException(
                        "Joint distribution row " + (i + 1) + " is null");
            }
            if (p[i].length != k) {
                throw new InvalidProbabilityException(
                        "Joint distribution must be rectangular");
            }
            for (int j = 0; j < k; j++) {
                double v = p[i][j];
                if (Double.isNaN(v) || Double.isInfinite(v)) {
                    throw new InvalidProbabilityException(
                            "Probability at (" + (i + 1) + "," + (j + 1) + ") is not a number");
                }
                if (v < 0) {
                    throw new InvalidProbabilityException(
                            "Probability at (" + (i + 1) + "," + (j + 1) + ") is negative");
                }
                sum += v;
            }
        }
        if (Math.abs(sum - 1.0) > NORM_EPS) {
            throw new InvalidProbabilityException(String.format(
                    "Сумма вероятностей должна равняться 1 (сейчас %.6f)", sum));
        }
    }

    public int xCount() { return n; }
    public int yCount() { return k; }
    public double p(int i, int j) { return p[i][j]; }
    public double px(int i) { return marginalX[i]; }
    public double py(int j) { return marginalY[j]; }

    public double[][] joint() { return deepCopy(p); }
    public double[] marginalX() { return marginalX.clone(); }
    public double[] marginalY() { return marginalY.clone(); }

    public double conditionalXGivenY(int i, int j) {
        double denom = marginalY[j];
        if (denom <= 0) return Double.NaN;
        return p[i][j] / denom;
    }

    public double conditionalYGivenX(int i, int j) {
        double denom = marginalX[i];
        if (denom <= 0) return Double.NaN;
        return p[i][j] / denom;
    }

    private double[] computeMarginalX() {
        double[] r = new double[n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < k; j++) r[i] += p[i][j];
        }
        return r;
    }

    private double[] computeMarginalY() {
        double[] c = new double[k];
        for (int j = 0; j < k; j++) {
            for (int i = 0; i < n; i++) c[j] += p[i][j];
        }
        return c;
    }

    private static double[][] deepCopy(double[][] src) {
        double[][] c = new double[src.length][];
        for (int i = 0; i < src.length; i++) c[i] = src[i].clone();
        return c;
    }
}