/** ECMI / ISO 9001 — breakdown chart dimension taxonomy (homogeneous units per panel). */
export type BreakdownChartDimension =
  | "currency"
  | "percent"
  | "time"
  | "factor"
  | "count"
  | "generic";

const DIMENSION_ORDER: readonly BreakdownChartDimension[] = [
  "currency",
  "time",
  "percent",
  "factor",
  "count",
  "generic",
];

function normalizeUnitHint(unit: string): string {
  return unit.trim().toLowerCase();
}

export function classifyBreakdownUnitHint(unitHint: string): BreakdownChartDimension | null {
  const unit = normalizeUnitHint(unitHint);
  if (!unit) {
    return null;
  }

  if (
    unit === "%" ||
    unit === "percent" ||
    unit === "percentage" ||
    unit.includes("percent")
  ) {
    return "percent";
  }

  if (
    unit === "dimensionless" ||
    unit === "factor" ||
    unit === "multiplier" ||
    unit === "index" ||
    unit === "coefficient" ||
    unit === "score" ||
    unit === "ratio"
  ) {
    return "factor";
  }

  if (
    unit.includes("minute") ||
    unit.includes("hour") ||
    unit.includes("second") ||
    unit === "min" ||
    unit === "hr" ||
    unit === "h" ||
    unit === "s" ||
    unit === "sec"
  ) {
    return "time";
  }

  if (
    unit.includes("usd") ||
    unit.includes("eur") ||
    unit.includes("try") ||
    unit.includes("currency") ||
    unit === "$" ||
    unit === "€" ||
    unit === "₺"
  ) {
    return "currency";
  }

  if (
    unit.includes("count") ||
    unit.includes("unit") ||
    unit.includes("piece") ||
    unit.includes("pass")
  ) {
    return "count";
  }

  return null;
}

export function classifyBreakdownKey(
  key: string,
  unitHint?: string,
): BreakdownChartDimension {
  const fromUnit = unitHint ? classifyBreakdownUnitHint(unitHint) : null;
  if (fromUnit) {
    return fromUnit;
  }

  const normalized = key.replace(/([A-Z])/g, "_$1").toLowerCase();

  if (
    /(?:^|_)(?:.*cost|price|revenue|profit|loss|savings|amount|fee|spend|margin)(?:$|_)/i.test(
      normalized,
    ) ||
    normalized.endsWith("cost")
  ) {
    return "currency";
  }

  if (
    /percentage|percent|_pct$|pct_|_pct_|_share$|share_|availability|utilization/i.test(
      normalized,
    )
  ) {
    return "percent";
  }

  if (
    /changeover|downtime|duration|cycle_time|lead_time|_time$|_time_|minutes|minute|hours|hour|seconds|second|delay/i.test(
      normalized,
    ) &&
    !/percentage|percent|_pct/i.test(normalized)
  ) {
    return "time";
  }

  if (/factor|multiplier|coefficient|modifier|index$/i.test(normalized)) {
    return "factor";
  }

  if (/count|quantity|units|passes|frequency|num_/i.test(normalized)) {
    return "count";
  }

  return "generic";
}

export function sortBreakdownDimensions(
  dimensions: readonly BreakdownChartDimension[],
): BreakdownChartDimension[] {
  const unique = [...new Set(dimensions)];
  return unique.sort(
    (a, b) => DIMENSION_ORDER.indexOf(a) - DIMENSION_ORDER.indexOf(b),
  );
}

export function resolveBreakdownTimeUnitSuffix(unitHint: string | undefined): "minute" | "hour" | "second" {
  const unit = normalizeUnitHint(unitHint ?? "minutes");
  if (unit.includes("hour") || unit === "hr" || unit === "h") {
    return "hour";
  }
  if (unit.includes("second") || unit === "s" || unit === "sec") {
    return "second";
  }
  return "minute";
}
