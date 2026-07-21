/**
 * Universal guard contract. CalcError is defined in engine.ts (leaf) and
 * re-exported here so existing imports (`from './guards.js'`) keep working.
 * Every guard routes parsing through D(), so invalid input is always a
 * CalcError with code E_INVALID_INPUT; domain violations get their own code.
 */
import { D, Decimal } from './engine.js';
import { CalcError } from './engine.js';

export { CalcError } from './engine.js';
export type { ErrorCode } from './engine.js';

export function requireFinite(value: Decimal.Value | null | undefined, label: string): Decimal {
  return D(value, label);
}

export function requireNonNegative(value: Decimal.Value | null | undefined, label: string): Decimal {
  const d = requireFinite(value, label);
  if (d.lt(0)) throw new CalcError('E_NEGATIVE', `${label} must be >= 0, got ${d.toString()}`);
  return d;
}

export function requirePositive(value: Decimal.Value | null | undefined, label: string): Decimal {
  const d = requireFinite(value, label);
  if (d.lte(0)) throw new CalcError('E_NON_POSITIVE', `${label} must be > 0, got ${d.toString()}`);
  return d;
}

export function requireLessThan(
  value: Decimal.Value | null | undefined,
  bound: Decimal.Value,
  label: string
): Decimal {
  const d = requireFinite(value, label);
  const b = D(bound, `${label} bound`);
  if (d.gte(b)) throw new CalcError('E_OUT_OF_RANGE', `${label} must be < ${b.toString()}, got ${d.toString()}`);
  return d;
}

export function requireGreaterThan(
  value: Decimal.Value | null | undefined,
  bound: Decimal.Value,
  label: string
): Decimal {
  const d = requireFinite(value, label);
  const b = D(bound, `${label} bound`);
  if (d.lte(b)) throw new CalcError('E_OUT_OF_RANGE', `${label} must be > ${b.toString()}, got ${d.toString()}`);
  return d;
}

export function requireInRange(
  value: Decimal.Value | null | undefined,
  min: Decimal.Value,
  max: Decimal.Value,
  label: string,
  inclusive = true
): Decimal {
  const d = requireFinite(value, label);
  const lo = D(min, `${label} min`);
  const hi = D(max, `${label} max`);
  const ok = inclusive ? d.gte(lo) && d.lte(hi) : d.gt(lo) && d.lt(hi);
  if (!ok) {
    throw new CalcError(
      'E_OUT_OF_RANGE',
      `${label} must be in [${lo.toString()}, ${hi.toString()}], got ${d.toString()}`
    );
  }
  return d;
}
