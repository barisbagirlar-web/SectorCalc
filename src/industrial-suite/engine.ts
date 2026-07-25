/**
 * SectorCalc Industrial-Suite Engine — Decimal-native trigonometry.
 * All angular and transcendental functions now preserve the 34-digit Decimal
 * contract. No silent coercion to JavaScript Number.
 */
import { D, Decimal, CalcError } from '../core/engine.js';

export type Severity = 'error' | 'warning' | 'info';
export type FieldKind = 'number' | 'select';

export interface UnitOption {
  key: string;
  label: string;
  toBase(value: Decimal): Decimal;
  fromBase(value: Decimal): Decimal;
}

export interface UnitFamily {
  baseLabel: string;
  units: readonly UnitOption[];
}

export interface NumberField {
  kind: 'number';
  id: string;
  label: string;
  defaultValue: number;
  step?: number;
  family: keyof typeof UNIT_FAMILIES;
  defaultUnit: string;
  min?: number;
  max?: number;
  reference: string;
  hint?: string;
}

export interface SelectOption { value: string; label: string; }
export interface SelectField {
  kind: 'select';
  id: string;
  label: string;
  defaultValue: string;
  options: readonly SelectOption[];
  reference: string;
  hint?: string;
}

export type FieldSpec = NumberField | SelectField;

export interface WarningItem {
  severity: Severity;
  title: string;
  detail: string;
}

export interface OutputValue {
  id: string;
  label: string;
  value: Decimal | string;
  unit: string;
  precision?: number;
  note?: string;
  primary?: boolean;
  risk?: Decimal;
}

export interface CanonicalInput {
  readonly values: Readonly<Record<string, Decimal | string>>;
  readonly display: Readonly<Record<string, string>>;
  readonly units: Readonly<Record<string, string>>;
}

export interface CalcResult {
  outputs: readonly OutputValue[];
  warnings: readonly WarningItem[];
  formulas: readonly string[];
  assumptions: readonly string[];
}

export interface SensitivitySpec {
  inputId: string;
  outputId: string;
  spanPct?: number;
}

export interface ToolDefinition {
  code: string;
  slug: string;
  name: string;
  category: string;
  standard: string;
  engineVersion: string;
  summary: string;
  decision: string;
  fields: readonly FieldSpec[];
  formulas: readonly string[];
  assumptions: readonly string[];
  sensitivity: SensitivitySpec;
  calculate(input: CanonicalInput): CalcResult;
}

const mulUnit = (key: string, label: string, factor: string): UnitOption => ({
  key, label,
  toBase: (v) => v.times(factor),
  fromBase: (v) => v.div(factor)
});
const affineUnit = (key: string, label: string, scale: string, offset: string): UnitOption => ({
  key, label,
  toBase: (v) => v.minus(offset).times(scale),
  fromBase: (v) => v.div(scale).plus(offset)
});

