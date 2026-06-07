import type { ResultTone } from "@/data/tool-schema";

export interface ScenarioTableLabels {
 subtitle: string;
 metric: string;
 primary: string;
 secondary: string;
 profit: string;
}

export interface PremiumScenarioRow {
 id: string;
 label: string;
 metricDisplay: string;
 primaryValue: number;
 secondaryValue: number;
 secondaryFormat: "currency" | "percent";
 profitValue: number;
}

export interface PremiumDecisionReport {
 executiveSummary: string;
 keyFindings: string[];
 riskLevelLabel: string;
 recommendation: string;
 assumptions: string;
}

export interface PremiumCalculatorPayload {
 riskLevel: ResultTone;
 verdictText: string;
 recommendation: string;
 scenarios: PremiumScenarioRow[];
 scenarioLabels: ScenarioTableLabels;
 report: PremiumDecisionReport;
}

export const DEFAULT_PREMIUM_ASSUMPTIONS =
 "This analysis is indicative based on your inputs. It does not replace professional cost accounting, contractual review, tax advice or audited financial statements.";

export const RISK_LEVEL_LABELS: Record<ResultTone, string> = {
 success: "Low risk",
 warning: "Moderate risk",
 danger: "High risk",
 neutral: "Neutral",
};

export function clampMargin(margin: number, min = 5, max = 80): number {
 return Math.min(max, Math.max(min, margin));
}

export function priceForMargin(directCost: number, marginPercent: number): number {
 if (marginPercent >= 100) return directCost;
 return directCost / (1 - marginPercent / 100);
}

export function buildMarginScenarioRows(
 margins: { id: string; label: string; margin: number }[],
 directCost: number,
 labels: ScenarioTableLabels,
 options?: { perUnitDivisor?: number }
): { scenarios: PremiumScenarioRow[]; scenarioLabels: ScenarioTableLabels } {
 const scenarios = margins.map(({ id, label, margin }) => {
 const primaryValue = priceForMargin(directCost, margin);
 const secondaryValue = options?.perUnitDivisor
 ? primaryValue / options.perUnitDivisor
 : margin;
 return {
 id,
 label,
 metricDisplay: `${margin}%`,
 primaryValue,
 secondaryValue,
 secondaryFormat: options?.perUnitDivisor
 ? ("currency" as const)
 : ("percent" as const),
 profitValue: primaryValue - directCost,
 };
 });

 return { scenarios, scenarioLabels: labels };
}
