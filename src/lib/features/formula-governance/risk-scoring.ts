/**
 * Smart formula risk scoring - keyword heuristics for inventory (Phase 2).
 * Does not mutate calculator logic or production risk engines.
 */

import type { DecisionImpact, RiskLevel } from "@/lib/features/formula-governance/types";

export const CRITICAL_KEYWORDS = [
  "rent vs buy",
  "rent-vs-buy",
  "loan",
  "mortgage",
  "credit",
  "investment",
  "return",
  "pricing",
  "quote",
  "bid",
  "margin",
  "profit",
  "cash flow",
  "cash-flow",
  "break even",
  "break-even",
  "tax",
  "salary",
  "factoring",
  "leasing",
  "interest",
  "payment",
  "cost of capital",
  "cost-of-capital",
] as const;

export const HIGH_KEYWORDS = [
  "scrap",
  "waste",
  "oee",
  "rework",
  "machine hour",
  "machine-time",
  "machine time",
  "route",
  "fuel",
  "construction overrun",
  "food waste",
  "food-cost",
  "food cost",
  "cleaning margin",
  "downtime",
  "tool wear",
  "tool-wear",
  "labor hours",
  "labor-hours",
  "crew hours",
  "crew-hours",
  "material waste",
  "energy peak",
  "energy-peak",
  "compressor leak",
  "compressor-leak",
  "delivery margin",
] as const;

const LOW_KEYWORDS = ["converter", "percentage", "area", "unit conversion", "unit-conversion"] as const;

const DECISION_LANGUAGE_KEYWORDS = [
  "verdict",
  "safe price",
  "accept",
  "reject",
  "recommend",
  "should buy",
  "should rent",
  "bid risk",
  "margin leak",
  "profit leak",
] as const;

const TIME_PERIOD_KEYWORDS = ["month", "year", "annual", "monthly", "yearly", "weekly", "daily"] as const;

export function normalizeRiskText(value: string): string {
  return value.toLowerCase().replace(/[_/]+/g, " ").trim();
}

export function matchesKeyword(haystack: string, keyword: string): boolean {
  return normalizeRiskText(haystack).includes(normalizeRiskText(keyword));
}

export function buildRiskBlob(input: {
  slug: string;
  name: string;
  inputKeys?: readonly string[];
  extraText?: readonly string[];
}): string {
  return [input.slug, input.name, ...(input.inputKeys ?? []), ...(input.extraText ?? [])].join(" ");
}

export function suggestRiskLevel(input: {
  slug: string;
  name: string;
  inputKeys?: readonly string[];
  extraText?: readonly string[];
}): RiskLevel {
  const blob = buildRiskBlob(input);
  if (CRITICAL_KEYWORDS.some((kw) => matchesKeyword(blob, kw))) {
    return "critical";
  }
  if (HIGH_KEYWORDS.some((kw) => matchesKeyword(blob, kw))) {
    return "high";
  }
  if (LOW_KEYWORDS.some((kw) => matchesKeyword(blob, kw))) {
    return "low";
  }
  return "medium";
}

export function suggestDecisionImpact(input: {
  slug: string;
  name: string;
  inputKeys?: readonly string[];
  extraText?: readonly string[];
}): DecisionImpact {
  const blob = buildRiskBlob(input);
  if (
    matchesKeyword(blob, "loan") ||
    matchesKeyword(blob, "mortgage") ||
    matchesKeyword(blob, "credit") ||
    matchesKeyword(blob, "factoring") ||
    matchesKeyword(blob, "leasing")
  ) {
    return "credit";
  }
  if (matchesKeyword(blob, "investment") || matchesKeyword(blob, "return")) {
    return "investment";
  }
  if (matchesKeyword(blob, "rent vs buy") || matchesKeyword(blob, "rent-vs-buy") || matchesKeyword(blob, "purchase")) {
    return "purchase";
  }
  if (
    matchesKeyword(blob, "pricing") ||
    matchesKeyword(blob, "quote") ||
    matchesKeyword(blob, "bid") ||
    matchesKeyword(blob, "margin")
  ) {
    return "pricing";
  }
  if (CRITICAL_KEYWORDS.some((kw) => matchesKeyword(blob, kw))) {
    return "financial";
  }
  if (HIGH_KEYWORDS.some((kw) => matchesKeyword(blob, kw))) {
    return "operational";
  }
  if (matchesKeyword(blob, "converter") || matchesKeyword(blob, "area")) {
    return "informational";
  }
  return "technical";
}

export function hasVisibleDecisionWording(input: {
  slug: string;
  name: string;
  extraText?: readonly string[];
}): boolean {
  const blob = buildRiskBlob({ ...input, inputKeys: [] });
  return DECISION_LANGUAGE_KEYWORDS.some((kw) => matchesKeyword(blob, kw));
}

export function detectRiskFlags(input: {
  slug: string;
  name: string;
  inputKeys: readonly string[];
  extraText?: readonly string[];
  hasContract: boolean;
  suggestedRiskLevel: RiskLevel;
  hasVisibleDecisionWording: boolean;
}): readonly string[] {
  const flags: string[] = [];
  const blob = buildRiskBlob(input);

  if (!input.hasContract && (input.suggestedRiskLevel === "critical" || input.suggestedRiskLevel === "high")) {
    flags.push("missing_contract");
  }

  if (
    input.suggestedRiskLevel === "critical" &&
    (matchesKeyword(blob, "rent vs buy") ||
      matchesKeyword(blob, "loan") ||
      matchesKeyword(blob, "investment"))
  ) {
    flags.push("purpose_formula_mismatch_risk");
  }

  if (
    (input.suggestedRiskLevel === "critical" || input.suggestedRiskLevel === "high") &&
    input.inputKeys.length < 3
  ) {
    flags.push("missing_parameter_risk");
  }

  const hasTimeWord = TIME_PERIOD_KEYWORDS.some((kw) => matchesKeyword(blob, kw));
  const hasPeriodField = input.inputKeys.some((key) =>
    /month|year|annual|period|term|duration/i.test(key),
  );
  if (hasTimeWord && !hasPeriodField && input.inputKeys.length > 0) {
    flags.push("time_period_ambiguity");
  }

  const hasPercentField = input.inputKeys.some((key) => /percent|pct|rate/i.test(key));
  const hasUnitHint = input.inputKeys.some((key) => /unit|currency|usd|eur|month|year/i.test(key));
  if (hasPercentField && !hasUnitHint) {
    flags.push("percent_unit_ambiguity");
  }

  if (input.hasVisibleDecisionWording && !input.hasContract) {
    flags.push("decision_language_risk");
  }

  return flags;
}

export function missingCriticalContractReason(input: {
  hasContract: boolean;
  suggestedRiskLevel: RiskLevel;
  slug: string;
}): string | undefined {
  if (input.hasContract) {
    return undefined;
  }
  if (input.suggestedRiskLevel === "critical") {
    return `Critical financial/decision tool "${input.slug}" has no FormulaContract.`;
  }
  if (input.suggestedRiskLevel === "high") {
    return `High operational-cost tool "${input.slug}" has no FormulaContract.`;
  }
  return undefined;
}
