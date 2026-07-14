import type { ConversionEntry, SuperV4Input } from "./contract-types";

/**
 * Active ISO 4217 tender currencies used by the universal form. The order keeps
 * the highest-usage currencies first while retaining global coverage.
 * Currency selection is denomination-only: SectorCalc never performs FX
 * conversion inside an engineering or financial calculator.
 */
export const GLOBAL_CURRENCY_CODES = [
  "USD", "EUR", "GBP", "JPY", "CNY", "CHF", "CAD", "AUD", "NZD", "SGD",
  "HKD", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "RON", "BGN", "TRY",
  "AED", "SAR", "QAR", "KWD", "BHD", "OMR", "ILS", "INR", "PKR", "BDT",
  "LKR", "NPR", "IDR", "MYR", "THB", "PHP", "VND", "KRW", "TWD", "MOP",
  "BRL", "MXN", "ARS", "CLP", "COP", "PEN", "UYU", "PYG", "BOB", "VES",
  "ZAR", "EGP", "MAD", "DZD", "TND", "NGN", "KES", "GHS", "UGX", "TZS",
  "RWF", "ETB", "AOA", "MZN", "ZMW", "BWP", "NAD", "MUR", "SCR", "MGA",
  "XOF", "XAF", "XCD", "XPF", "AFN", "ALL", "AMD", "ANG", "AWG", "AZN",
  "BAM", "BBD", "BIF", "BMD", "BND", "BSD", "BTN", "BYN", "BZD", "CDF",
  "CRC", "CUP", "CVE", "DJF", "DOP", "ERN", "FJD", "FKP", "GEL", "GIP",
  "GMD", "GNF", "GTQ", "GYD", "HNL", "HTG", "IQD", "IRR", "ISK", "JMD",
  "JOD", "KGS", "KHR", "KMF", "KPW", "KYD", "KZT", "LAK", "LBP", "LRD",
  "LSL", "LYD", "MDL", "MKD", "MMK", "MNT", "MRU", "MVR", "MWK", "NIO",
  "PAB", "PGK", "RSD", "RUB", "SBD", "SDG", "SHP", "SLE", "SOS", "SRD",
  "SSP", "STN", "SVC", "SYP", "SZL", "TJS", "TMT", "TOP", "TTD", "UAH",
  "UZS", "VUV", "WST", "YER", "ZWG",
] as const;

export type CurrencyCode = (typeof GLOBAL_CURRENCY_CODES)[number];

const CURRENCY_CODE_SET = new Set<string>(GLOBAL_CURRENCY_CODES);

export function isCurrencyCode(value: string): value is CurrencyCode {
  return CURRENCY_CODE_SET.has(value.trim().toUpperCase());
}

export function extractCurrencyCode(unit: string): CurrencyCode | null {
  const match = unit.trim().toUpperCase().match(/^([A-Z]{3})(?:$|\/)/);
  return match && isCurrencyCode(match[1]) ? match[1] : null;
}

export interface ResolvedUniversalUnitContract {
  dimension:
    | "currency"
    | "length"
    | "area"
    | "volume"
    | "mass"
    | "force"
    | "pressure"
    | "temperature_absolute"
    | "temperature_interval"
    | "energy"
    | "power"
    | "time"
    | "calendar_time"
    | "speed"
    | "flow"
    | "torque"
    | "density"
    | "frequency"
    | "angle"
    | "ratio"
    | "count"
    | "dimensionless"
    | "custom";
  baseUnit: string | null;
  units: ConversionEntry[];
  displayUnits: string[];
  monetary: boolean;
  dimensionless: boolean;
}

const entry = (unit: string, factor: number, label = unit, offset?: number): ConversionEntry => ({
  unit,
  factor,
  ...(offset === undefined ? {} : { offset }),
  label,
});

