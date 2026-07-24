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

export function decimalPi(): Decimal { return D(String(Math.PI)); }
export function sinDeg(v: Decimal): Decimal { return D(String(Math.sin(v.toNumber() * Math.PI / 180))); }
export function cosDeg(v: Decimal): Decimal { return D(String(Math.cos(v.toNumber() * Math.PI / 180))); }
export function tanDeg(v: Decimal): Decimal { return D(String(Math.tan(v.toNumber() * Math.PI / 180))); }
export function expD(v: Decimal): Decimal { return D(String(Math.exp(v.toNumber()))); }

export function output(id: string, label: string, value: Decimal | string, unit: string, precision = 3, note = '', primary = false, risk?: Decimal): OutputValue {
  return { id, label, value, unit, precision, note, primary, risk };
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

export function fnv1a(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0').toUpperCase();
}

export function resultNumeric(result: CalcResult, id: string): Decimal {
  const found = result.outputs.find((o) => o.id === id);
  if (!found || !(found.value instanceof Decimal)) throw new CalcError('E_INVALID_INPUT', `numeric output ${id} not found`);
  return found.value;
}

export function hasBlocking(result: CalcResult): boolean {
  return result.warnings.some((w) => w.severity === 'error');
}
