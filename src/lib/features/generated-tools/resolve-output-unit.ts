import type { GeneratedToolSchema } from "@/lib/features/generated-tools/types";

const GENERIC_INPUT_UNITS = new Set(["unit", "units", "dimensionless", "-", "-"]);

function isMeaningfulUnit(unit: string | undefined): unit is string {
  const trimmed = unit?.trim();
  return Boolean(trimmed && !GENERIC_INPUT_UNITS.has(trimmed.toLowerCase()));
}

/** Infer display unit from an output or formula key (e.g. fileSizeMB → MB). */
export function inferUnitFromOutputKey(key: string): string | undefined {
  const normalized = key.trim();
  if (!normalized) {
    return undefined;
  }

  const lower = normalized.toLowerCase();

  if (/filesize.*mb|_mb$|mb$/.test(lower)) return "MB";
  if (/filesize.*kb|_kb$|kb$/.test(lower)) return "KB";
  if (/filesize.*gb|_gb$|gb$/.test(lower)) return "GB";
  if (/filesize.*byte|_bytes?$|bytes?$/.test(lower)) return "bytes";
  if (/percent|ratio|margin|share|availability|utilization|efficiency/.test(lower)) return "%";
  if (/inch|inches|_in$/.test(lower)) return "in";
  if (/millimeter|_mm$|mm$/.test(lower)) return "mm";
  if (/centimeter|_cm$|cm$/.test(lower)) return "cm";
  if (/(?:meter|metre|_m$)/.test(lower) && !/minute|month|milli/.test(lower)) return "m";
  if (/kilogram|_kg$|kg$/.test(lower)) return "kg";
  if (/pound|_lb$|lbs$/.test(lower)) return "lb";
  if (/gram|_g$/.test(lower) && !/gauge|deg/.test(lower)) return "g";
  if (/kwh|kilowatt.?hour/.test(lower)) return "kWh";
  if (/rpm|spindle.?speed/.test(lower)) return "rpm";
  if (/minute|duration|downtime|cycle.?time|_min$/.test(lower)) return "min";
  if (/hour|_hr$|_h$/.test(lower)) return "h";
  if (/pixel|_px$|px$/.test(lower)) return "px";
  if (/dpi|dots.?per.?inch/.test(lower)) return "dpi";
  if (/degree|_deg$/.test(lower)) return "°";
  if (/usd|dollar/.test(lower)) return "USD";
  if (/eur|euro/.test(lower)) return "EUR";
  if (/try|lira/.test(lower)) return "TRY";
  if (/celsius|_c$|temp/.test(lower)) return "°C";
  if (/fahrenheit|_f$/.test(lower)) return "°F";
  if (/newton|_n$/.test(lower)) return "N";
  if (/pascal|_pa$/.test(lower)) return "Pa";
  if (/watt|_w$/.test(lower)) return "W";
  if (/volt|_v$/.test(lower)) return "V";
  if (/amp|_a$/.test(lower)) return "A";
  if (/liter|litre|_l$/.test(lower)) return "L";
  if (/gallon|_gal$/.test(lower)) return "gal";

  return undefined;
}

export function resolvePrimaryOutputUnit(schema: GeneratedToolSchema): string {
  if (isMeaningfulUnit(schema.outputs.unit)) {
    return schema.outputs.unit.trim();
  }

  const primaryKey = schema.outputs.primary;
  const fromKey = inferUnitFromOutputKey(primaryKey);
  if (fromKey) {
    return fromKey;
  }

  const fromBreakdown = schema.outputs.breakdownUnits?.[primaryKey];
  if (isMeaningfulUnit(fromBreakdown)) {
    return fromBreakdown.trim();
  }

  const inputUnit = schema.inputs.find((input) => isMeaningfulUnit(input.unit))?.unit;
  if (inputUnit) {
    return inputUnit.trim();
  }

  return "-";
}

export function resolveBreakdownOutputUnit(schema: GeneratedToolSchema, key: string): string {
  const explicit = schema.outputs.breakdownUnits?.[key];
  if (isMeaningfulUnit(explicit)) {
    return explicit.trim();
  }

  return inferUnitFromOutputKey(key) ?? "";
}
