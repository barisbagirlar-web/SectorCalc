// SectorCalc PRO V2 — Universal Unit Registry
// Every field declares a unitFamily from the exhaustive list below.
// Quick/common units appear first. Engine/base units stay hidden unless user-facing.
// Conversion happens before validation.
// Selected display units are included in the report assumptions.

import type { UnitFamily, UnitOption } from "./proFieldContract";

// ── Unit family → available display units ───────────────────────────────────────

function length(): UnitOption[] {
  return [
    { unit: "m", label: "m" },
    { unit: "ft", label: "ft" },
    { unit: "in", label: "in" },
    { unit: "mm", label: "mm" },
    { unit: "cm", label: "cm" },
    { unit: "km", label: "km" },
    { unit: "yd", label: "yd" },
    { unit: "mile", label: "mi" },
  ];
}

function smallLength(): UnitOption[] {
  return [
    { unit: "mm", label: "mm" },
    { unit: "in", label: "in" },
    { unit: "µm", label: "µm" },
    { unit: "cm", label: "cm" },
    { unit: "m", label: "m" },
  ];
}

function area(): UnitOption[] {
  return [
    { unit: "m²", label: "m²" },
    { unit: "ft²", label: "ft²" },
    { unit: "cm²", label: "cm²" },
    { unit: "in²", label: "in²" },
    { unit: "ha", label: "ha" },
    { unit: "acre", label: "acre" },
  ];
}

function volume(): UnitOption[] {
  return [
    { unit: "m³", label: "m³" },
    { unit: "L", label: "L" },
    { unit: "ft³", label: "ft³" },
    { unit: "gal", label: "gal" },
    { unit: "in³", label: "in³" },
    { unit: "cm³", label: "cm³" },
  ];
}

function mass(): UnitOption[] {
  return [
    { unit: "kg", label: "kg" },
    { unit: "lb", label: "lb" },
    { unit: "g", label: "g" },
    { unit: "t", label: "t" },
    { unit: "oz", label: "oz" },
    { unit: "ton", label: "ton" },
  ];
}

function time(): UnitOption[] {
  return [
    { unit: "min", label: "min" },
    { unit: "h", label: "h" },
    { unit: "sec", label: "s" },
    { unit: "day", label: "day" },
    { unit: "week", label: "week" },
  ];
}

function speed(): UnitOption[] {
  return [
    { unit: "m/s", label: "m/s" },
    { unit: "km/h", label: "km/h" },
    { unit: "mph", label: "mph" },
    { unit: "ft/s", label: "ft/s" },
    { unit: "knot", label: "kn" },
  ];
}

function flow(): UnitOption[] {
  return [
    { unit: "L/min", label: "L/min" },
    { unit: "m³/h", label: "m³/h" },
    { unit: "m³/min", label: "m³/min" },
    { unit: "cfm", label: "cfm" },
    { unit: "gal/min", label: "gpm" },
  ];
}

function pressure(): UnitOption[] {
  return [
    { unit: "bar", label: "bar" },
    { unit: "psi", label: "psi" },
    { unit: "MPa", label: "MPa" },
    { unit: "kPa", label: "kPa" },
    { unit: "Pa", label: "Pa" },
  ];
}

function temperature(): UnitOption[] {
  return [
    { unit: "°C", label: "°C" },
    { unit: "°F", label: "°F" },
    { unit: "K", label: "K" },
  ];
}

function force(): UnitOption[] {
  return [
    { unit: "N", label: "N" },
    { unit: "kN", label: "kN" },
    { unit: "lbf", label: "lbf" },
    { unit: "kgf", label: "kgf" },
  ];
}

function torque(): UnitOption[] {
  return [
    { unit: "N·m", label: "N·m" },
    { unit: "lbf·ft", label: "lbf·ft" },
    { unit: "kN·m", label: "kN·m" },
  ];
}

