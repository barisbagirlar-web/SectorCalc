/**
 * P5 — Regional Unit Engine (display + conversion layer).
 *
 * Self-contained factor-to-base converter for metric / imperial / regional
 * display. This engine is intentionally decoupled from the live calculation
 * pipeline: it powers the unit selector, conversion trace and regional display
 * surfaces ONLY. It never mutates formula inputs at runtime.
 *
 * Currency is display-only — no FX rates are produced or applied.
 */

export type MeasurementSystem = "metric" | "imperial" | "mixed";

export type SupportedRegion =
  | "global"
  | "us"
  | "uk"
  | "eu"
  | "tr"
  | "mena"
  | "latam";

export type UnitDimension =
  | "length"
  | "area"
  | "volume"
  | "weight"
  | "temperature"
  | "speed"
  | "energy"
  | "power"
  | "currency"
  | "time"
  | "percentage"
  | "count";

export type UnitDefinition = {
  readonly id: string;
  readonly label: string;
  readonly symbol: string;
  readonly dimension: UnitDimension;
  readonly system: MeasurementSystem;
  /** Canonical (base) unit id for this dimension. */
  readonly canonicalUnitId: string;
  /** base = value * toBaseFactor + toBaseOffset. Undefined ⇒ display-only (no conversion). */
  readonly toBaseFactor?: number;
  readonly toBaseOffset?: number;
};

export type RegionalUnitProfile = {
  readonly region: SupportedRegion;
  readonly defaultSystem: MeasurementSystem;
  readonly defaultUnits: Partial<Record<UnitDimension, string>>;
};

export type ConversionTraceEntry = {
  readonly field: string;
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly originalValue: number;
  readonly normalizedValue: number;
};

