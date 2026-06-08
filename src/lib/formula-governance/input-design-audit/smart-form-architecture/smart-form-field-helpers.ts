/**
 * Smart form field helpers — governance metadata only (Phase 5H-G-A).
 */

const VERDICT_OUTPUT_PATTERNS = [
  "quoteverdict",
  "suggestedaction",
  "verdict",
  "recommendation",
  "risklevel",
  "narrative",
];

const CURRENCY_HINTS = ["cost", "price", "fee", "budget", "rent", "material", "parts", "fuel", "ink"];
const PERCENT_HINTS = ["percent", "pct", "margin", "risk", "waste", "scrap", "rate"];
const TIME_HINTS = ["hours", "hour", "minutes", "minute", "time", "setup"];
const COUNT_HINTS = ["count", "quantity", "visits", "fixture", "bend", "pierce"];

export function humanizeVariableId(variableId: string): string {
  return variableId
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

export function inferFieldDimension(variableId: string): { dimension: string; unit: string } {
  const normalized = variableId.toLowerCase();

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

  return { dimension: "dimensionless", unit: "value" };
}

export function inferMissingRisk(group: "required" | "optional" | "advanced"): string {
  if (group === "required") {
    return "high";
  }
  if (group === "optional") {
    return "medium";
  }
  return "low";
}

export function isNarrativeOutput(outputId: string): boolean {
  const normalized = outputId.toLowerCase();
  return VERDICT_OUTPUT_PATTERNS.some((pattern) => normalized.includes(pattern));
}

export function buildMissingInputQuestion(
  variableId: string,
  group: "required" | "optional" | "advanced",
): string {
  const label = humanizeVariableId(variableId).toLowerCase();
  if (group === "required") {
    return `What is the ${label} for this job?`;
  }
  if (group === "optional") {
    return `Do you want to override the default ${label} for this estimate?`;
  }
  return `Add ${label} for a more precise professional estimate?`;
}
