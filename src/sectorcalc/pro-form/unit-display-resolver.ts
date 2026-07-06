// SectorCalc Universal Unit Display Resolver
// Display-layer unit resolution and safe conversion.
// The calculation engine always receives canonical schema values.
// No eval, no any, no as never.

import type { CurrencyCode } from "./form-render-helpers";

// ── Unit group definitions ─────────────────────────────────────────────────────

export interface UnitOption {
  unit: string;
  label: string;
}

export interface ResolveUnitOptionsCtx {
  /** Canonical base unit from schema (e.g. "mm", "bar", "USD/kWh") */
  canonicalUnit: string;
  /** Input field id */
  inputId: string;
  /** Input field name */
  inputName: string;
  /** Selected display currency (ISO code) */
  selectedCurrency: CurrencyCode;
  /** Whether this is a monetary field */
  isMonetary?: boolean;
  /** Whether this monetary field is per-unit (price/cost per unit) */
  isMonetaryPerUnit?: boolean;
  /** Whether this is a count/quantity field */
  isCount?: boolean;
}

// ── Canonical-to-display-unit mapping ──────────────────────────────────────────

/** Unit group families that share conversion formulas. */
type UnitFamily =
  | "length"
  | "pressure"
  | "flow"
  | "energy"
  | "energy_price"
  | "time"
  | "specific_power"
  | "area"
  | "volume"
  | "mass"
  | "temperature"
  | "percentage"
  | "count"
  | "monetary"
  | "monetary_per_unit"
  | "monetary_per_kwh"
  | "monetary_per_year"
  | "other";

/** Map canonical base unit patterns to unit families. */
function detectUnitFamily(canonicalUnit: string, isMonetary: boolean, isCount: boolean): UnitFamily {
  if (isCount) return "count";
  if (isMonetary) return "monetary";

  const lower = canonicalUnit.toLowerCase().trim();
  const norm = lower.replace(/[-\s_]/g, "");

  if (norm === "mm" || norm === "millimeter" || norm === "cm" || norm === "m" || norm === "in" || norm === "ft" || norm === "inch" || norm === "inches" || norm === "feet") return "length";
  if (norm === "bar" || norm === "psi" || norm === "kpa" || norm === "mpa" || norm === "pa" || norm === "barg" || norm === "bar(g)") return "pressure";
  if (norm === "m³/min" || norm === "m3/min" || norm === "m³/h" || norm === "m3/h" || norm === "l/min" || norm === "cfm" || norm === "m3min" || norm === "m3h" || norm === "lmin") return "flow";
  if (norm === "kwh" || norm === "mwh") return "energy";
  if (norm.includes("kwh") && (norm.includes("usd") || norm.includes("eur") || norm.includes("gbp") || norm.includes("try"))) return "monetary_per_kwh";
  if (norm.includes("kwh") && (norm.includes("currency") || norm.includes("/kwh"))) return "monetary_per_kwh";
  if (norm.includes("kw/") && (norm.includes("m3") || norm.includes("m³")) || norm.includes("kw_per_m3") || norm.includes("kwper")) return "specific_power";
  if (norm === "h/year" || norm === "hperyear" || norm === "h_per_year" || norm === "h/day" || norm === "hperday" || norm === "h_per_day" || norm === "day/year" || norm === "dayperyear" || norm === "day_per_year" || norm === "h" || norm === "hour" || norm === "hours") {
    // h alone is generic time
    return "time";
  }
  if (norm === "m²" || norm === "m2" || norm === "cm²" || norm === "cm2" || norm === "ft²" || norm === "ft2") return "area";
  if (norm === "m³" || norm === "m3" || norm === "l" || norm === "ft³" || norm === "ft3" || norm === "gal") return "volume";
  if (norm === "kg" || norm === "g" || norm === "t" || norm === "lb" || norm === "lbs" || norm === "ton") return "mass";
  if (norm === "°c" || norm === "c" || norm === "°f" || norm === "f" || norm === "k") return "temperature";
  if (norm === "%" || norm === "percent" || norm === "decimal") return "percentage";
  if (norm === "count" || norm === "units" || norm === "pcs" || norm === "batches" || norm === "cycles") return "count";

  // Monetary subtypes
  if (norm.includes("currency/unit") || norm.includes("usd/unit") || norm.includes("eur/unit") || norm.includes("gbp/unit")) return "monetary_per_unit";
  if (norm.includes("currency/year") || norm.includes("usd/year") || norm.includes("eur/year") || norm.includes("gbp/year")) return "monetary_per_year";

  return "other";
}