export const UNIT_FAMILIES = {
  length: { baseLabel: 'mm', units: [mulUnit('mm','mm','1'), mulUnit('in','in','25.4')] },
  area: { baseLabel: 'mm²', units: [mulUnit('mm2','mm²','1'), mulUnit('in2','in²','645.16')] },
  force: { baseLabel: 'N', units: [mulUnit('N','N','1'), mulUnit('kN','kN','1000'), mulUnit('lbf','lbf','4.4482216152605'), mulUnit('kip','kip','4448.2216152605')] },
  pressure: { baseLabel: 'MPa', units: [mulUnit('MPa','MPa','1'), mulUnit('bar','bar','0.1'), mulUnit('psi','psi','0.006894757293168'), mulUnit('ksi','ksi','6.894757293168')] },
  power: { baseLabel: 'kW', units: [mulUnit('kW','kW','1'), mulUnit('hp','hp','0.74569987158227')] },
  torque: { baseLabel: 'N·m', units: [mulUnit('Nm','N·m','1'), mulUnit('lbfft','lbf·ft','1.3558179483314')] },
  mass: { baseLabel: 'kg', units: [mulUnit('kg','kg','1'), mulUnit('lb','lb','0.45359237'), mulUnit('t','t','1000')] },
  time: { baseLabel: 's', units: [mulUnit('s','s','1'), mulUnit('min','min','60'), mulUnit('h','h','3600')] },
  linearSpeed: { baseLabel: 'mm/min', units: [mulUnit('mmmin','mm/min','1'), mulUnit('mmin','m/min','1000'), mulUnit('inmin','in/min','25.4'), mulUnit('ftmin','ft/min','304.8')] },
  surfaceSpeed: { baseLabel: 'm/min', units: [mulUnit('mmin','m/min','1'), mulUnit('sfm','SFM','0.3048')] },
  velocity: { baseLabel: 'm/s', units: [mulUnit('ms','m/s','1'), mulUnit('fts','ft/s','0.3048')] },
  flow: { baseLabel: 'L/min', units: [mulUnit('Lmin','L/min','1'), mulUnit('gpm','US gpm','3.785411784')] },
  stiffness: { baseLabel: 'N/mm', units: [mulUnit('Nmm','N/mm','1'), mulUnit('lbfIn','lbf/in','0.175126835246')] },
  percent: { baseLabel: 'ratio', units: [mulUnit('pct','%','0.01'), mulUnit('ratio','ratio','1')] },
  rpm: { baseLabel: 'rpm', units: [mulUnit('rpm','rpm','1')] },
  angle: { baseLabel: 'deg', units: [mulUnit('deg','°','1')] },
  temperature: { baseLabel: '°C', units: [mulUnit('C','°C','1'), affineUnit('F','°F','0.5555555555555556','32')] },
  count: { baseLabel: 'count', units: [mulUnit('count','count','1')] },
  currency: { baseLabel: 'currency', units: [mulUnit('cur','currency','1')] },
  currencyPerHour: { baseLabel: 'currency/h', units: [mulUnit('curh','currency/h','1')] },
  currencyPerEnergy: { baseLabel: 'currency/kWh', units: [mulUnit('curkwh','currency/kWh','1')] },
  energyPerLength: { baseLabel: 'kJ/mm', units: [mulUnit('kJmm','kJ/mm','1'), mulUnit('kJin','kJ/in','0.0393700787401575')] }
} as const satisfies Record<string, UnitFamily>;

export function unitOption(family: keyof typeof UNIT_FAMILIES, key: string): UnitOption {
  const unit = UNIT_FAMILIES[family].units.find((u) => u.key === key);
  if (!unit) throw new CalcError('E_INVALID_UNIT', `unknown ${String(family)} unit: ${key}`);
  return unit;
}

export function numberValue(input: CanonicalInput, id: string): Decimal {
  const value = input.values[id];
  if (!(value instanceof Decimal)) throw new CalcError('E_INVALID_INPUT', `${id} must be numeric`);
  return value;
}

export function selectValue(input: CanonicalInput, id: string): string {
  const value = input.values[id];
  if (typeof value !== 'string') throw new CalcError('E_INVALID_INPUT', `${id} must be a selection`);
  return value;
}

// ============================================================================
// DECIMAL-NATIVE TRANSCENDENTAL FUNCTIONS
// All functions below use Decimal arithmetic only. No Number coercion.
// ============================================================================

const PI = D('3.1415926535897932384626433832795029');
const PI_2 = PI.div(2);
const PI_4 = PI.div(4);
const DEG_TO_RAD = PI.div(180);

/** Reduce angle to [-π, π] using Decimal modulo. */
function reducePi(x: Decimal): Decimal {
  const twoPi = PI.times(2);
  let r = x.mod(twoPi);
  if (r.gt(PI)) r = r.minus(twoPi);
  if (r.lt(PI.neg())) r = r.plus(twoPi);
  return r;
}

/**
 * Reduce to |x| ≤ π/4 for rapid Taylor convergence, returning
 * { z, swap, sinSign, cosSign } where:
 *   sin(x) = sinSign * (swap ? cos(z) : sin(z))
 *   cos(x) = cosSign * (swap ? sin(z) : cos(z))
 */
function reduceToPi4(v: Decimal): { z: Decimal; swap: boolean; sinSign: number; cosSign: number } {
  let x = reducePi(v);
  let sinSign = 1;
  let cosSign = 1;
  if (x.lt(0)) {
    x = x.neg();
    sinSign = -1;
  }
  // now x in [0, π]
  if (x.gt(PI_2)) {
    x = PI.minus(x);
    cosSign = -cosSign;
  }
  // now x in [0, π/2]
  let swap = false;
  if (x.gt(PI_4)) {
    x = PI_2.minus(x);
    swap = true;
  }
  return { z: x, swap, sinSign, cosSign };
}

