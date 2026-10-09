package github.axine.matrixcalculator.domain.operation.info;

import java.math.BigDecimal;
import java.math.RoundingMode;

final class InfoMath {

    private InfoMath() {}

    static final double LOG2 = Math.log(2);

    /** log₂ p, при p = 0 возвращает 0 (соглашение 0·log0 = 0). */
    static double log2(double p) {
        if (p <= 0) return 0.0;
        return Math.log(p) / LOG2;
    }

    /** Округление для вывода: 3 знака, HALF_UP. */
    static String fmt(double x) {
        if (Double.isNaN(x)) return "—";
        if (x == 0) return "0";
        BigDecimal bd = BigDecimal.valueOf(x).setScale(3, RoundingMode.HALF_UP);
        // Убираем хвостовые нули: 0.210 -> 0.21
        bd = bd.stripTrailingZeros();
        if (bd.scale() < 0) bd = bd.setScale(0);
        return bd.toPlainString();
    }
}