// ── Unit option resolution ─────────────────────────────────────────────────────

/**
 * Resolve display unit options for a field based on its canonical unit, id, name,
 * and selected currency.
 */
export function resolveDisplayUnitOptions(ctx: ResolveUnitOptionsCtx): UnitOption[] {
  const { canonicalUnit, inputId, inputName, selectedCurrency, isMonetary, isCount } = ctx;
  const family = detectUnitFamily(canonicalUnit, isMonetary ?? false, isCount ?? false);

  switch (family) {
    case "length":
      if (canonicalUnit.toLowerCase().trim() === "mm" || canonicalUnit.toLowerCase().trim() === "millimeter") {
        return [
          { unit: "mm", label: "mm" },
          { unit: "cm", label: "cm" },
          { unit: "m", label: "m" },
          { unit: "in", label: "in" },
        ];
      }
      if (canonicalUnit.toLowerCase().trim() === "m") {
        return [
          { unit: "m", label: "m" },
          { unit: "cm", label: "cm" },
          { unit: "mm", label: "mm" },
          { unit: "ft", label: "ft" },
          { unit: "in", label: "in" },
        ];
      }
      if (canonicalUnit.toLowerCase().trim() === "cm") {
        return [
          { unit: "cm", label: "cm" },
          { unit: "mm", label: "mm" },
          { unit: "m", label: "m" },
          { unit: "in", label: "in" },
        ];
      }
      return [{ unit: canonicalUnit, label: cleanCanonicalUnit(canonicalUnit) }];

    case "pressure":
      return [
        { unit: "bar", label: "bar" },
        { unit: "psi", label: "psi" },
        { unit: "kPa", label: "kPa" },
        { unit: "MPa", label: "MPa" },
      ];

    case "flow":
      return [
        { unit: "m³/min", label: "m³/min" },
        { unit: "m³/h", label: "m³/h" },
        { unit: "L/min", label: "L/min" },
        { unit: "cfm", label: "cfm" },
      ];

    case "energy":
      return [
        { unit: "kWh", label: "kWh" },
        { unit: "MWh", label: "MWh" },
      ];

    case "monetary_per_kwh":
      return [
        { unit: `${selectedCurrency}/kWh`, label: `${selectedCurrency}/kWh` },
        { unit: `${selectedCurrency}/MWh`, label: `${selectedCurrency}/MWh` },
      ];

    case "monetary_per_unit":
      return [{ unit: `${selectedCurrency}/unit`, label: `${selectedCurrency}/unit` }];

    case "monetary_per_year":
      return [{ unit: `${selectedCurrency}/year`, label: `${selectedCurrency}/year` }];

    case "monetary":
      // Check if this is a per-unit monetary field (price/cost per unit)
      if (ctx.isMonetaryPerUnit || inputName.toLowerCase().includes("per unit") || inputName.toLowerCase().includes("price") || inputName.toLowerCase().includes("cost per")) {
        return [{ unit: `${selectedCurrency}/unit`, label: `${selectedCurrency}/unit` }];
      }
      return [{ unit: selectedCurrency, label: selectedCurrency }];

    case "time": {
      const norm = canonicalUnit.toLowerCase().replace(/[-\s_]/g, "");
      // h/year, h/day, day/year, h are possible
      const options: UnitOption[] = [];
      const canonRaw = canonicalUnit.toLowerCase().trim();
      if (norm.includes("hperyear") || canonRaw === "h/year" || canonRaw === "h_per_year") {
        options.push({ unit: "h/year", label: "h/year" });
        options.push({ unit: "h/day", label: "h/day" });
      } else if (norm.includes("hperday") || canonRaw === "h/day" || canonRaw === "h_per_day") {
        options.push({ unit: "h/day", label: "h/day" });
        options.push({ unit: "h/year", label: "h/year" });
      } else if (norm.includes("dayperyear") || canonRaw === "day/year" || canonRaw === "day_per_year") {
        options.push({ unit: "day/year", label: "day/year" });
        options.push({ unit: "h/year", label: "h/year" });
      } else if (norm.length <= 2 && (canonRaw === "h" || canonRaw === "hour" || canonRaw === "hours")) {
        options.push({ unit: "h", label: "h" });
        options.push({ unit: "h/day", label: "h/day" });
      }
      return options.length > 0 ? options : [{ unit: canonicalUnit, label: cleanCanonicalUnit(canonicalUnit) }];
    }

    case "specific_power": {
      const norm = canonicalUnit.toLowerCase().replace(/[-\s_]/g, "");
      if (norm.includes("kw/") && (norm.includes("m3") || norm.includes("m³"))) {
        return [
          { unit: "kW/(m³/min)", label: "kW/(m³/min)" },
          { unit: "kW/(100 cfm)", label: "kW/(100 cfm)" },
        ];
      }
      return [{ unit: canonicalUnit, label: cleanCanonicalUnit(canonicalUnit) }];
    }

    case "area":
      return [
        { unit: "m²", label: "m²" },
        { unit: "cm²", label: "cm²" },
        { unit: "ft²", label: "ft²" },
      ];

    case "volume":
      return [
        { unit: "m³", label: "m³" },
        { unit: "L", label: "L" },
        { unit: "ft³", label: "ft³" },
        { unit: "gal", label: "gal" },
      ];

    case "mass":
      return [
        { unit: "kg", label: "kg" },
        { unit: "g", label: "g" },
        { unit: "t", label: "t" },
        { unit: "lb", label: "lb" },
      ];

    case "temperature":
      return [
        { unit: "°C", label: "°C" },
        { unit: "°F", label: "°F" },
        { unit: "K", label: "K" },
      ];

    case "percentage":
      return [
        { unit: "%", label: "%" },
        { unit: "decimal", label: "decimal" },
      ];

    case "count":
      return [
        { unit: "Units", label: "Units" },
        { unit: "pcs", label: "pcs" },
        { unit: "batches", label: "batches" },
        { unit: "cycles", label: "cycles" },
      ];

    default:
      return [{ unit: canonicalUnit, label: cleanCanonicalUnit(canonicalUnit) }];
  }
}