const DEFINITIONS: readonly UnitDefinition[] = [
  // length — base m
  { id: "mm", label: "Millimeter", symbol: "mm", dimension: "length", system: "metric", canonicalUnitId: "m", toBaseFactor: 0.001 },
  { id: "cm", label: "Centimeter", symbol: "cm", dimension: "length", system: "metric", canonicalUnitId: "m", toBaseFactor: 0.01 },
  { id: "m", label: "Meter", symbol: "m", dimension: "length", system: "metric", canonicalUnitId: "m", toBaseFactor: 1 },
  { id: "km", label: "Kilometer", symbol: "km", dimension: "length", system: "metric", canonicalUnitId: "m", toBaseFactor: 1000 },
  { id: "in", label: "Inch", symbol: "in", dimension: "length", system: "imperial", canonicalUnitId: "m", toBaseFactor: 0.0254 },
  { id: "ft", label: "Foot", symbol: "ft", dimension: "length", system: "imperial", canonicalUnitId: "m", toBaseFactor: 0.3048 },
  { id: "yd", label: "Yard", symbol: "yd", dimension: "length", system: "imperial", canonicalUnitId: "m", toBaseFactor: 0.9144 },
  { id: "mi", label: "Mile", symbol: "mi", dimension: "length", system: "imperial", canonicalUnitId: "m", toBaseFactor: 1609.344 },

  // area — base m2
  { id: "m2", label: "Square meter", symbol: "m²", dimension: "area", system: "metric", canonicalUnitId: "m2", toBaseFactor: 1 },
  { id: "km2", label: "Square kilometer", symbol: "km²", dimension: "area", system: "metric", canonicalUnitId: "m2", toBaseFactor: 1_000_000 },
  { id: "hectare", label: "Hectare", symbol: "ha", dimension: "area", system: "metric", canonicalUnitId: "m2", toBaseFactor: 10_000 },
  { id: "ft2", label: "Square foot", symbol: "ft²", dimension: "area", system: "imperial", canonicalUnitId: "m2", toBaseFactor: 0.09290304 },
  { id: "yd2", label: "Square yard", symbol: "yd²", dimension: "area", system: "imperial", canonicalUnitId: "m2", toBaseFactor: 0.83612736 },
  { id: "acre", label: "Acre", symbol: "acre", dimension: "area", system: "imperial", canonicalUnitId: "m2", toBaseFactor: 4046.8564224 },

  // volume — base L
  { id: "ml", label: "Milliliter", symbol: "mL", dimension: "volume", system: "metric", canonicalUnitId: "l", toBaseFactor: 0.001 },
  { id: "l", label: "Liter", symbol: "L", dimension: "volume", system: "metric", canonicalUnitId: "l", toBaseFactor: 1 },
  { id: "m3", label: "Cubic meter", symbol: "m³", dimension: "volume", system: "metric", canonicalUnitId: "l", toBaseFactor: 1000 },
  { id: "gal_us", label: "Gallon (US)", symbol: "gal", dimension: "volume", system: "imperial", canonicalUnitId: "l", toBaseFactor: 3.785411784 },
  { id: "gal_uk", label: "Gallon (UK)", symbol: "gal (UK)", dimension: "volume", system: "imperial", canonicalUnitId: "l", toBaseFactor: 4.54609 },
  { id: "ft3", label: "Cubic foot", symbol: "ft³", dimension: "volume", system: "imperial", canonicalUnitId: "l", toBaseFactor: 28.316846592 },

  // weight — base kg
  { id: "g", label: "Gram", symbol: "g", dimension: "weight", system: "metric", canonicalUnitId: "kg", toBaseFactor: 0.001 },
  { id: "kg", label: "Kilogram", symbol: "kg", dimension: "weight", system: "metric", canonicalUnitId: "kg", toBaseFactor: 1 },
  { id: "tonne", label: "Tonne", symbol: "t", dimension: "weight", system: "metric", canonicalUnitId: "kg", toBaseFactor: 1000 },
  { id: "oz", label: "Ounce", symbol: "oz", dimension: "weight", system: "imperial", canonicalUnitId: "kg", toBaseFactor: 0.028349523125 },
  { id: "lb", label: "Pound", symbol: "lb", dimension: "weight", system: "imperial", canonicalUnitId: "kg", toBaseFactor: 0.45359237 },
  { id: "ton_us", label: "Ton (US)", symbol: "ton (US)", dimension: "weight", system: "imperial", canonicalUnitId: "kg", toBaseFactor: 907.18474 },

  // temperature — base celsius (affine)
  { id: "celsius", label: "Celsius", symbol: "°C", dimension: "temperature", system: "metric", canonicalUnitId: "celsius", toBaseFactor: 1, toBaseOffset: 0 },
  { id: "fahrenheit", label: "Fahrenheit", symbol: "°F", dimension: "temperature", system: "imperial", canonicalUnitId: "celsius", toBaseFactor: 5 / 9, toBaseOffset: -160 / 9 },

  // speed — base m/s
  { id: "ms", label: "Meters per second", symbol: "m/s", dimension: "speed", system: "metric", canonicalUnitId: "ms", toBaseFactor: 1 },
  { id: "kmh", label: "Kilometers per hour", symbol: "km/h", dimension: "speed", system: "metric", canonicalUnitId: "ms", toBaseFactor: 1 / 3.6 },
  { id: "mph", label: "Miles per hour", symbol: "mph", dimension: "speed", system: "imperial", canonicalUnitId: "ms", toBaseFactor: 0.44704 },

  // energy — base kWh
  { id: "kwh", label: "Kilowatt-hour", symbol: "kWh", dimension: "energy", system: "metric", canonicalUnitId: "kwh", toBaseFactor: 1 },
  { id: "mj", label: "Megajoule", symbol: "MJ", dimension: "energy", system: "metric", canonicalUnitId: "kwh", toBaseFactor: 1 / 3.6 },
  { id: "btu", label: "British thermal unit", symbol: "BTU", dimension: "energy", system: "imperial", canonicalUnitId: "kwh", toBaseFactor: 0.00029307107 },

  // power — base kW
  { id: "kw", label: "Kilowatt", symbol: "kW", dimension: "power", system: "metric", canonicalUnitId: "kw", toBaseFactor: 1 },
  { id: "hp", label: "Horsepower", symbol: "hp", dimension: "power", system: "imperial", canonicalUnitId: "kw", toBaseFactor: 0.745699872 },
  { id: "btu_h", label: "BTU per hour", symbol: "BTU/h", dimension: "power", system: "imperial", canonicalUnitId: "kw", toBaseFactor: 0.00029307107 },

  // time — base hour
  { id: "minute", label: "Minute", symbol: "min", dimension: "time", system: "mixed", canonicalUnitId: "hour", toBaseFactor: 1 / 60 },
  { id: "hour", label: "Hour", symbol: "h", dimension: "time", system: "mixed", canonicalUnitId: "hour", toBaseFactor: 1 },
  { id: "day", label: "Day", symbol: "day", dimension: "time", system: "mixed", canonicalUnitId: "hour", toBaseFactor: 24 },

  // currency — display only (no FX, no conversion)
  { id: "usd", label: "US Dollar", symbol: "USD", dimension: "currency", system: "mixed", canonicalUnitId: "usd" },
  { id: "eur", label: "Euro", symbol: "EUR", dimension: "currency", system: "mixed", canonicalUnitId: "eur" },
  { id: "gbp", label: "British Pound", symbol: "GBP", dimension: "currency", system: "mixed", canonicalUnitId: "gbp" },

  // percentage / count — display only
  { id: "percent", label: "Percent", symbol: "%", dimension: "percentage", system: "mixed", canonicalUnitId: "percent", toBaseFactor: 1 },
  { id: "unit", label: "Unit", symbol: "", dimension: "count", system: "mixed", canonicalUnitId: "unit", toBaseFactor: 1 },
];

