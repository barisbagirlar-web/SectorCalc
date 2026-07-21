/**
 * Unit conversion. Table-based, deterministic.
 * Every dimension converts through a BASE unit, then to the target.
 * No hidden conversion — the UI always shows "X mm = Y in".
 *
 * NOTE: dimension/units arrive as strings from JSON Schema inputs,
 * so they are validated at runtime, not narrowed at compile time.
 */
import { D, Decimal } from './engine.js';

const TABLE: Record<string, Record<string, string>> = {
  length: { mm: '1', cm: '10', m: '1000', km: '1000000', in: '25.4', ft: '304.8', yd: '914.4' },
  mass: { mg: '1', g: '1000', kg: '1000000', t: '1000000000', lb: '453.59237', oz: '28.349523125' },
  pressure: { Pa: '1', kPa: '1000', MPa: '1000000', bar: '100000', psi: '6894.75729', atm: '101325' },
  time: { s: '1', min: '60', h: '3600', day: '86400' }
};

export function convert(
  value: string | number,
  fromUnit: string,
  toUnit: string,
  dimension: string
): Decimal {
  const dim = TABLE[dimension];
  if (!dim) throw new Error(`[unit] Unknown dimension: ${dimension}`);

  const fromFactor = dim[fromUnit];
  const toFactor = dim[toUnit];
  if (fromFactor === undefined) throw new Error(`[unit] Unknown unit: ${fromUnit}`);
  if (toFactor === undefined) throw new Error(`[unit] Unknown unit: ${toUnit}`);

  const base = D(value).times(D(fromFactor));
  return base.div(D(toFactor));
}

export function listUnits(dimension: string): string[] {
  return Object.keys(TABLE[dimension] ?? {});
}
