/**
 * Smart form field helpers — governance metadata only (Phase 5H-G-A).
 */

const CURRENCY_HINTS = ["cost", "price", "fee", "budget", "rent", "material", "parts", "fuel", "ink"];
const PERCENT_HINTS = ["percent", "pct", "margin", "risk", "waste", "scrap", "rate"];
const TIME_HINTS = ["hours", "hour", "minutes", "minute", "time", "setup"];
const COUNT_HINTS = ["count", "quantity", "visits", "fixture", "bend", "pierce"];

export function humanizeFieldKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

export function inferFieldDimension(key: string): { dimension: string; unit: string } {
  const normalized = key.toLowerCase();

  if (PERCENT_HINTS.some((hint) => normalized.includes(hint)) && normalized.includes("percent")) {
    return { dimension: "percent", unit: "%" };
  }
  if (TIME_HINTS.some((hint) => normalized.includes(hint))) {
    return { dimension: "time", unit: normalized.includes("minute") ? "min" : "hr" };
  }
  if (COUNT_HINTS.some((hint) => normalized.includes(hint))) {
    return { dimension: "count", unit: "count" };
  }
  if (CURRENCY_HINTS.some((hint) => normalized.includes(hint))) {
    return { dimension: "currency", unit: "USD" };
  }
  if (normalized.includes("rate") && !normalized.includes("percent")) {
    return { dimension: "currency", unit: "USD/hr" };
  }
  if (normalized.includes("margin") || normalized.includes("percent")) {
    return { dimension: "percent", unit: "%" };
  }

  return { dimension: "dimensionless", unit: "value" };
}
