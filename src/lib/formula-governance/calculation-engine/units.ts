/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UNIT REGISTRY
 * ───────────────────────────────────────────────────────────────────────────
 * Catches the dangerous, real-world failure mode: a value entered in the wrong
 * unit (mm vs m, kN vs N). Each input declares the unit it is ENTERED in; the
 * engine converts to the formula's CANONICAL unit before computing.
 *
 * Source: claude_pro_tasarim_/engine-units.ts (verified engine design)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface UnitDef {
  toCanonical: number;
  canonical: string;
  offset?: number;
}

export const UNIT_REGISTRY: Record<string, UnitDef> = {
  // length — canonical mm
  mm: { toCanonical: 1, canonical: 'mm' },
  cm: { toCanonical: 10, canonical: 'mm' },
  m: { toCanonical: 1000, canonical: 'mm' },

  // area — canonical mm²
  'mm2': { toCanonical: 1, canonical: 'mm2' },
  'cm2': { toCanonical: 100, canonical: 'mm2' },
  'm2': { toCanonical: 1e6, canonical: 'mm2' },

  // stress — canonical MPa
  MPa: { toCanonical: 1, canonical: 'MPa' },
  kPa: { toCanonical: 1e-3, canonical: 'MPa' },
  Pa: { toCanonical: 1e-6, canonical: 'MPa' },
  GPa: { toCanonical: 1e3, canonical: 'MPa' },

  // force — canonical kN
  kN: { toCanonical: 1, canonical: 'kN' },
  N: { toCanonical: 1e-3, canonical: 'kN' },
  MN: { toCanonical: 1e3, canonical: 'kN' },

  // moment — canonical kN·m
  'kNm': { toCanonical: 1, canonical: 'kNm' },
  'Nm': { toCanonical: 1e-3, canonical: 'kNm' },

  // dimensionless / angle
  '-': { toCanonical: 1, canonical: '-' },
  deg: { toCanonical: Math.PI / 180, canonical: 'rad' },
  rad: { toCanonical: 1, canonical: 'rad' },

  // pressure
  bar: { toCanonical: 0.1, canonical: 'MPa' },
  psi: { toCanonical: 0.00689476, canonical: 'MPa' },

  // energy / power
  kW: { toCanonical: 1, canonical: 'kW' },
  W: { toCanonical: 1e-3, canonical: 'kW' },
  MW: { toCanonical: 1e3, canonical: 'kW' },
  kWh: { toCanonical: 1, canonical: 'kWh' },
  kJ: { toCanonical: 1, canonical: 'kJ' },
  J: { toCanonical: 1e-3, canonical: 'kJ' },

  // time
  h: { toCanonical: 1, canonical: 'h' },
  s: { toCanonical: 1 / 3600, canonical: 'h' },
  min: { toCanonical: 1 / 60, canonical: 'h' },
  day: { toCanonical: 24, canonical: 'h' },

  // velocity
  'm/s': { toCanonical: 1, canonical: 'm/s' },
  'm_min': { toCanonical: 1 / 60, canonical: 'm/s' },

  // percentage
  '%': { toCanonical: 0.01, canonical: '-' },

  // specific energy
  'kJ/mm': { toCanonical: 1, canonical: 'kJ/mm' },
  'kJ_kg': { toCanonical: 1, canonical: 'kJ/kg' },

  // misc engineering
  ml_100g: { toCanonical: 1, canonical: 'ml/100g' }, // H_d hydrogen
  mm_rev: { toCanonical: 1, canonical: 'mm/rev' },
  mm_min: { toCanonical: 1, canonical: 'mm/min' },
  rpm: { toCanonical: 1, canonical: 'rpm' },
  'kn': { toCanonical: 1, canonical: 'kN' },
  'knm': { toCanonical: 1, canonical: 'kNm' },
  'kn_m3': { toCanonical: 1, canonical: 'kN/m3' },
  'kg_m3': { toCanonical: 1, canonical: 'kg/m3' },
  'w_m2k': { toCanonical: 1, canonical: 'W/(m²·K)' },
  'usd': { toCanonical: 1, canonical: 'USD' },
  'usd_kwh': { toCanonical: 1, canonical: 'USD/kWh' },
  'usd_kw': { toCanonical: 1, canonical: 'USD/kW' },
};

export function toCanonical(value: number, unit: string): number {
  if (!unit || unit === '') return value; // dimensionless / no conversion
  const def = UNIT_REGISTRY[unit];
  if (!def) return value; // unknown unit — pass through (warn emitted in engine)
  return value * def.toCanonical + (def.offset ?? 0);
}

export function canonicalUnitOf(unit: string): string {
  if (!unit || unit === '') return '-';
  const def = UNIT_REGISTRY[unit];
  if (!def) return unit; // unknown — return as-is
  return def.canonical;
}
