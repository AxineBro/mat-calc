package github.axine.matrixcalculator.domain.formula;

public final class EntropyFormulas {

    private EntropyFormulas() {}

    // --- Маргинальные ---
    public static final String MARGINAL_X =
            "p(x_i) = \\sum_{j} p(x_i, y_j)";
    public static final String MARGINAL_Y =
            "p(y_j) = \\sum_{i} p(x_i, y_j)";

    // --- Независимость ---
    public static final String INDEPENDENCE_CHECK =
            "p(x_i, y_j) \\;\\stackrel{?}{=}\\; p(x_i)\\, p(y_j) \\quad \\forall\\, i, j";

    // --- Условные ---
    public static final String CONDITIONAL_X_GIVEN_Y =
            "p(x_i \\mid y_j) = \\dfrac{p(x_i, y_j)}{p(y_j)}";
    public static final String CONDITIONAL_Y_GIVEN_X =
            "p(y_j \\mid x_i) = \\dfrac{p(x_i, y_j)}{p(x_i)}";

    // --- Энтропии ---
    public static final String ENTROPY_X =
            "H(X) = -\\sum_{i} p(x_i) \\log_2 p(x_i)";
    public static final String ENTROPY_Y =
            "H(Y) = -\\sum_{j} p(y_j) \\log_2 p(y_j)";
    public static final String ENTROPY_XY =
            "H(XY) = -\\sum_{i}\\sum_{j} p(x_i, y_j) \\log_2 p(x_i, y_j)";

    // --- Частные условные ---
    public static final String ENTROPY_X_GIVEN_YJ =
            "H_{y_j}(X) = -\\sum_{i} p(x_i \\mid y_j) \\log_2 p(x_i \\mid y_j)";
    public static final String ENTROPY_Y_GIVEN_XI =
            "H_{x_i}(Y) = -\\sum_{j} p(y_j \\mid x_i) \\log_2 p(y_j \\mid x_i)";

    // --- Полные условные ---
    public static final String ENTROPY_X_GIVEN_Y =
            "H_Y(X) = \\sum_{j} p(y_j)\\, H_{y_j}(X) "
                    + "= -\\sum_{j}\\sum_{i} p(x_i, y_j) \\log_2 p(x_i \\mid y_j)";
    public static final String ENTROPY_Y_GIVEN_X =
            "H_X(Y) = \\sum_{i} p(x_i)\\, H_{x_i}(Y) "
                    + "= -\\sum_{i}\\sum_{j} p(x_i, y_j) \\log_2 p(y_j \\mid x_i)";
}