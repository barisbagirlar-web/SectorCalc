import type { RevenueTool } from "@/lib/features/tools/revenue-tools";
import { mapDecisionReportToPremiumToolResult } from "@/lib/features/tools/premium-decision-bridge";
import { calculatePremiumDecisionReport } from "@/lib/features/tools/premium-decision-engine";
import { getPremiumToolContract } from "@/lib/features/tools/premium-tool-contracts";

export type PremiumToolInputValues = Record<string, number | string>;

export type PremiumSeverity = "safe" | "watch" | "danger";

export type PremiumToolResult = {
  verdict: string;
  headline: string;
  primaryMetricLabel: string;
  primaryMetricValue: string;
  riskDrivers: string[];
  suggestedAction: string;
  severity: PremiumSeverity;
};

function getNumber(values: PremiumToolInputValues, key: string): number {
  const raw = values[key];

  if (typeof raw === "number") {
    return Number.isFinite(raw) ? raw : 0;
  }

  if (typeof raw === "string") {
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

export function arePremiumToolInputsValid(
  tool: RevenueTool,
  values: PremiumToolInputValues,
): boolean {
  for (const input of tool.paidInputs) {
    if (!input.required) {
      continue;
    }
    if (input.type === "select") {
      const raw = values[input.key];
      if (typeof raw !== "string" || raw.trim() === "") {
        return false;
      }
      continue;
    }
    const numeric = getNumber(values, input.key);
    if (numeric <= 0) {
      return false;
    }
  }
  return true;
}

export function calculatePremiumToolResult(
  tool: RevenueTool,
  values: PremiumToolInputValues,
  locale = "en",
): PremiumToolResult {
  const contract = getPremiumToolContract(tool.paidSlug);
  if (!contract) {
    return {
      verdict: "Review inputs",
      headline: "Analyzer contract not found.",
      primaryMetricLabel: "Result",
      primaryMetricValue: "—",
      riskDrivers: ["Configuration"],
      suggestedAction: "Contact support if this analyzer should be available.",
      severity: "watch",
    };
  }

  const report = calculatePremiumDecisionReport(tool.paidSlug, values, locale);
  return mapDecisionReportToPremiumToolResult(report);
}

export { calculatePremiumDecisionReport } from "@/lib/features/tools/premium-decision-engine";
export type { PremiumDecisionReport } from "@/lib/features/tools/premium-tool-contract";