const REGISTRY = new Map<string, UnitDefinition>(DEFINITIONS.map((def) => [def.id, def]));

export const REGIONAL_UNIT_PROFILES: Readonly<Record<SupportedRegion, RegionalUnitProfile>> = {
  global: { region: "global", defaultSystem: "metric", defaultUnits: { length: "m", area: "m2", volume: "l", weight: "kg", temperature: "celsius", speed: "kmh", energy: "kwh", power: "kw", currency: "usd", time: "hour" } },
  us: { region: "us", defaultSystem: "imperial", defaultUnits: { length: "ft", area: "ft2", volume: "gal_us", weight: "lb", temperature: "fahrenheit", speed: "mph", energy: "btu", power: "hp", currency: "usd", time: "hour" } },
  uk: { region: "uk", defaultSystem: "mixed", defaultUnits: { length: "m", area: "m2", volume: "gal_uk", weight: "kg", temperature: "celsius", speed: "mph", energy: "kwh", power: "kw", currency: "gbp", time: "hour" } },
  eu: { region: "eu", defaultSystem: "metric", defaultUnits: { length: "m", area: "m2", volume: "l", weight: "kg", temperature: "celsius", speed: "kmh", energy: "kwh", power: "kw", currency: "eur", time: "hour" } },
  tr: { region: "tr", defaultSystem: "metric", defaultUnits: { length: "m", area: "m2", volume: "l", weight: "kg", temperature: "celsius", speed: "kmh", energy: "kwh", power: "kw", currency: "try", time: "hour" } },
  mena: { region: "mena", defaultSystem: "metric", defaultUnits: { length: "m", area: "m2", volume: "l", weight: "kg", temperature: "celsius", speed: "kmh", energy: "kwh", power: "kw", currency: "usd", time: "hour" } },
  latam: { region: "latam", defaultSystem: "metric", defaultUnits: { length: "m", area: "m2", volume: "l", weight: "kg", temperature: "celsius", speed: "kmh", energy: "kwh", power: "kw", currency: "usd", time: "hour" } },
};

const LOCALE_REGION: Readonly<Record<string, SupportedRegion>> = {
  en: "global",
  tr: "tr",
  de: "eu",
  fr: "eu",
  es: "eu",
  ar: "mena",
};

export function getUnitDefinition(unitId: string): UnitDefinition | null {
  return REGISTRY.get(unitId) ?? null;
}

export function listUnitsForDimension(dimension: UnitDimension): readonly UnitDefinition[] {
  return DEFINITIONS.filter((def) => def.dimension === dimension);
}