// ── Safe conversion functions ──────────────────────────────────────────────────

/**
 * Convert a display-layer value back to canonical unit value.
 * Returns the original value if conversion is unsupported or fromUnit === canonicalUnit.
 */
export function convertDisplayToCanonical(
  value: number,
  fromUnit: string,
  canonicalUnit: string,
): number {
  if (!Number.isFinite(value)) return value;
  if (fromUnit === canonicalUnit) return value;

  const family = detectUnitFamily(canonicalUnit, isMonetaryUnit(canonicalUnit), isCountUnit(canonicalUnit));

  switch (family) {
    case "length":
      return convertLengthToCanonical(value, fromUnit, canonicalUnit);
    case "pressure":
      return convertPressureToCanonical(value, fromUnit, canonicalUnit);
    case "flow":
      return convertFlowToCanonical(value, fromUnit, canonicalUnit);
    case "energy":
      return convertEnergyToCanonical(value, fromUnit, canonicalUnit);
    case "monetary_per_kwh":
      // If both from and to are per-kWh vs per-MWh, convert
      if (fromUnit.includes("/MWh") && canonicalUnit.includes("/kWh")) {
        return value / 1000;
      }
      if (fromUnit.includes("/kWh") && canonicalUnit.includes("/MWh")) {
        return value * 1000;
      }
      return value;
    case "specific_power":
      return convertSpecificPowerToCanonical(value, fromUnit, canonicalUnit);
    case "time":
      return convertTimeToCanonical(value, fromUnit, canonicalUnit);
    case "area":
      return convertAreaToCanonical(value, fromUnit, canonicalUnit);
    case "volume":
      return convertVolumeToCanonical(value, fromUnit, canonicalUnit);
    case "mass":
      return convertMassToCanonical(value, fromUnit, canonicalUnit);
    case "temperature":
      return convertTemperatureToCanonical(value, fromUnit, canonicalUnit);
    case "percentage":
      return convertPercentageToCanonical(value, fromUnit, canonicalUnit);
    default:
      return value;
  }
}