function power(): UnitOption[] {
  return [
    { unit: "kW", label: "kW" },
    { unit: "W", label: "W" },
    { unit: "hp", label: "hp" },
    { unit: "MW", label: "MW" },
  ];
}

function energy(): UnitOption[] {
  return [
    { unit: "kWh", label: "kWh" },
    { unit: "MWh", label: "MWh" },
    { unit: "MJ", label: "MJ" },
    { unit: "GJ", label: "GJ" },
    { unit: "BTU", label: "BTU" },
  ];
}

function energyPerPeriod(): UnitOption[] {
  return [
    { unit: "kWh/year", label: "kWh/year" },
    { unit: "MWh/year", label: "MWh/year" },
    { unit: "kWh/month", label: "kWh/month" },
    { unit: "GJ/year", label: "GJ/year" },
  ];
}

function energyPrice(): UnitOption[] {
  return [
    { unit: "USD/kWh", label: "USD/kWh" },
    { unit: "EUR/kWh", label: "EUR/kWh" },
    { unit: "GBP/kWh", label: "GBP/kWh" },
    { unit: "USD/MWh", label: "USD/MWh" },
    { unit: "EUR/MWh", label: "EUR/MWh" },
  ];
}

function currency(): UnitOption[] {
  return [
    { unit: "USD", label: "USD" },
    { unit: "EUR", label: "EUR" },
    { unit: "GBP", label: "GBP" },
    { unit: "TRY", label: "TRY" },
    { unit: "CAD", label: "CAD" },
    { unit: "AUD", label: "AUD" },
    { unit: "CHF", label: "CHF" },
    { unit: "JPY", label: "JPY" },
  ];
}

function laborRate(): UnitOption[] {
  return [
    { unit: "USD/h", label: "USD/h" },
    { unit: "USD/min", label: "USD/min" },
    { unit: "USD/day", label: "USD/day" },
    { unit: "EUR/h", label: "EUR/h" },
    { unit: "GBP/h", label: "GBP/h" },
    { unit: "TRY/h", label: "TRY/h" },
  ];
}

function shopRate(): UnitOption[] {
  return [
    { unit: "USD/h", label: "USD/h" },
    { unit: "USD/min", label: "USD/min" },
    { unit: "USD/day", label: "USD/day" },
    { unit: "EUR/h", label: "EUR/h" },
    { unit: "GBP/h", label: "GBP/h" },
    { unit: "TRY/h", label: "TRY/h" },
  ];
}

function costRate(): UnitOption[] {
  return [
    { unit: "USD/min", label: "USD/min" },
    { unit: "USD/h", label: "USD/h" },
    { unit: "EUR/min", label: "EUR/min" },
    { unit: "EUR/h", label: "EUR/h" },
    { unit: "GBP/min", label: "GBP/min" },
    { unit: "GBP/h", label: "GBP/h" },
    { unit: "TRY/min", label: "TRY/min" },
    { unit: "TRY/h", label: "TRY/h" },
  ];
}

function materialCost(): UnitOption[] {
  return [
    { unit: "USD/kg", label: "USD/kg" },
    { unit: "USD/lb", label: "USD/lb" },
    { unit: "EUR/kg", label: "EUR/kg" },
    { unit: "EUR/lb", label: "EUR/lb" },
    { unit: "GBP/kg", label: "GBP/kg" },
    { unit: "TRY/kg", label: "TRY/kg" },
    { unit: "USD/tonne", label: "USD/t" },
    { unit: "USD/g", label: "USD/g" },
  ];
}

function costPerUnit(): UnitOption[] {
  return [
    { unit: "USD/unit", label: "USD/unit" },
    { unit: "EUR/unit", label: "EUR/unit" },
    { unit: "GBP/unit", label: "GBP/unit" },
  ];
}

function percentage(): UnitOption[] {
  return [
    { unit: "%", label: "%" },
    { unit: "factor 0-1", label: "factor" },
    { unit: "basis points", label: "bp" },
    { unit: "ppm", label: "ppm" },
  ];
}