export function getCanonicalUnit(unitId: string): string {
  const def = REGISTRY.get(unitId);
  if (!def) {
    throw new Error(`Unknown unit: ${unitId}`);
  }
  return def.canonicalUnitId;
}

export function canConvert(fromUnitId: string, toUnitId: string): boolean {
  const from = REGISTRY.get(fromUnitId);
  const to = REGISTRY.get(toUnitId);
  if (!from || !to) {
    return false;
  }
  if (from.dimension !== to.dimension) {
    return false;
  }
  return from.toBaseFactor !== undefined && to.toBaseFactor !== undefined;
}

function roundDeterministic(value: number): number {
  return Number(value.toFixed(10));
}

export function convertUnit(value: number, fromUnitId: string, toUnitId: string): number {
  if (!Number.isFinite(value)) {
    throw new Error(`Non-finite value for conversion: ${value}`);
  }
  const from = REGISTRY.get(fromUnitId);
  const to = REGISTRY.get(toUnitId);
  if (!from) {
    throw new Error(`Unknown source unit: ${fromUnitId}`);
  }
  if (!to) {
    throw new Error(`Unknown target unit: ${toUnitId}`);
  }
  if (fromUnitId === toUnitId) {
    return value;
  }
  if (from.dimension !== to.dimension) {
    throw new Error(`Incompatible dimensions: ${from.dimension} → ${to.dimension}`);
  }
  if (from.toBaseFactor === undefined || to.toBaseFactor === undefined) {
    throw new Error(`Units are display-only and not convertible: ${fromUnitId} → ${toUnitId}`);
  }

  const base = value * from.toBaseFactor + (from.toBaseOffset ?? 0);
  const result = (base - (to.toBaseOffset ?? 0)) / to.toBaseFactor;
  return roundDeterministic(result);
}

/**
 * Normalize a record of inputs to their canonical (base) units.
 * Only number values referenced in `unitMap` are converted; everything else is
 * passed through untouched. Produces a conversion trace for display / Trust Trace.
 */
export function normalizeInputUnits(
  input: Record<string, unknown>,
  unitMap: Record<string, string>,
): {
  readonly normalizedInput: Record<string, unknown>;
  readonly conversionTrace: readonly ConversionTraceEntry[];
} {
  const normalizedInput: Record<string, unknown> = { ...input };
  const conversionTrace: ConversionTraceEntry[] = [];

  for (const [field, fromUnit] of Object.entries(unitMap)) {
    const rawValue = input[field];
    if (typeof rawValue !== "number" || !Number.isFinite(rawValue)) {
      continue;
    }
    const def = REGISTRY.get(fromUnit);
    if (!def || def.toBaseFactor === undefined) {
      continue;
    }
    const toUnit = def.canonicalUnitId;
    if (toUnit === fromUnit) {
      continue;
    }
    const normalizedValue = convertUnit(rawValue, fromUnit, toUnit);
    normalizedInput[field] = normalizedValue;
    conversionTrace.push({ field, fromUnit, toUnit, originalValue: rawValue, normalizedValue });
  }

  return { normalizedInput, conversionTrace };
}

export function formatUnit(value: number, unitId: string, locale = "en"): string {
  const def = REGISTRY.get(unitId);
  const formatted = new Intl.NumberFormat(locale, { maximumFractionDigits: 4 }).format(value);
  if (!def || def.symbol === "") {
    return formatted;
  }
  return def.dimension === "temperature" ? `${formatted}${def.symbol}` : `${formatted} ${def.symbol}`;
}

export function resolveRegionForLocale(locale: string): SupportedRegion {
  return LOCALE_REGION[locale.toLowerCase().split("-")[0]] ?? "global";
}

export function getRegionalUnitProfile(region: SupportedRegion): RegionalUnitProfile {
  return REGIONAL_UNIT_PROFILES[region];
}

export function getDefaultUnitForDimension(
  region: SupportedRegion,
  dimension: UnitDimension,
): string | null {
  return REGIONAL_UNIT_PROFILES[region].defaultUnits[dimension] ?? null;
}