const LINEAR_FAMILIES = {
  length: {
    baseUnit: "m",
    units: [entry("m", 1), entry("mm", 0.001), entry("cm", 0.01), entry("km", 1000), entry("in", 0.0254), entry("ft", 0.3048), entry("yd", 0.9144)],
  },
  area: {
    baseUnit: "m²",
    units: [entry("m²", 1), entry("mm²", 0.000001), entry("cm²", 0.0001), entry("km²", 1_000_000), entry("in²", 0.00064516), entry("ft²", 0.09290304)],
  },
  volume: {
    baseUnit: "m³",
    units: [entry("m³", 1), entry("cm³", 0.000001), entry("L", 0.001), entry("mL", 0.000001), entry("in³", 0.000016387064), entry("ft³", 0.028316846592), entry("US gal", 0.003785411784)],
  },
  mass: {
    baseUnit: "kg",
    units: [entry("kg", 1), entry("mg", 0.000001), entry("g", 0.001), entry("t", 1000), entry("oz", 0.028349523125), entry("lb", 0.45359237), entry("short ton", 907.18474)],
  },
  force: {
    baseUnit: "N",
    units: [entry("N", 1), entry("kN", 1000), entry("MN", 1_000_000), entry("lbf", 4.4482216152605), entry("kgf", 9.80665)],
  },
  pressure: {
    baseUnit: "Pa",
    units: [entry("Pa", 1), entry("kPa", 1000), entry("MPa", 1_000_000), entry("GPa", 1_000_000_000), entry("bar", 100_000), entry("psi", 6894.757293168), entry("ksi", 6_894_757.293168)],
  },
  energy: {
    baseUnit: "J",
    units: [entry("J", 1), entry("kJ", 1000), entry("MJ", 1_000_000), entry("Wh", 3600), entry("kWh", 3_600_000), entry("MWh", 3_600_000_000), entry("BTU", 1055.05585262)],
  },
  power: {
    baseUnit: "W",
    units: [entry("W", 1), entry("kW", 1000), entry("MW", 1_000_000), entry("hp", 745.6998715822702)],
  },
  time: {
    baseUnit: "s",
    units: [entry("s", 1), entry("min", 60), entry("h", 3600), entry("day", 86_400), entry("week", 604_800)],
  },
  calendar_time: {
    baseUnit: "month",
    units: [entry("month", 1), entry("quarter", 3), entry("year", 12)],
  },
  speed: {
    baseUnit: "m/s",
    units: [entry("m/s", 1), entry("km/h", 1 / 3.6), entry("ft/s", 0.3048), entry("mph", 0.44704)],
  },
  flow: {
    baseUnit: "m³/s",
    units: [entry("m³/s", 1), entry("m³/h", 1 / 3600), entry("L/s", 0.001), entry("L/min", 1 / 60_000), entry("cfm", 0.0004719474432), entry("US gpm", 0.0000630901964)],
  },
  torque: {
    baseUnit: "N·m",
    units: [entry("N·m", 1), entry("kN·m", 1000), entry("lbf·ft", 1.3558179483314004), entry("lbf·in", 0.1129848290276167)],
  },
  density: {
    baseUnit: "kg/m³",
    units: [entry("kg/m³", 1), entry("g/cm³", 1000), entry("lb/ft³", 16.01846337396014)],
  },
  frequency: {
    baseUnit: "Hz",
    units: [entry("Hz", 1), entry("kHz", 1000), entry("rpm", 1 / 60)],
  },
  angle: {
    baseUnit: "rad",
    units: [entry("rad", 1), entry("deg", Math.PI / 180)],
  },
  ratio: {
    baseUnit: "ratio",
    units: [entry("ratio", 1, "Ratio"), entry("%", 0.01), entry("ppm", 0.000001)],
  },
} as const;

function normalizeUnit(unit: string | null | undefined): string {
  return (unit ?? "")
    .trim()
    .replace(/_/g, " ")
    .replace(/\^2/g, "²")
    .replace(/\^3/g, "³")
    .replace(/m3/g, "m³")
    .replace(/m2/g, "m²")
    .replace(/\s+/g, " ");
}

function compact(value: string): string {
  return value.toLowerCase().replace(/[\s_()·.^-]/g, "");
}

function hasAny(value: string, tokens: readonly string[]): boolean {
  return tokens.some((token) => value.includes(token));
}

function isMonetaryInput(input: Pick<SuperV4Input, "id" | "name" | "quantity_kind" | "base_unit">): boolean {
  const quantity = input.quantity_kind.toLowerCase();
  const base = (input.base_unit ?? "").toLowerCase();
  if (quantity.includes("currency") || base.includes("currency")) return true;
  if (/^[a-z]{3}(?:$|\/)/i.test(base)) return true;
  const identity = `${input.id} ${input.name}`.toLowerCase();
  return hasAny(identity, [
    " cost", "cost_", "_cost", " price", "price_", "_price", " revenue", "revenue_", "_revenue",
    " cash", "cash_", "_cash", " salary", "salary_", "_salary", " capex", " opex", " investment",
    " invoice", " fee", " tariff", " freight", " labor rate", "labour rate", " machine rate", " shop rate",
    " material value", " inventory value", " selling value", "amount", "grant coverage",
  ]) && !hasAny(identity, ["percentage", "percent", "ratio", "rate percent", "margin"]);
}

