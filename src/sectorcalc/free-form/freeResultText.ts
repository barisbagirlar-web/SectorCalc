// SectorCalc — Free Tool Result Text Formatting
// Pure functions for business-language result display.
// Never outputs a duplicate "Result:" prefix. Always includes units when available.

/**
 * Round a monetary value to 2 decimal places.
 * Falls back to raw value if rounding produces non-finite result.
 */
export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return value;
  return Math.round(value * 100) / 100;
}

/**
 * Round a ratio/percentage consistently.
 */
export function roundPercent(value: number): number {
  if (!Number.isFinite(value)) return value;
  return Math.round(value * 100) / 100;
}

/**
 * Format a primary result value with label and unit.
 *
 * Examples:
 *   formatPrimaryResult({ label: "Shop hourly cost", value: 44.5, unit: "$/hour" })
 *   => "44.50 $/hour"
 *
 *   formatPrimaryResult({ label: "Weight", value: 150, unit: "kg" })
 *   => "150 kg"
 */
export function formatPrimaryResult(params: {
  label: string;
  value: number;
  unit?: string;
  /** Force monetary formatting (2 decimals) */
  isMonetary?: boolean;
}): string {
  const { value, unit } = params;
  if (!Number.isFinite(value)) return "—";

  const isMonetary = params.isMonetary ?? guessIsMonetary(unit);
  let formatted: string;

  if (isMonetary) {
    formatted = roundMoney(value).toFixed(2);
  } else if (Number.isInteger(value) && Math.abs(value) < 1e15) {
    formatted = value.toLocaleString("en-US", { maximumFractionDigits: 0 });
  } else if (Math.abs(value) < 1) {
    formatted = value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });
  } else {
    formatted = value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  return unit ? `${formatted} ${unit}` : formatted;
}

/**
 * Guess whether a unit string represents a monetary value.
 */
function guessIsMonetary(unit?: string): boolean {
  if (!unit) return false;
  const u = unit.toLowerCase();
  return (
    u.startsWith("$") ||
    u.startsWith("usd") ||
    u.startsWith("eur") ||
    u.startsWith("gbp") ||
    u.startsWith("try") ||
    u.includes("$/") ||
    u.includes("usd/") ||
    u.includes("currency")
  );
}

/**
 * Format a summary sentence that explains the business meaning of the result.
 *
 * Rules:
 * - Never include a duplicate "Result:" prefix.
 * - Use business language.
 * - Include comparison if current value exists.
 *
 * Example:
 *   formatSummary({
 *     calculated: 44.5,
 *     current: 95,
 *     unit: "$/hour",
 *     resultLabel: "shop hourly cost",
 *     currentLabel: "Current shop rate",
 *   })
 *   => "Calculated shop hourly cost is 44.50 $/hour. Current shop rate is 95.00 $/hour, leaving 50.50 $/hour before taxes and exceptional costs."
 */
export function formatSummary(params: {
  calculated: number;
  current?: number;
  unit?: string;
  resultLabel: string;
  currentLabel?: string;
  /** The tool key for context-specific summary generation */
  toolKey?: string;
}): string {
  const { calculated, current, unit, resultLabel, currentLabel } = params;
  const unitStr = unit ? ` ${unit}` : "";

  // Format the calculated value
  const isMonetary = guessIsMonetary(unit);
  const calcStr = isMonetary
    ? roundMoney(calculated).toFixed(2)
    : String(formatSimpleNumber(calculated));
  const calcWithUnit = `${calcStr}${unitStr}`;

  // No comparator: simple summary
  if (current === undefined || !Number.isFinite(current)) {
    return `Calculated ${resultLabel.toLowerCase()} is ${calcWithUnit}. Verify all input values before using this result for production or planning decisions.`;
  }

  // Comparator exists
  const currentStr = isMonetary
    ? roundMoney(current).toFixed(2)
    : String(formatSimpleNumber(current));
  const currentWithUnit = `${currentStr}${unitStr}`;
  const diff = calculated <= current ? current - calculated : calculated - current;
  const diffStr = isMonetary ? roundMoney(diff).toFixed(2) : String(formatSimpleNumber(diff));
  const diffWithUnit = `${diffStr}${unitStr}`;
  const currLabel = currentLabel || "Current value";
  const direction =
    current >= calculated
      ? "leaving"
      : "requiring an additional";

  return `Calculated ${resultLabel.toLowerCase()} is ${calcWithUnit}. ${currLabel} is ${currentWithUnit}, ${direction} ${diffWithUnit} before taxes and exceptional costs.`;
}

/**
 * Simple number formatting without assumptions about monetary context.
 */
function formatSimpleNumber(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (Number.isInteger(value) && Math.abs(value) < 1e15) {
    return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

/**
 * Format difference between two values with business interpretation.
 */
export function formatComparison(params: {
  current: number;
  calculated: number;
  unit?: string;
  currentLabel: string;
  calculatedLabel: string;
}): {
  currentDisplay: string;
  calculatedDisplay: string;
  difference: number;
  differenceDisplay: string;
  differencePct: number;
  differencePctDisplay: string;
  interpretation: string;
} {
  const { current, calculated, unit, currentLabel, calculatedLabel } = params;
  const unitStr = unit ? ` ${unit}` : "";
  const isMonetary = guessIsMonetary(unit);

  const formatVal = (v: number) =>
    isMonetary ? roundMoney(v).toFixed(2) : String(formatSimpleNumber(v));

  const difference = current - calculated;
  const diffPct = calculated !== 0 ? (difference / calculated) * 100 : 0;

  return {
    currentDisplay: `${currentLabel}: ${formatVal(current)}${unitStr}`,
    calculatedDisplay: `${calculatedLabel}: ${formatVal(calculated)}${unitStr}`,
    difference,
    differenceDisplay: `Gap: ${formatVal(difference)}${unitStr}`,
    differencePct: diffPct,
    differencePctDisplay: `Margin on current rate: ${roundPercent(diffPct).toFixed(2)}%`,
    interpretation:
      difference >= 0
        ? "Current value exceeds calculated requirement."
        : "Current value is below calculated requirement.",
  };
}