function factor(): UnitOption[] {
  return [
    { unit: "factor 0-1", label: "factor" },
    { unit: "%", label: "%" },
  ];
}

function density(): UnitOption[] {
  return [
    { unit: "kg/m³", label: "kg/m³" },
    { unit: "lb/ft³", label: "lb/ft³" },
    { unit: "g/cm³", label: "g/cm³" },
    { unit: "lb/in³", label: "lb/in³" },
  ];
}

function emissions(): UnitOption[] {
  return [
    { unit: "kg CO₂e", label: "kg CO₂e" },
    { unit: "t CO₂e", label: "t CO₂e" },
    { unit: "lb CO₂e", label: "lb CO₂e" },
    { unit: "kg CO₂e/unit", label: "kg CO₂e/unit" },
  ];
}

function productionRate(): UnitOption[] {
  return [
    { unit: "units/h", label: "units/h" },
    { unit: "units/day", label: "units/day" },
    { unit: "kg/h", label: "kg/h" },
    { unit: "m/h", label: "m/h" },
    { unit: "m/min", label: "m/min" },
  ];
}

function financePeriod(): UnitOption[] {
  return [
    { unit: "year", label: "year" },
    { unit: "month", label: "month" },
    { unit: "quarter", label: "quarter" },
    { unit: "day", label: "day" },
  ];
}

function interestRate(): UnitOption[] {
  return [
    { unit: "%/year", label: "%/year" },
    { unit: "%/month", label: "%/month" },
    { unit: "factor/year", label: "factor/year" },
  ];
}

function marginRate(): UnitOption[] {
  return [
    { unit: "%", label: "%" },
    { unit: "factor 0-1", label: "factor" },
    { unit: "basis points", label: "bp" },
  ];
}

// ── Registry ────────────────────────────────────────────────────────────────────

export const UNIT_REGISTRY: Record<UnitFamily, () => UnitOption[]> = {
  length,
  small_length: smallLength,
  area,
  volume,
  mass,
  time,
  speed,
  flow,
  pressure,
  temperature,
  force,
  torque,
  power,
  energy,
  energy_per_period: energyPerPeriod,
  energy_price: energyPrice,
  currency,
  labor_rate: laborRate,
  shop_rate: shopRate,
  cost_rate: costRate,
  material_cost: materialCost,
  cost_per_unit: costPerUnit,
  percentage,
  factor,
  density,
  emissions,
  production_rate: productionRate,
  finance_period: financePeriod,
  interest_rate: interestRate,
  margin_rate: marginRate,
};

export function getUnitOptions(family: UnitFamily): UnitOption[] {
  const resolver = UNIT_REGISTRY[family];
  if (!resolver) {
    return [{ unit: "unknown", label: "unknown" }];
  }
  return resolver();
}

export function getUnitFamilies(): UnitFamily[] {
  return Object.keys(UNIT_REGISTRY) as UnitFamily[];
}

// ── Conversion helpers ──────────────────────────────────────────────────────────

const LENGTH_TO_MM: Record<string, number> = {
  mm: 1, cm: 10, m: 1000, km: 1_000_000, in: 25.4, ft: 304.8, yd: 914.4, mile: 1_609_344,
};

const MASS_TO_KG: Record<string, number> = {
  g: 0.001, kg: 1, t: 1000, lb: 0.453592, oz: 0.0283495, ton: 907.185,
};

const TIME_TO_MIN: Record<string, number> = {
  sec: 1 / 60, min: 1, h: 60, day: 1440, week: 10080,
};

const PRESSURE_TO_BAR: Record<string, number> = {
  Pa: 0.00001, kPa: 0.01, MPa: 10, bar: 1, psi: 0.0689476,
};

const TEMP_REF = {
  c: { label: "°C", offset: 0, scale: 1 },
  f: { label: "°F", offset: -32, scale: 5 / 9 },
  k: { label: "K", offset: -273.15, scale: 1 },
};