export function isMonetaryInputContract(input: Pick<SuperV4Input, "id" | "name" | "quantity_kind" | "base_unit">): boolean {
  return isMonetaryInput(input);
}

function currencyDenominator(input: Pick<SuperV4Input, "id" | "name" | "base_unit">): string {
  const base = (input.base_unit ?? "").toLowerCase();
  const identity = `${input.id} ${input.name}`.toLowerCase();
  const explicit = base.match(/\/(kwh|mwh|kg|tonne|ton|m|km|h|hour|day|month|year|unit|part|portion|trip|order)$/i);
  if (explicit) {
    const raw = explicit[1].toLowerCase();
    const normalized: Record<string, string> = { h: "hour", kwh: "kWh", mwh: "MWh" };
    return `/${normalized[raw] ?? raw}`;
  }
  if (hasAny(identity, ["per kwh", "electricity rate", "energy rate"])) return "/kWh";
  if (hasAny(identity, ["per mwh"])) return "/MWh";
  if (hasAny(identity, ["hourly", "per hour"])) return "/hour";
  if (hasAny(identity, ["annual", "per year", "yearly"])) return "/year";
  if (hasAny(identity, ["monthly", "per month"])) return "/month";
  if (hasAny(identity, ["per day", "daily"])) return "/day";
  if (hasAny(identity, ["per kg"])) return "/kg";
  if (hasAny(identity, ["per tonne", "per ton"])) return "/tonne";
  if (hasAny(identity, ["per km"])) return "/km";
  if (hasAny(identity, ["per meter", "per metre", "per m"])) return "/m";
  if (hasAny(identity, ["per part"])) return "/part";
  if (hasAny(identity, ["per portion"])) return "/portion";
  if (hasAny(identity, ["per trip"])) return "/trip";
  if (hasAny(identity, ["per unit", "unit price", "unit cost"])) return "/unit";
  return "";
}

export function currencyDisplayUnit(
  code: CurrencyCode,
  input: Pick<SuperV4Input, "id" | "name" | "base_unit">,
): string {
  return `${code}${currencyDenominator(input)}`;
}

function ensureBaseAlias(
  baseUnit: string,
  canonicalBaseUnit: string,
  familyUnits: readonly ConversionEntry[],
): ConversionEntry[] {
  if (familyUnits.some((candidate) => candidate.unit === baseUnit)) return [...familyUnits];
  const normalizedBase = normalizeUnit(baseUnit);
  const alias = familyUnits.find((candidate) => normalizeUnit(candidate.unit).toLowerCase() === normalizedBase.toLowerCase());
  if (alias) return [...familyUnits, { ...alias, unit: baseUnit, label: alias.label ?? alias.unit }];
  if (baseUnit === canonicalBaseUnit) return [...familyUnits, entry(baseUnit, 1)];
  return [...familyUnits, entry(baseUnit, 1, normalizeUnit(baseUnit) || baseUnit)];
}

function familyContract(
  dimension: Exclude<ResolvedUniversalUnitContract["dimension"], "currency" | "count" | "dimensionless" | "custom" | "temperature_absolute" | "temperature_interval">,
  baseUnit: string,
  family: { baseUnit: string; units: readonly ConversionEntry[] },
): ResolvedUniversalUnitContract {
  const units = ensureBaseAlias(baseUnit, family.baseUnit, family.units);
  return {
    dimension,
    baseUnit,
    units,
    displayUnits: family.units.map((candidate) => candidate.unit),
    monetary: false,
    dimensionless: false,
  };
}

