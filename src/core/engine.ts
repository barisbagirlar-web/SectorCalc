/**
 * SECTORCALC ENGINE — single source of truth for Decimal config AND the
 * universal error type. CalcError lives here (leaf module) so every core
 * module throws structured errors with zero circular imports.
 * D() validates ALL invalid input (empty / non-finite / unparseable) into a
 * CalcError — never a raw Error. Optional label yields human-readable messages.
 */
import Decimal from 'decimal.js';

Decimal.set({
  precision: 34,
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -34,
  toExpPos: 34
});

export type ErrorCode =
  | 'E_DIV_ZERO'
  | 'E_NEGATIVE'
  | 'E_NON_POSITIVE'
  | 'E_OUT_OF_RANGE'
  | 'E_DIMENSION_MISMATCH'
  | 'E_CONSERVATION'
  | 'E_MONOTONIC'
  | 'E_INVALID_UNIT'
  | 'E_INVALID_INPUT'
  | 'E_DOMAIN';

export class CalcError extends Error {
  public readonly code: ErrorCode;
  public readonly toolCode: string | null;
  constructor(code: ErrorCode, message: string, toolCode: string | null = null) {
    super(`[${toolCode ? toolCode + ' ' : ''}${code}] ${message}`);
    this.code = code;
    this.toolCode = toolCode;
  }
}

/** Safely build a Decimal. Every failure path throws CalcError (structured). */
export function D(value: Decimal.Value | null | undefined, label = 'value'): Decimal {
  if (value === null || value === undefined || value === '') {
    throw new CalcError('E_INVALID_INPUT', `[engine] ${label} is empty`);
  }
  try {
    const d = new Decimal(value);
    if (!d.isFinite()) {
      throw new CalcError('E_INVALID_INPUT', `[engine] ${label} is non-finite`);
    }
    return d;
  } catch (e: unknown) {
    if (e instanceof CalcError) throw e; // re-throw our finite-check error
    throw new CalcError('E_INVALID_INPUT', `[engine] ${label} is not a number`);
  }
}

/** Format a Decimal to fixed places as a string (never back to Number). */
export function fix(decimal: Decimal, places = 4): string {
  return decimal.toFixed(places);
}

export { Decimal };