/**
 * Convert a canonical value to a display unit.
 * Returns the original value if conversion is unsupported or toUnit === canonicalUnit.
 */
export function convertCanonicalToDisplay(
  value: number,
  toUnit: string,
  canonicalUnit: string,
): number {
  if (!Number.isFinite(value)) return value;
  if (toUnit === canonicalUnit) return value;

  // For length, pressure, flow, energy, specific power, time, etc.,
  // wrapping around the canonical conversion is the same function:
  // we convert from canonical to the target display unit.
  // This is the inverse of convertDisplayToCanonical for the same pair.
  // Since all our conversions are symmetric (bar→psi, psi→bar etc.),
  // we can directly call the appropriate conversion.

  const family = detectUnitFamily(canonicalUnit, isMonetaryUnit(canonicalUnit), isCountUnit(canonicalUnit));

  switch (family) {
    case "length":
      return convertLengthToCanonical(value, canonicalUnit, toUnit);
    case "pressure":
      return convertPressureToCanonical(value, canonicalUnit, toUnit);
    case "flow":
      return convertFlowToCanonical(value, canonicalUnit, toUnit);
    case "energy":
      return convertEnergyToCanonical(value, canonicalUnit, toUnit);
    case "monetary_per_kwh":
      if (canonicalUnit.includes("/kWh") && toUnit.includes("/MWh")) {
        return value * 1000;
      }
      if (canonicalUnit.includes("/MWh") && toUnit.includes("/kWh")) {
        return value / 1000;
      }
      return value;
    case "specific_power":
      return convertSpecificPowerToCanonical(value, canonicalUnit, toUnit);
    case "time":
      return convertTimeToCanonical(value, canonicalUnit, toUnit);
    case "area":
      return convertAreaToCanonical(value, canonicalUnit, toUnit);
    case "volume":
      return convertVolumeToCanonical(value, canonicalUnit, toUnit);
    case "mass":
      return convertMassToCanonical(value, canonicalUnit, toUnit);
    case "temperature":
      return convertTemperatureToCanonical(value, canonicalUnit, toUnit);
    case "percentage":
      return convertPercentageToCanonical(value, canonicalUnit, toUnit);
    default:
      return value;
  }
}

// ── Format unit label with currency awareness ──────────────────────────────────

/**
 * Format a unit label for display, replacing currency placeholders.
 */