const VOLUME_TO_M3: Record<string, number> = {
  cm3: 0.000001, L: 0.001, m3: 1, in3: 0.0000163871, ft3: 0.0283168, gal: 0.00378541,
};

function getFactorOrThrow(table: Record<string, number>, unit: string, family: string): number {
  const key = unit.toLowerCase().trim();
  const factor = table[key];
  if (factor === undefined) {
    throw new Error(`pro-v2: unknown ${family} unit "${unit}"`);
  }
  return factor;
}

/**
 * Convert a compound unit like "USD/kg" or "EUR/min" by extracting the
 * denominator unit and looking it up in the given conversion table.
 * Example: "USD/lb" → extract "lb" → MASS_TO_KG lookup → 0.453592
 */
function convertCompoundUnit(
  value: number,
  fromUnit: string,
  table: Record<string, number>,
  family: string,
): number {
  const parts = fromUnit.split("/");
  if (parts.length >= 2) {
    // Take the denominator (part after last "/")
    const denominator = parts[parts.length - 1].trim().toLowerCase();
    if (denominator in table) {
      return value * table[denominator];
    }
  }
  // Fallback: try the whole unit
  return value * getFactorOrThrow(table, fromUnit, family);
}

export function convertToEngineUnit(value: number, fromUnit: string, family: UnitFamily): number {
  if (!Number.isFinite(value)) return value;

  switch (family) {
    case "length":
      return value * getFactorOrThrow(LENGTH_TO_MM, fromUnit, "length");
    case "small_length":
      return value * getFactorOrThrow(LENGTH_TO_MM, fromUnit, "small_length");
    case "mass":
      return value * getFactorOrThrow(MASS_TO_KG, fromUnit, "mass");
    case "material_cost":
      // Compound unit like "USD/kg" → extract denominator "kg" → convert to canonical mass
      return convertCompoundUnit(value, fromUnit, MASS_TO_KG, "material_cost");
    case "time":
      return value * getFactorOrThrow(TIME_TO_MIN, fromUnit, "time");
    case "pressure":
      return value * getFactorOrThrow(PRESSURE_TO_BAR, fromUnit, "pressure");
    case "temperature": {
      // Convert to Celsius first
      const key = fromUnit.toLowerCase().trim().replace("°", "");
      const ref = (TEMP_REF as Record<string, { label: string; offset: number; scale: number }>)[key];
      if (!ref) throw new Error(`pro-v2: unknown temperature unit "${fromUnit}"`);
      return (value + ref.offset) * ref.scale;
    }
    case "volume":
      return value * getFactorOrThrow(VOLUME_TO_M3, String(fromUnit).toLowerCase().trim().replace("³", "3"), "volume");
    case "flow":
      return value * getFactorOrThrow(VOLUME_TO_M3, String(fromUnit).toLowerCase().trim().replace("³", "3").replace("/min", "").replace("/h", ""), "flow");
    case "percentage": {
      const pct = fromUnit.toLowerCase().trim();
      if (pct === "%" || pct === "percent") return value;
      if (pct === "factor" || pct === "factor 0-1" || pct === "decimal") return value * 100;
      if (pct === "basis points" || pct === "bp") return value / 100;
      if (pct === "ppm") return value / 10000;
      return value;
    }
    case "factor":
      return value; // factor is dimensionless, kept as-is
    case "cost_rate":
    case "currency":
    case "labor_rate":
    case "shop_rate":
    case "cost_per_unit":
    case "energy_price":
    case "density":
    case "emissions":
    case "production_rate":
    case "finance_period":
    case "interest_rate":
    case "margin_rate":
    case "power":
    case "energy":
    case "energy_per_period":
    case "force":
    case "torque":
    case "speed":
    case "area":
      return value; // these keep engine value as-is (format display only)
    default:
      return value;
  }
}