function inferBaseUnit(input: Pick<SuperV4Input, "id" | "name" | "quantity_kind" | "base_unit">): string | null {
  const original = normalizeUnit(input.base_unit);
  if (original && !["user unit", "userunit", "display currency", "currency unit"].includes(original.toLowerCase())) return original;
  const id = input.id.toLowerCase();
  const name = input.name.toLowerCase();
  const identity = `${id} ${name}`;
  if (/(^|_)\w*percent($|_)/.test(id) || name.includes("percent")) return "%";
  if (id.includes("ratio") || name.includes("ratio") || name.includes("probability") || name.includes("confidence")) return "ratio";
  if (/(^|_)(seconds?|sec)($|_)/.test(id) || name.includes("seconds")) return "s";
  if (/(^|_)(minutes?|min)($|_)/.test(id) || name.includes("minutes")) return "min";
  if (/(^|_)(hours?|hrs?)($|_)/.test(id) || name.includes("hours")) return "h";
  if (/(^|_)(days?)($|_)/.test(id) || name.includes("days")) return "day";
  if (/(^|_)(months?)($|_)/.test(id) || name.includes("months")) return "month";
  if (/(^|_)(years?)($|_)/.test(id) || name.includes("years")) return "year";
  if (id.includes("_mm") || name.includes(" mm") || name.includes("millimet")) return "mm";
  if (id.includes("_cm") || name.includes(" cm")) return "cm";
  if (id.includes("_km") || name.includes(" km")) return "km";
  if (id.includes("_m2") || name.includes("square metre") || name.includes("square meter")) return "m²";
  if (id.includes("_m3") || name.includes("cubic metre") || name.includes("cubic meter")) return "m³";
  if (id.includes("_kg") || name.includes(" kg")) return "kg";
  if (id.includes("_kw") || name.includes(" kw")) return "kW";
  if (id.includes("_kwh") || name.includes(" kwh")) return "kWh";
  if (id.includes("_mpa") || name.includes(" mpa")) return "MPa";
  if (id.includes("_kpa") || name.includes(" kpa")) return "kPa";
  if (id.includes("_psi") || name.includes(" psi")) return "psi";
  if (id.includes("_bar") || name.includes(" bar")) return "bar";
  if (id.includes("_rpm") || name.includes("rpm")) return "rpm";
  if (id.includes("_deg") || name.includes("angle")) return "deg";
  if (identity.includes("flow") && identity.includes("cfm")) return "cfm";
  return original || null;
}

function countContract(input: Pick<SuperV4Input, "id" | "name">): ResolvedUniversalUnitContract {
  const identity = `${input.id} ${input.name}`.toLowerCase();
  const labels = identity.includes("batch")
    ? ["batches"]
    : identity.includes("cycle")
      ? ["cycles"]
      : identity.includes("part")
        ? ["parts", "pcs"]
        : identity.includes("order")
          ? ["orders"]
          : ["units", "pcs"];
  return {
    dimension: "count",
    baseUnit: labels[0],
    units: labels.map((unit) => entry(unit, 1)),
    displayUnits: labels,
    monetary: false,
    dimensionless: false,
  };
}

