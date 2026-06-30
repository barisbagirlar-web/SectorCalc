// Type declarations for big.js v7.0.1
// Covers the subset used by SectorCalc's SafeMath layer.
// https://github.com/MikeMcl/big.js

declare module "big.js" {
  type BigSource = number | string | Big;

  interface BigConstructor {
    new (n: BigSource): Big;
    (n: BigSource): Big;

    /** Maximum number of decimal places. */
    DP: number;
    /** Rounding mode: 0=down, 1=half-up, 2=half-even, 3=up. */
    RM: number;
    /** When true, primitive-number construction throws on precision loss. */
    STRICT: boolean;

    /** Rounding mode constants (legacy, also available as static props). */
    readonly ROUND_DOWN: 0;
    readonly ROUND_HALF_UP: 1;
    readonly ROUND_HALF_EVEN: 2;
    readonly ROUND_UP: 3;
  }

  interface Big {
    /** Absolute value. */
    abs(): Big;
    /** Compare (returns -1, 0, or 1). */
    cmp(n: BigSource): number;
    /** Division. */
    div(n: BigSource): Big;
    /** Equal. */
    eq(n: BigSource): boolean;
    /** Greater than. */
    gt(n: BigSource): boolean;
    /** Greater than or equal. */
    gte(n: BigSource): boolean;
    /** Less than. */
    lt(n: BigSource): boolean;
    /** Less than or equal. */
    lte(n: BigSource): boolean;
    /** Minus / subtract. */
    minus(n: BigSource): Big;
    /** Modulo. */
    mod(n: BigSource): Big;
    /** Negate. */
    neg(): Big;
    /** Plus / add. */
    plus(n: BigSource): Big;
    /** Power with integer exponent. Negative exponent requires DP precision. */
    pow(n: number): Big;
    /** Precision (significant digits). */
    prec(sd: number, rm?: number): Big;
    /** Round to DP decimal places. */
    round(dp?: number, rm?: number): Big;
    /** Square root. */
    sqrt(): Big;
    /** Times / multiply. */
    times(n: BigSource): Big;
    /** Exponential notation. */
    toExponential(dp?: number, rm?: number): string;
    /** Fixed-point notation. */
    toFixed(dp?: number, rm?: number): string;
    /** JSON serialisation (alias for toString). */
    toJSON(): string;
    /** String representation. */
    toString(): string;
    /** Primitive number (may lose precision). */
    toNumber(): number;
    /** Precision notation. */
    toPrecision(sd?: number, rm?: number): string;
    /** Primitive value (calls toNumber if not STRICT). */
    valueOf(): string;

    // Aliases
    readonly add: Big["plus"];
    readonly sub: Big["minus"];
    readonly mul: Big["times"];
  }

  const Big: BigConstructor;
  export default Big;
}
