import "server-only";
import Big from "big.js";

export type Decimal = ReturnType<typeof Big>;
export type DecimalSource = string | number;
const CANONICAL_DECIMAL_PATTERN = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;

export function isCanonicalDecimalSource(source: unknown): source is DecimalSource {
  if (typeof source === "number") return Number.isFinite(source);
  return typeof source === "string" &&
    source.trim().length > 0 &&
    CANONICAL_DECIMAL_PATTERN.test(source.trim());
}

export interface DomainError {
  code:
    | "MISSING_INPUT"
    | "NON_FINITE_INPUT"
    | "INVALID_DECIMAL"
    | "DOMAIN_VIOLATION"
    | "DIVISION_BY_ZERO"
    | "OUTPUT_RANGE_EXCEEDED"
    | "KERNEL_UNAVAILABLE"
    | "KERNEL_TIMEOUT"
    | "KERNEL_CONTRACT_VIOLATION";
  field: string;
  message: string;
}

export type DomainResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: DomainError };

export const ok = <T>(value: T): DomainResult<T> => ({ ok: true, value });
export const err = <T = never>(error: DomainError): DomainResult<T> => ({
  ok: false,
  error,
});

/**
 * Big.js exposes constructor-local precision. A fresh constructor prevents
 * one request or module from mutating another request's rounding context.
 */
export function createDecimalContext() {
  const DecimalConstructor = Big();
  DecimalConstructor.DP = 50;
  // Big.js clone constructors do not copy the named static constants.
  DecimalConstructor.RM = 2;
  DecimalConstructor.STRICT = true;

  const decimal = (
    source: DecimalSource | undefined,
    field: string,
  ): DomainResult<Decimal> => {
    if (source === undefined) {
      return err({
        code: "MISSING_INPUT",
        field,
        message: field + " is required.",
      });
    }
    if (typeof source === "number" && !Number.isFinite(source)) {
      return err({
        code: "NON_FINITE_INPUT",
        field,
        message: field + " must be finite.",
      });
    }

    const canonical = typeof source === "number" ? String(source) : source.trim();
    if (!isCanonicalDecimalSource(canonical)) {
      return err({
        code: "INVALID_DECIMAL",
        field,
        message: field + " is not a canonical decimal value.",
      });
    }

    try {
      return ok(DecimalConstructor(canonical));
    } catch {
      return err({
        code: "INVALID_DECIMAL",
        field,
        message: field + " cannot be represented by the decimal engine.",
      });
    }
  };

  const divide = (
    numerator: Decimal,
    denominator: Decimal,
    field: string,
  ): DomainResult<Decimal> => {
    if (denominator.eq("0")) {
      return err({
        code: "DIVISION_BY_ZERO",
        field,
        message: field + " has a zero denominator.",
      });
    }
    return ok(numerator.div(denominator));
  };

  return { DecimalConstructor, decimal, divide };
}

const MAX_JSON_NUMBER = "1.7976931348623157e308";

/**
 * Conversion to IEEE-754 is allowed only at the presentation boundary.
 * No arithmetic is performed after this conversion.
 */
export function decimalToPresentationNumber(
  value: Decimal,
  field: string,
  decimalPlaces?: number,
): DomainResult<number> {
  const bounded = decimalPlaces === undefined
    ? value
    : value.round(decimalPlaces, 2);

  if (bounded.abs().gt(MAX_JSON_NUMBER)) {
    return err({
      code: "OUTPUT_RANGE_EXCEEDED",
      field,
      message: field + " exceeds the JSON numeric presentation range.",
    });
  }

  const serialized = Number(bounded.toString());
  if (!Number.isFinite(serialized)) {
    return err({
      code: "OUTPUT_RANGE_EXCEEDED",
      field,
      message: field + " cannot be serialized as a finite JSON number.",
    });
  }
  return ok(serialized);
}

export function domainErrorMessage(error: DomainError): string {
  return error.code + ":" + error.field + ":" + error.message;
}
