public with sharing class MathUtility {
    public static Decimal add(Decimal a, Decimal b) {
        return a + b;
    }

    /** Subtraction */
    public static Decimal subtract(Decimal a, Decimal b) {
        return a - b;
    }

    /** Multiplication */
    public static Decimal multiply(Decimal a, Decimal b) {
        return a * b;
    }

    /** Division with zero check */
    public static Decimal divide(Decimal a, Decimal b) {
        if (b == 0) {
            throw new System.MathException('Cannot divide by zero');
        }
        return a / b;
    }

    /** Modulus (handles decimals properly) */
    public static Decimal modulus(Decimal a, Decimal b) {
        if (b == 0) {
            throw new System.MathException('Cannot perform modulus by zero');
        }
        return a - (b * (a.divide(b, 0, System.RoundingMode.FLOOR)));
    }
    
}