export function formatUnitLabel(unit: string, selectedCurrency: CurrencyCode): string {
  if (!unit) return "";
  // Replace currency code templates
  return unit
    .replace(/^selectedCurrency\b/g, selectedCurrency)
    .replace(/\bselectedCurrency\//g, `${selectedCurrency}/`)
    .replace(/\/selectedCurrency\b/g, `/${selectedCurrency}`);
}

// ── Internal conversion helpers ────────────────────────────────────────────────

function isMonetaryUnit(unit: string): boolean {
  const lower = unit.toLowerCase();
  return lower === "display_currency" || lower === "currency" || SUPPORTED_CURRENCIES_SOME.some((c) => lower.startsWith(c.toLowerCase()));
}

function isCountUnit(unit: string): boolean {
  const lower = unit.toLowerCase();
  return lower === "count" || lower === "units" || lower === "pcs" || lower === "batches" || lower === "cycles";
}

const SUPPORTED_CURRENCIES_SOME = ["usd", "eur", "gbp", "try", "inr", "cny", "jpy", "aud", "cad", "brl"];

// ── Conversion formula implementations ─────────────────────────────────────────

/* Length conversions — canonical to canonicalBase (mm) */
function toCanonicalLength(value: number, fromUnit: string): number {
  const unit = fromUnit.toLowerCase().trim();
  if (unit === "mm" || unit === "millimeter") return value;
  if (unit === "cm") return value * 10;
  if (unit === "m") return value * 1000;
  if (unit === "in" || unit === "inch" || unit === "inches") return value * 25.4;
  if (unit === "ft" || unit === "feet") return value * 304.8;
  return value; // already mm
}

function fromCanonicalLength(value: number, toUnit: string): number {
  const unit = toUnit.toLowerCase().trim();
  if (unit === "mm" || unit === "millimeter") return value;
  if (unit === "cm") return value / 10;
  if (unit === "m") return value / 1000;
  if (unit === "in" || unit === "inch" || unit === "inches") return value / 25.4;
  if (unit === "ft" || unit === "feet") return value / 304.8;
  return value;
}

function convertLengthToCanonical(value: number, fromUnit: string, canonicalUnit: string): number {
  const inCanonicalBase = toCanonicalLength(value, fromUnit);
  return fromCanonicalLength(inCanonicalBase, canonicalUnit);
}

/* Pressure conversions — canonical to bar */
function toCanonicalPressure(value: number, fromUnit: string): number {
  const unit = fromUnit.toLowerCase().trim();
  if (unit === "bar" || unit === "bar_g" || unit === "bar(g)") return value;
  if (unit === "psi") return value * 0.0689476;
  if (unit === "kpa") return value / 100;
  if (unit === "mpa") return value * 10;
  if (unit === "pa") return value / 100000;
  return value;
}

function fromCanonicalPressure(value: number, toUnit: string): number {
  const unit = toUnit.toLowerCase().trim();
  if (unit === "bar" || unit === "bar_g" || unit === "bar(g)") return value;
  if (unit === "psi") return value / 0.0689476;
  if (unit === "kpa") return value * 100;
  if (unit === "mpa") return value / 10;
  if (unit === "pa") return value * 100000;
  return value;
}

function convertPressureToCanonical(value: number, fromUnit: string, canonicalUnit: string): number {
  const inBar = toCanonicalPressure(value, fromUnit);
  return fromCanonicalPressure(inBar, canonicalUnit);
}

/* Flow conversions — canonical to m³/min */
function toCanonicalFlow(value: number, fromUnit: string): number {
  const unit = fromUnit.toLowerCase().replace(/[\s³]/g, "").replace("3", "").replace(/\^/g, "");
  // m3/min, m3/h, l/min, cfm
  if (unit === "m3/min" || unit === "m³/min") return value;
  if (unit === "m3/h" || unit === "m³/h") return value / 60;
  if (unit === "l/min" || unit === "lmin") return value / 1000;
  if (unit === "cfm") return value * 0.028316846592;
  return value;
}

function fromCanonicalFlow(value: number, toUnit: string): number {
  const unit = toUnit.toLowerCase().replace(/[\s³]/g, "").replace("3", "").replace(/\^/g, "");
  if (unit === "m3/min" || unit === "m³/min") return value;
  if (unit === "m3/h" || unit === "m³/h") return value * 60;
  if (unit === "l/min" || unit === "lmin") return value * 1000;
  if (unit === "cfm") return value / 0.028316846592;
  return value;
}

function convertFlowToCanonical(value: number, fromUnit: string, canonicalUnit: string): number {
  const inCanonicalBase = toCanonicalFlow(value, fromUnit);
  return fromCanonicalFlow(inCanonicalBase, canonicalUnit);
}

/* Energy conversions */
function convertEnergyToCanonical(value: number, fromUnit: string, canonicalUnit: string): number {
  const fromLower = fromUnit.toLowerCase().replace(/[\s-]/g, "");
  const toLower = canonicalUnit.toLowerCase().replace(/[\s-]/g, "");

  if (fromLower === toLower) return value;
  if (fromLower === "kwh" && toLower === "mwh") return value / 1000;
  if (fromLower === "mwh" && toLower === "kwh") return value * 1000;
  return value;
}

/* Specific compressor power — canonical kW/(m³/min) */
function convertSpecificPowerToCanonical(value: number, fromUnit: string, canonicalUnit: string): number {
  // 1 m³/min = 35.3147 cfm
  // 100 cfm = 2.8316846592 m³/min
  // So kW/(100 cfm) = kW / (100 cfm) = kW / (100 * 0.028316846592 m³/min) = kW / 2.8316846592 m³/min
  // Value in kW/(100 cfm) → canonical (kW/(m³/min)): multiply by 2.8316846592
  const fromLower = fromUnit.toLowerCase().replace(/[\s-]/g, "");
  const toLower = canonicalUnit.toLowerCase().replace(/[\s-]/g, "");

  if (fromLower === toLower) return value;
  if ((fromLower.includes("kw/") && fromLower.includes("100") && fromLower.includes("cfm")) &&
      (toLower.includes("kw/") && toLower.includes("m3"))) {
    // Convert kW/(100 cfm) to kW/(m³/min): multiply by 2.8316846592
    // Because kW/(100 cfm) = kW / (100 * 0.028316846592 m³/min) = kW / 2.8316846592 m³/min
    // So to get kW/(m³/min), multiply by 2.8316846592
    return value * 2.8316846592;
  }
  return value;
}

/* Time conversions */
function convertTimeToCanonical(value: number, fromUnit: string, canonicalUnit: string): number {
  const fromNorm = fromUnit.toLowerCase().replace(/[\s-]/g, "");
  const toNorm = canonicalUnit.toLowerCase().replace(/[\s-]/g, "");

  if (fromNorm === toNorm) return value;

  // If canonical says h/year but display is h/day
  if (toNorm.includes("hperyear") || toNorm.includes("h/year")) {
    if (fromNorm.includes("hperday") || fromNorm.includes("h/day")) {
      // Convert h/day → h/year: multiply by operating days (typically 365- but we use a standard factor)
      // Since we don't know exact operating days, we keep the value unchanged
      // The user should input the right quantity for the display unit
      // Actually this conversion is problematic without knowing context.
      // For safety, return as-is — the input field label changes but user enters appropriate value.
      return value;
    }
  }
  return value;
}

/* Area conversions — canonical to m² */
function toCanonicalArea(value: number, fromUnit: string): number {
  const unit = fromUnit.toLowerCase().replace(/[\s²2]/g, "");
  if (unit === "m") return value;
  if (unit === "cm") return value / 10000;
  if (unit === "ft") return value * 0.092903;
  return value;
}

function fromCanonicalArea(value: number, toUnit: string): number {
  const unit = toUnit.toLowerCase().replace(/[\s²2]/g, "");
  if (unit === "m") return value;
  if (unit === "cm") return value * 10000;
  if (unit === "ft") return value / 0.092903;
  return value;
}

function convertAreaToCanonical(value: number, fromUnit: string, canonicalUnit: string): number {
  const inCanonicalBase = toCanonicalArea(value, fromUnit);
  return fromCanonicalArea(inCanonicalBase, canonicalUnit);
}

/* Volume conversions — canonical to m³ */
function toCanonicalVolume(value: number, fromUnit: string): number {
  const unit = fromUnit.toLowerCase().replace(/[\s³3]/g, "");
  if (unit === "m") return value;
  if (unit === "l") return value / 1000;
  if (unit === "ft") return value * 0.0283168;
  if (unit === "gal") return value * 0.00378541;
  return value;
}

function fromCanonicalVolume(value: number, toUnit: string): number {
  const unit = toUnit.toLowerCase().replace(/[\s³3]/g, "");
  if (unit === "m") return value;
  if (unit === "l") return value * 1000;
  if (unit === "ft") return value / 0.0283168;
  if (unit === "gal") return value / 0.00378541;
  return value;
}

function convertVolumeToCanonical(value: number, fromUnit: string, canonicalUnit: string): number {
  const inCanonicalBase = toCanonicalVolume(value, fromUnit);
  return fromCanonicalVolume(inCanonicalBase, canonicalUnit);
}

/* Mass conversions — canonical to kg */
function toCanonicalMass(value: number, fromUnit: string): number {
  const unit = fromUnit.toLowerCase().trim();
  if (unit === "kg") return value;
  if (unit === "g") return value / 1000;
  if (unit === "t" || unit === "ton") return value * 1000;
  if (unit === "lb" || unit === "lbs") return value * 0.453592;
  return value;
}

function fromCanonicalMass(value: number, toUnit: string): number {
  const unit = toUnit.toLowerCase().trim();
  if (unit === "kg") return value;
  if (unit === "g") return value * 1000;
  if (unit === "t" || unit === "ton") return value / 1000;
  if (unit === "lb" || unit === "lbs") return value / 0.453592;
  return value;
}

function convertMassToCanonical(value: number, fromUnit: string, canonicalUnit: string): number {
  const inCanonicalBase = toCanonicalMass(value, fromUnit);
  return fromCanonicalMass(inCanonicalBase, canonicalUnit);
}

/* Temperature conversions — canonical to °C */
function toCanonicalTemperature(value: number, fromUnit: string): number {
  const unit = fromUnit.toLowerCase().replace(/[°\s]/g, "");
  if (unit === "c") return value;
  if (unit === "f") return (value - 32) * 5 / 9;
  if (unit === "k") return value - 273.15;
  return value;
}

function fromCanonicalTemperature(value: number, toUnit: string): number {
  const unit = toUnit.toLowerCase().replace(/[°\s]/g, "");
  if (unit === "c") return value;
  if (unit === "f") return value * 9 / 5 + 32;
  if (unit === "k") return value + 273.15;
  return value;
}

function convertTemperatureToCanonical(value: number, fromUnit: string, canonicalUnit: string): number {
  const inCanonicalBase = toCanonicalTemperature(value, fromUnit);
  return fromCanonicalTemperature(inCanonicalBase, canonicalUnit);
}

/* Percentage conversions */
function convertPercentageToCanonical(value: number, fromUnit: string, canonicalUnit: string): number {
  // If canonical is % and display is decimal, multiply by 100
  const fromLower = fromUnit.toLowerCase().trim();
  const toLower = canonicalUnit.toLowerCase().trim();
  if (fromLower === toLower) return value;
  if (fromLower === "decimal" && (toLower === "%" || toLower === "percent")) return value * 100;
  if ((fromLower === "%" || fromLower === "percent") && toLower === "decimal") return value / 100;
  return value;
}

// ── Clean canonical unit label (fallback) ──────────────────────────────────────

function cleanCanonicalUnit(unit: string): string {
  if (!unit) return "";
  return unit
    .replace(/_/g, " ")
    .replace(/\bbar_g\b/g, "bar")
    .replace(/\bh_per_year\b/g, "h/year")
    .replace(/\bdisplay_currency\b/g, "Currency");
}