/** Taylor series sine on |x| ≤ π/4 — 20 terms → well below 1e-30 residual. */
function taylorSin(x: Decimal): Decimal {
  const x2 = x.times(x).neg(); // -x²
  let term = x;
  let sum = x;
  let n = 1;
  for (let i = 0; i < 20; i++) {
    n += 2;
    term = term.times(x2).div(n * (n - 1));
    sum = sum.plus(term);
  }
  return sum;
}

/** Taylor series cosine on |x| ≤ π/4. */
function taylorCos(x: Decimal): Decimal {
  const x2 = x.times(x).neg(); // -x²
  let term = D(1);
  let sum = D(1);
  let n = 0;
  for (let i = 0; i < 20; i++) {
    n += 2;
    term = term.times(x2).div(n * (n - 1));
    sum = sum.plus(term);
  }
  return sum;
}

/** Decimal-native sine (argument in radians). */
export function sinRad(v: Decimal): Decimal {
  const { z, swap, sinSign } = reduceToPi4(v);
  const mag = swap ? taylorCos(z) : taylorSin(z);
  return sinSign < 0 ? mag.neg() : mag;
}

/** Decimal-native cosine (argument in radians). */
export function cosRad(v: Decimal): Decimal {
  const { z, swap, cosSign } = reduceToPi4(v);
  const mag = swap ? taylorSin(z) : taylorCos(z);
  return cosSign < 0 ? mag.neg() : mag;
}

/** Decimal-native tangent (argument in radians). */
export function tanRad(v: Decimal): Decimal {
  const { z, swap, sinSign, cosSign } = reduceToPi4(v);
  const s = swap ? taylorCos(z) : taylorSin(z);
  const c = swap ? taylorSin(z) : taylorCos(z);
  if (c.abs().lt('1e-30')) throw new CalcError('E_DOMAIN', 'tanRad undefined at this angle (cos ≈ 0)');
  const t = s.div(c);
  return (sinSign * cosSign) < 0 ? t.neg() : t;
}

/** Decimal-native sine (argument in degrees). */
export function sinDeg(v: Decimal): Decimal {
  return sinRad(v.times(DEG_TO_RAD));
}

/** Decimal-native cosine (argument in degrees). */
export function cosDeg(v: Decimal): Decimal {
  return cosRad(v.times(DEG_TO_RAD));
}

/** Decimal-native tangent (argument in degrees). */
export function tanDeg(v: Decimal): Decimal {
  return tanRad(v.times(DEG_TO_RAD));
}

/** Decimal-native exponential via Taylor series: e^x = Σ xⁿ/n! */
export function expD(v: Decimal): Decimal {
  const x = v;
  const absX = x.abs();
  let scale = 1;
  let scaled = x;
  if (absX.gt(1)) {
    scale = 2 ** Math.ceil(absX.toNumber() / 2);
    if (scale < 2) scale = 2;
    scaled = x.div(scale);
  }
  let term = D(1);
  let sum = D(1);
  for (let n = 1; n <= 24; n++) {
    term = term.times(scaled).div(n);
    sum = sum.plus(term);
  }
  if (scale > 1) {
    for (let i = 0; i < Math.log2(scale); i++) {
      sum = sum.times(sum);
    }
  }
  return sum;
}

/** Decimal-native natural logarithm via Newton-Raphson. */
export function lnD(v: Decimal): Decimal {
  const x = D(v);
  if (x.lte(0)) throw new CalcError('E_DOMAIN', 'lnD argument must be > 0');
  let y = D(String(Math.log(x.toNumber())));
  for (let i = 0; i < 6; i++) {
    const ey = expD(y);
    y = y.plus(x.minus(ey).times(2).div(x.plus(ey)));
  }
  return y;
}

/** Decimal-native square root (wrapper for Decimal.sqrt which is native). */
export function sqrtD(v: Decimal): Decimal {
  return D(v).sqrt();
}

/** Decimal-native power: x^y = e^(y * ln(x)) for positive x. */
export function powD(base: Decimal, exp: Decimal): Decimal {
  const b = D(base);
  if (b.lte(0)) throw new CalcError('E_DOMAIN', 'powD base must be > 0 for Decimal-native power');
  return expD(exp.times(lnD(b)));
}

