/**
 * FS-ENGINE - deterministic SI machining core.
 * Version 2.1.0. All math in SI; display units convert at entry with exact factors.
 * Currency selector is a symbol only - no FX conversion.
 */
import { D, Decimal, CalcError } from './engine.js';

export const FS_ENGINE_VERSION = '2.1.0';
export const FS_ENGINE_BUILD_DATE = '2026-07-24';
export const FS_ENGINE_ID = `FS-ENGINE-v${FS_ENGINE_VERSION}`;

/** Exact conversion factors (display → SI). */
export const FS_FACTORS = {
  IN_TO_MM: D('25.4'),
  SFM_TO_M_PER_MIN: D('0.3048'),
  HP_TO_KW: D('0.7457'),
  FT_LB_TO_NM: D('1.3558'),
  MM_TO_IN: D(1).div(D('25.4')),
  M_PER_MIN_TO_SFM: D(1).div(D('0.3048')),
  KW_TO_HP: D(1).div(D('0.7457')),
  NM_TO_FT_LB: D(1).div(D('1.3558'))
} as const;

export type LengthUnit = 'mm' | 'in';
export type SpeedUnit = 'm/min' | 'SFM';
export type PowerUnit = 'kW' | 'HP';
export type TorqueUnit = 'N·m' | 'ft·lb';
export type FeedUnit = 'mm' | 'in';
export type CurrencySymbol = '$' | '€' | '£' | '₺' | '¥';

export function lengthToMm(value: Decimal.Value, unit: LengthUnit, label = 'length'): Decimal {
  const v = D(value, label);
  return unit === 'in' ? v.times(FS_FACTORS.IN_TO_MM) : v;
}

export function mmToDisplay(mm: Decimal.Value, unit: LengthUnit): Decimal {
  const v = D(mm, 'mm');
  return unit === 'in' ? v.times(FS_FACTORS.MM_TO_IN) : v;
}

export function speedToMPerMin(value: Decimal.Value, unit: SpeedUnit, label = 'Vc'): Decimal {
  const v = D(value, label);
  return unit === 'SFM' ? v.times(FS_FACTORS.SFM_TO_M_PER_MIN) : v;
}

export function mPerMinToDisplay(mPerMin: Decimal.Value, unit: SpeedUnit): Decimal {
  const v = D(mPerMin, 'm/min');
  return unit === 'SFM' ? v.times(FS_FACTORS.M_PER_MIN_TO_SFM) : v;
}

export function powerToKw(value: Decimal.Value, unit: PowerUnit, label = 'power'): Decimal {
  const v = D(value, label);
  return unit === 'HP' ? v.times(FS_FACTORS.HP_TO_KW) : v;
}

export function kwToDisplay(kw: Decimal.Value, unit: PowerUnit): Decimal {
  const v = D(kw, 'kW');
  return unit === 'HP' ? v.times(FS_FACTORS.KW_TO_HP) : v;
}

export function torqueToNm(value: Decimal.Value, unit: TorqueUnit, label = 'torque'): Decimal {
  const v = D(value, label);
  return unit === 'ft·lb' ? v.times(FS_FACTORS.FT_LB_TO_NM) : v;
}

export function nmToDisplay(nm: Decimal.Value, unit: TorqueUnit): Decimal {
  const v = D(nm, 'N·m');
  return unit === 'ft·lb' ? v.times(FS_FACTORS.NM_TO_FT_LB) : v;
}

export function feedToMm(value: Decimal.Value, unit: FeedUnit, label = 'feed'): Decimal {
  return lengthToMm(value, unit, label);
}

/** FNV-1a 32-bit over a canonical JSON string - deterministic integrity stamp. */
export function fnv1aHex(payload: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

export function integrityHash(parts: Record<string, string | number | boolean | null>): string {
  const keys = Object.keys(parts).sort();
  const canonical = keys.map((k) => `${k}=${String(parts[k])}`).join('|');
  return fnv1aHex(canonical);
}

export function assertFiniteDecimal(d: Decimal, label: string): Decimal {
  if (!d.isFinite()) throw new CalcError('E_INVALID_INPUT', `${label} is non-finite`);
  return d;
}
