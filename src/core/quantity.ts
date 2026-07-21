/**
 * Dimensional quantity: a number is meaningless without its unit in engineering.
 * Arithmetic enforces dimension compatibility at runtime — adding length to mass
 * is a CalcError, never a silent wrong number. Cross-unit adds convert visibly.
 */
import { D, Decimal } from './engine.js';
import { convert } from './unit-converter.js';
import { CalcError } from './guards.js';

export interface Quantity {
  readonly value: Decimal;
  readonly unit: string;
  readonly dimension: string;
}

export function qty(value: Decimal.Value, unit: string, dimension: string): Quantity {
  return { value: D(value), unit, dimension };
}

function sameDimension(a: Quantity, b: Quantity, op: string): void {
  if (a.dimension !== b.dimension) {
    throw new CalcError('E_DIMENSION_MISMATCH', `cannot ${op} ${a.dimension} with ${b.dimension}`);
  }
}

export function qconvert(q: Quantity, toUnit: string): Quantity {
  if (q.unit === toUnit) return q;
  const v = convert(q.value.toString(), q.unit, toUnit, q.dimension);
  return { value: v, unit: toUnit, dimension: q.dimension };
}

export function qadd(a: Quantity, b: Quantity): Quantity {
  sameDimension(a, b, 'add');
  const bc = qconvert(b, a.unit);
  return { value: a.value.plus(bc.value), unit: a.unit, dimension: a.dimension };
}

export function qsub(a: Quantity, b: Quantity): Quantity {
  sameDimension(a, b, 'subtract');
  const bc = qconvert(b, a.unit);
  return { value: a.value.minus(bc.value), unit: a.unit, dimension: a.dimension };
}

export function qmulScalar(q: Quantity, factor: Decimal.Value): Quantity {
  return { value: q.value.times(D(factor)), unit: q.unit, dimension: q.dimension };
}

export function qdivScalar(q: Quantity, divisor: Decimal.Value): Quantity {
  const d = D(divisor);
  if (d.isZero()) throw new CalcError('E_DIV_ZERO', 'cannot divide quantity by zero');
  return { value: q.value.div(d), unit: q.unit, dimension: q.dimension };
}

export function qcompare(a: Quantity, b: Quantity): number {
  sameDimension(a, b, 'compare');
  const bc = qconvert(b, a.unit);
  return a.value.comparedTo(bc.value) ?? 0;
}

export function qeq(a: Quantity, b: Quantity): boolean {
  return qcompare(a, b) === 0;
}