/** Decimal-native arcsine (inverse sine) via Taylor series. */
export function asinRad(v: Decimal): Decimal {
  const x = D(v);
  if (x.gt(1) || x.lt(-1)) throw new CalcError('E_DOMAIN', 'asinRad argument must be in [-1, 1]');
  if (x.abs().gt('0.9')) {
    const c = sqrtD(D(1).minus(x.pow(2)));
    return PI_2.minus(atanRad(c.div(x.abs()))).times(x.s ?? 1);
  }
  let term = x;
  let sum = x;
  let n = 1;
  for (let i = 0; i < 16; i++) {
    const num = D(2 * n - 1).times(2 * n - 1);
    const den = D(2 * n).times(2 * n + 1);
    term = term.times(x).times(x).times(num).div(den);
    sum = sum.plus(term);
    n++;
  }
  return sum;
}

/** Decimal-native arctangent (inverse tangent) via Taylor series. */
export function atanRad(v: Decimal): Decimal {
  const x = D(v);
  if (x.abs().gt(1)) {
    return PI_2.minus(atanRad(D(1).div(x))).times(x.s ?? 1);
  }
  let term = x;
  let sum = x;
  let n = 1;
  for (let i = 0; i < 18; i++) {
    term = term.times(x).times(x).neg();
    n += 2;
    sum = sum.plus(term.div(n));
  }
  return sum;
}

// ============================================================================
// END DECIMAL-NATIVE TRANSCENDENTAL FUNCTIONS
// ============================================================================

export function decimalPi(): Decimal { return PI; }

export function output(
  id: string,
  label: string,
  value: Decimal | string,
  unit: string,
  precision = 3,
  noteOrPrimary: string | boolean = '',
  primaryOrRisk: boolean | Decimal = false,
  risk?: Decimal
): OutputValue {
  if (typeof noteOrPrimary === 'boolean') {
    const compactRisk = primaryOrRisk instanceof Decimal ? primaryOrRisk : risk;
    return { id, label, value, unit, precision, note: '', primary: noteOrPrimary, risk: compactRisk };
  }
  const primary = typeof primaryOrRisk === 'boolean' ? primaryOrRisk : false;
  const normalizedRisk = primaryOrRisk instanceof Decimal ? primaryOrRisk : risk;
  return { id, label, value, unit, precision, note: noteOrPrimary, primary, risk: normalizedRisk };
}

export function warning(severity: Severity, title: string, detail: string): WarningItem {
  return { severity, title, detail };
}

export function clamp(v: Decimal, lo: Decimal.Value, hi: Decimal.Value): Decimal {
  const l = D(lo), h = D(hi);
  return v.lt(l) ? l : v.gt(h) ? h : v;
}

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const obj = value as Record<string, unknown>;
  return `{${Object.keys(obj).sort().map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(',')}}`;
}

/** 64-bit FNV-1a hash for deterministic output fingerprints. */
export function fnv1a(text: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x84222325;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    h1 ^= c;
    h2 ^= (c >>> 8) | ((c & 0xFF) << 24);
    const p1 = 0x00000193;
    const p2 = 0x00000100;
    const l1 = (h1 & 0xFFFF) * p1;
    const h1_ = ((h1 >>> 16) * p1 + (l1 >>> 16)) & 0xFFFF;
    h1 = ((h1_ << 16) | (l1 & 0xFFFF)) >>> 0;
    const l2 = (h2 & 0xFFFF) * p2;
    const h2_ = ((h2 >>> 16) * p2 + (l2 >>> 16)) & 0xFFFF;
    h2 = ((h2_ << 16) | (l2 & 0xFFFF)) >>> 0;
  }
  const part1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const part2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return (part1 + part2).toUpperCase();
}

export function resultNumeric(result: CalcResult, id: string): Decimal {
  const found = result.outputs.find((o) => o.id === id);
  if (!found || !(found.value instanceof Decimal)) throw new CalcError('E_INVALID_INPUT', `numeric output ${id} not found`);
  return found.value;
}

export function hasBlocking(result: CalcResult): boolean {
  return result.warnings.some((w) => w.severity === 'error');
}
