@IsTest
private class MathUtilityTest {

    @IsTest
    static void testAddition() {
        System.assertEquals(8, MathUtility.add(5, 3), 'Addition failed');
        System.assertEquals(-2, MathUtility.add(-5, 3), 'Addition with negative number failed');
    }

    @IsTest
    static void testSubtraction() {
        System.assertEquals(6, MathUtility.subtract(10, 4), 'Subtraction failed');
        System.assertEquals(-9, MathUtility.subtract(-5, 4), 'Subtraction with negative number failed');
    }

    @IsTest
    static void testMultiplication() {
        System.assertEquals(42, MathUtility.multiply(6, 7), 'Multiplication failed');
        System.assertEquals(-15, MathUtility.multiply(-5, 3), 'Multiplication with negative number failed');
    }

    @IsTest
    static void testDivision() {
        System.assertEquals(4, MathUtility.divide(20, 5), 'Division failed');
        System.assertEquals(-2, MathUtility.divide(-10, 5), 'Division with negative number failed');
    }

    @IsTest
    static void testModulus() {
        System.assertEquals(1, MathUtility.modulus(10, 3), 'Modulus failed');
        System.assertEquals(2, MathUtility.modulus(20, 9), 'Modulus failed');
        System.assertEquals(0, MathUtility.modulus(15, 5), 'Modulus should be 0');
    }

    @IsTest
    static void testDivisionByZero() {
        try {
            MathUtility.divide(10, 0);
            System.assert(false, 'Expected exception for division by zero');
        } catch (System.MathException e) {
            System.assertEquals('Cannot divide by zero', e.getMessage());
        }
    }

    @IsTest
    static void testModulusByZero() {
        try {
            MathUtility.modulus(10, 0);
            System.assert(false, 'Expected exception for modulus by zero');
        } catch (System.MathException e) {
            System.assertEquals('Cannot perform modulus by zero', e.getMessage());
        }
    }
}