export function resolveUniversalUnitContract(
  input: Pick<SuperV4Input, "id" | "name" | "quantity_kind" | "base_unit">,
): ResolvedUniversalUnitContract {
  if (isMonetaryInput(input)) {
    const baseUnit = input.base_unit && !["display_currency", "currency"].includes(input.base_unit)
      ? input.base_unit
      : "currency_unit";
    const displayUnits = GLOBAL_CURRENCY_CODES.map((code) => currencyDisplayUnit(code, input));
    return {
      dimension: "currency",
      baseUnit,
      units: [entry(baseUnit, 1, "Currency"), ...displayUnits.map((unit) => entry(unit, 1, unit))],
      displayUnits,
      monetary: true,
      dimensionless: false,
    };
  }

  const quantity = input.quantity_kind.toLowerCase();
  const baseUnit = inferBaseUnit(input);
  const normalized = compact(baseUnit ?? "");
  const identity = `${input.id} ${input.name}`.toLowerCase();

  if (quantity.includes("count") || normalized === "count" || normalized === "units" || /quantity|count|number of/.test(identity)) {
    return countContract(input);
  }
  if (quantity.includes("ratio") || quantity.includes("percent") || normalized === "%" || normalized === "percent" || normalized === "ratio" || normalized === "decimal") {
    const chosenBase = normalized === "%" || normalized === "percent" || input.id.toLowerCase().includes("percent") ? "%" : "ratio";
    return familyContract("ratio", chosenBase, LINEAR_FAMILIES.ratio);
  }
  if (!baseUnit) {
    return { dimension: "dimensionless", baseUnit: null, units: [], displayUnits: [], monetary: false, dimensionless: true };
  }

  if (["m", "mm", "cm", "km", "in", "ft", "yd", "millimeter", "millimetre", "meter", "metre"].includes(normalized)) return familyContract("length", baseUnit, LINEAR_FAMILIES.length);
  if (["m²", "mm²", "cm²", "km²", "in²", "ft²", "m2", "mm2", "cm2", "ft2"].includes(normalized)) return familyContract("area", baseUnit, LINEAR_FAMILIES.area);
  if (["m³", "cm³", "l", "ml", "in³", "ft³", "usgal", "m3", "cm3", "ft3"].includes(normalized)) return familyContract("volume", baseUnit, LINEAR_FAMILIES.volume);
  if (["kg", "mg", "g", "t", "oz", "lb", "lbs", "shortton", "tonne"].includes(normalized)) return familyContract("mass", baseUnit, LINEAR_FAMILIES.mass);
  if (["n", "kn", "mn", "lbf", "kgf"].includes(normalized)) return familyContract("force", baseUnit, LINEAR_FAMILIES.force);
  if (["pa", "kpa", "mpa", "gpa", "bar", "barg", "psi", "ksi"].includes(normalized)) return familyContract("pressure", baseUnit, LINEAR_FAMILIES.pressure);
  if (["j", "kj", "mj", "wh", "kwh", "mwh", "btu"].includes(normalized)) return familyContract("energy", baseUnit, LINEAR_FAMILIES.energy);
  if (["w", "kw", "mw", "hp"].includes(normalized)) return familyContract("power", baseUnit, LINEAR_FAMILIES.power);
  if (["s", "sec", "second", "min", "minute", "h", "hour", "day", "week"].includes(normalized)) return familyContract("time", baseUnit, LINEAR_FAMILIES.time);
  if (["month", "months", "quarter", "year", "years"].includes(normalized)) return familyContract("calendar_time", baseUnit, LINEAR_FAMILIES.calendar_time);
  if (["m/s", "km/h", "ft/s", "mph", "ms", "kmh", "fts"].includes(normalized)) return familyContract("speed", baseUnit, LINEAR_FAMILIES.speed);
  if (["m³/s", "m³/h", "l/s", "l/min", "cfm", "usgpm", "m3/s", "m3/h"].includes(normalized)) return familyContract("flow", baseUnit, LINEAR_FAMILIES.flow);
  if (["n·m", "kn·m", "lbf·ft", "lbf·in", "nm", "knm", "lbfft", "lbfin"].includes(normalized)) return familyContract("torque", baseUnit, LINEAR_FAMILIES.torque);
  if (["kg/m³", "g/cm³", "lb/ft³", "kgm3", "gcm3", "lbft3"].includes(normalized)) return familyContract("density", baseUnit, LINEAR_FAMILIES.density);
  if (["hz", "khz", "rpm"].includes(normalized)) return familyContract("frequency", baseUnit, LINEAR_FAMILIES.frequency);
  if (["rad", "deg", "degree", "degrees", "°"].includes(normalized)) return familyContract("angle", baseUnit, LINEAR_FAMILIES.angle);

  if (["°c", "c", "°f", "f", "k"].includes(normalized)) {
    const units = [entry("°C", 1), entry("°F", 9 / 5, "°F", 32), entry("K", 1, "K", 273.15)];
    return {
      dimension: "temperature_absolute",
      baseUnit,
      units: ensureBaseAlias(baseUnit, "°C", units),
      displayUnits: units.map((candidate) => candidate.unit),
      monetary: false,
      dimensionless: false,
    };
  }

  if (quantity.includes("dimensionless") || normalized === "number" || normalized === "unitless" || normalized === "userunit") {
    return { dimension: "dimensionless", baseUnit: null, units: [], displayUnits: [], monetary: false, dimensionless: true };
  }

  return {
    dimension: "custom",
    baseUnit,
    units: [entry(baseUnit, 1, normalizeUnit(baseUnit))],
    displayUnits: [baseUnit],
    monetary: false,
    dimensionless: false,
  };
}

export function formatCurrencyName(code: CurrencyCode): string {
  try {
    const displayNames = new Intl.DisplayNames(["en"], { type: "currency" });
    return displayNames.of(code) ?? code;
  } catch {
    return code;
  }
}
