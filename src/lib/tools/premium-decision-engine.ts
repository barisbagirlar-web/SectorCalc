/**
 * SectorCalc Premium Tool Contract v1 — unified decision engine (Stub).
 */

import type {
 PremiumDecisionReport,
 PremiumVerdict,
} from "@/lib/tools/premium-tool-contract";

export const LEGAL_NOTE =
 "This report is a technical decision-support simulation based on user-provided inputs and sector assumptions. It is not financial, legal, medical or engineering advice. Verify all outputs before business decisions.";

export type PremiumInputValues = Record<string, number | string>;

export function normalizeNumber(value: string | number): number {
  const parsed = typeof value === "number" ? value : Number(String(value).trim());
  return Number.isFinite(parsed) ? parsed : NaN;
}

export function assertFiniteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function safeDivide(a: number, b: number): number {
  return b === 0 ? 0 : a / b;
}

export function round(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function formatCurrency(value: number, _currency = "USD"): string {
  return `$${value.toFixed(2)}`;
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function calculatePremiumDecisionReport(
  slug: string,
  _values: PremiumInputValues
): PremiumDecisionReport {
  const verdict: PremiumVerdict = {
    severity: "accept",
    label: "SAFE TO QUOTE",
    suggestedAction: "Use the analyzer once new calculators are defined.",
  };
  return {
    toolSlug: slug,
    sectorSlug: "cnc-manufacturing",
    generatedAt: new Date().toISOString(),
    contractTitle: "Decision Report",
    primaryMetricLabel: "Minimum Safe Price",
    primaryMetricValue: "$150.00",
    baseCost: 100,
    baseCostDisplay: "$100.00",
    hiddenMultiplier: 1.0,
    adjustedCost: 100,
    adjustedCostDisplay: "$100.00",
    volatilityBuffer: 20,
    volatilityBufferDisplay: "$20.00",
    p90Cost: 120,
    p90CostDisplay: "$120.00",
    minimumSafePrice: 150,
    minimumSafePriceDisplay: "$150.00",
    quotedPrice: 160,
    quotedPriceDisplay: "$160.00",
    targetMargin: 0.20,
    targetMarginDisplay: "20%",
    verdict,
    hiddenLossDrivers: [],
    sensitivity: [],
    summary: "Simulation Complete",
    recommendation: "Review specifications.",
    reportSections: [],
    legalNote: LEGAL_NOTE,
    architecture: {
      profile: {
        slug: slug,
        sectorSlug: "cnc-manufacturing",
        sectorLabel: "CNC Manufacturing",
        decisionFamily: "measurement_accuracy",
        secondaryFamilies: [],
        reportFamily: "loss_detection",
        engineModes: [],
        lossImpacts: [],
        lossTypeLabels: [],
        reclassifiedTitle: "Decision Report",
        reclassifiedPromise: "Simulation support",
        whatIsMeasured: "Machining",
        whereIsLoss: "Setup & cycle time",
        toleranceFocus: "Tolerance drift",
        mvpLossFamily: false,
      },
      fieldPanel: {
        familyBadge: "KPI",
        sectorLabel: "CNC Manufacturing",
        verdictLine: "SAFE",
        measuredLine: "Baseline",
        lossHotspotLine: "None",
        toleranceStatus: "within",
        toleranceLine: "Safe margin",
        impactLine: "No loss detected",
        actionLine: "Safe to quote",
        kpis: [],
      },
    },
  };
}

export function listPremiumContractSlugs(): readonly string[] {
  return [];
}
