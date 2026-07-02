/**
 * Canonical unit definitions - ADIM 5 regional unit motor (display + normalization layer).
 */

import type { VariableDimension } from "@/lib/features/formula-governance/calculation-ontology/ontology-types";

export type UnitSystem = "metric" | "imperial";

export type UnitDimension = Extract<
  VariableDimension,
  | "length"
  | "area"
  | "volume"
  | "mass"
  | "time"
  | "temperature"
  | "rate"
  | "currency"
  | "percent"
  | "count"
  | "dimensionless"
>;

export type CanonicalUnitId =
  | "m"
  | "cm"
  | "km"
  | "ft"
  | "in"
  | "mi"
  | "m2"
  | "sqft"
  | "acre"
  | "L"
  | "m3"
  | "gal"
  | "cuft"
  | "kg"
  | "g"
  | "lb"
  | "oz"
  | "C"
  | "F"
  | "hr"
  | "min"
  | "mps"
  | "kph"
  | "mph"
  | "USD"
  | "USD_hr"
  | "percent"
  | "count"
  | "value";

export type CanonicalUnitDefinition = {
  readonly id: CanonicalUnitId;
  readonly symbol: string;
  readonly dimension: UnitDimension;
  readonly system: UnitSystem | "universal";
  readonly aliases: readonly string[];
};

const UNIT_DEFINITIONS: readonly CanonicalUnitDefinition[] = [
  { id: "m", symbol: "m", dimension: "length", system: "metric", aliases: ["meter", "meters", "metre", "metres"] },
  { id: "cm", symbol: "cm", dimension: "length", system: "metric", aliases: ["centimeter", "centimeters"] },
  { id: "km", symbol: "km", dimension: "length", system: "metric", aliases: ["kilometer", "kilometers"] },
  { id: "ft", symbol: "ft", dimension: "length", system: "imperial", aliases: ["foot", "feet"] },
  { id: "in", symbol: "in", dimension: "length", system: "imperial", aliases: ["inch", "inches"] },
  { id: "mi", symbol: "mi", dimension: "length", system: "imperial", aliases: ["mile", "miles"] },
  { id: "m2", symbol: "m²", dimension: "area", system: "metric", aliases: ["m2", "sqm", "sq m", "square meter", "square meters", "square metre"] },
  { id: "sqft", symbol: "sq ft", dimension: "area", system: "imperial", aliases: ["sqft", "sq ft", "ft2", "ft²", "square feet", "square foot"] },
  { id: "acre", symbol: "acre", dimension: "area", system: "imperial", aliases: ["acres"] },
  { id: "L", symbol: "L", dimension: "volume", system: "metric", aliases: ["l", "liter", "liters", "litre", "litres"] },
  { id: "m3", symbol: "m³", dimension: "volume", system: "metric", aliases: ["m3", "cubic meter", "cubic meters", "cubic metre"] },
  { id: "gal", symbol: "gal", dimension: "volume", system: "imperial", aliases: ["gallon", "gallons", "us gal"] },
  { id: "cuft", symbol: "cu ft", dimension: "volume", system: "imperial", aliases: ["cuft", "cu ft", "ft3", "ft³", "cubic feet", "cubic foot"] },
  { id: "kg", symbol: "kg", dimension: "mass", system: "metric", aliases: ["kilogram", "kilograms"] },
  { id: "g", symbol: "g", dimension: "mass", system: "metric", aliases: ["gram", "grams"] },
  { id: "lb", symbol: "lb", dimension: "mass", system: "imperial", aliases: ["lbs", "pound", "pounds"] },
  { id: "oz", symbol: "oz", dimension: "mass", system: "imperial", aliases: ["ounce", "ounces"] },
  { id: "C", symbol: "°C", dimension: "temperature", system: "metric", aliases: ["c", "celsius", "degc", "°c"] },
  { id: "F", symbol: "°F", dimension: "temperature", system: "imperial", aliases: ["f", "fahrenheit", "degf", "°f"] },
  { id: "hr", symbol: "hr", dimension: "time", system: "universal", aliases: ["hour", "hours", "h"] },
  { id: "min", symbol: "min", dimension: "time", system: "universal", aliases: ["minute", "minutes"] },
  { id: "mps", symbol: "m/s", dimension: "rate", system: "metric", aliases: ["mps", "meters per second"] },
  { id: "kph", symbol: "km/h", dimension: "rate", system: "metric", aliases: ["kph", "kmh", "km/h"] },
  { id: "mph", symbol: "mph", dimension: "rate", system: "imperial", aliases: ["miles per hour"] },
  { id: "USD", symbol: "USD", dimension: "currency", system: "universal", aliases: ["usd", "$"] },
  { id: "USD_hr", symbol: "USD/hr", dimension: "currency", system: "universal", aliases: ["usd/hr", "usd per hour"] },
  { id: "percent", symbol: "%", dimension: "percent", system: "universal", aliases: ["pct", "percent"] },
  { id: "count", symbol: "count", dimension: "count", system: "universal", aliases: ["qty", "units", "ea", "each"] },
  { id: "value", symbol: "value", dimension: "dimensionless", system: "universal", aliases: [] },
] as const;

const UNIT_LOOKUP = new Map<string, CanonicalUnitDefinition>();

for (const definition of UNIT_DEFINITIONS) {
  UNIT_LOOKUP.set(definition.id.toLowerCase(), definition);
  UNIT_LOOKUP.set(definition.symbol.toLowerCase(), definition);
  for (const alias of definition.aliases) {
    UNIT_LOOKUP.set(alias.toLowerCase(), definition);
  }
}

export const CANONICAL_UNIT_DEFINITIONS: readonly CanonicalUnitDefinition[] = UNIT_DEFINITIONS;

export function getCanonicalUnitDefinition(unitId: CanonicalUnitId): CanonicalUnitDefinition {
  const definition = UNIT_DEFINITIONS.find((entry) => entry.id === unitId);
  if (!definition) {
    throw new Error(`Unknown canonical unit: ${unitId}`);
  }
  return definition;
}

export function lookupCanonicalUnit(rawUnit: string | undefined): CanonicalUnitDefinition | null {
  if (!rawUnit) {
    return null;
  }
  const normalized = rawUnit.trim().toLowerCase().replace(/\s+/g, " ");
  return UNIT_LOOKUP.get(normalized) ?? null;
}

export function getCanonicalUnitsForDimension(dimension: UnitDimension): readonly CanonicalUnitDefinition[] {
  return UNIT_DEFINITIONS.filter((definition) => definition.dimension === dimension);
}

export function getPreferredCanonicalUnit(
  dimension: UnitDimension,
  system: UnitSystem,
): CanonicalUnitId | null {
  const preferred: Partial<Record<UnitDimension, Record<UnitSystem, CanonicalUnitId>>> = {
    length: { metric: "m", imperial: "ft" },
    area: { metric: "m2", imperial: "sqft" },
    volume: { metric: "L", imperial: "gal" },
    mass: { metric: "kg", imperial: "lb" },
    temperature: { metric: "C", imperial: "F" },
    rate: { metric: "kph", imperial: "mph" },
  };

  return preferred[dimension]?.[system] ?? null;
}
