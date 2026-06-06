"use server";

/**
 * MarginCore Server Action — IP-protected calculation endpoint
 *
 * All MarginCore premium calculations run server-side only.
 * The client never sees the formulas, risk profiles, or CBAM logic.
 *
 * Architecture:
 *   Client form → POST inputs → this action → runMarginCoreEngine → return report
 *
 * This prevents reverse engineering of:
 *   - P90 safe price formulas
 *   - Sector risk multipliers
 *   - CBAM carbon pricing logic
 *   - Margin leak detection algorithms
 *   - Sensitivity matrix generation
 */

import type {
  MarginCoreInputValues,
  PremiumVerdictReport,
} from "@/lib/types/margincore-engine";

import { runMarginCoreEngine } from "@/lib/tools/risk-engine";
import { getSectorRiskProfile } from "@/lib/tools/sectors/risk-profiles";
import {
  getNaiveCostCalculator,
  getMarginLeakDetector,
  getVerdictLabels,
} from "@/lib/tools/sectors/sector-calculators";

// ---------------------------------------------------------------------------
// Legal disclaimer (injected into every report)
// ---------------------------------------------------------------------------

const LEGAL_DISCLAIMER =
  "This is a technical simulation and decision-support output. It is not financial, legal or engineering advice. Verify all results before making business decisions.";

// ---------------------------------------------------------------------------
// Main Server Action
// ---------------------------------------------------------------------------

/**
 * Run a MarginCore premium analysis for any sector.
 *
 * @param toolSlug  — the tool identifier (e.g. "cnc-quote-risk-analyzer")
 * @param sectorSlug — the sector (e.g. "cnc-manufacturing")
 * @param inputs — user form inputs (key-value pairs)
 * @param quotedPrice — optional: the price the user is considering
 * @param targetMarginPercent — optional: target margin (default 20%)
 * @returns PremiumVerdictReport
 */
export async function runMarginCoreAnalysis(params: {
  toolSlug: string;
  sectorSlug: string;
  inputs: MarginCoreInputValues;
  quotedPrice?: number;
  targetMarginPercent?: number;
  currency?: string;
}): Promise<PremiumVerdictReport> {
  const {
    toolSlug,
    sectorSlug,
    inputs,
    quotedPrice,
    targetMarginPercent = 20,
    currency = "USD",
  } = params;

  // Resolve sector-specific components
  const riskProfile = getSectorRiskProfile(sectorSlug);
  const calculateNaiveCost = getNaiveCostCalculator(sectorSlug);
  const detectMarginLeaks = getMarginLeakDetector(sectorSlug);
  const verdictLabels = getVerdictLabels(sectorSlug);

  // Run the engine
  const report = runMarginCoreEngine(
    {
      toolSlug,
      sectorSlug,
      inputs,
      riskProfile,
      calculateNaiveCost,
      detectMarginLeaks,
      verdictLabels,
      targetMarginPercent,
      currency,
      legalDisclaimer: LEGAL_DISCLAIMER,
    },
    quotedPrice,
  );

  return report;
}

// ---------------------------------------------------------------------------
// Batch Analysis (for comparing multiple scenarios)
// ---------------------------------------------------------------------------

/**
 * Run MarginCore analysis for multiple scenarios at once.
 * Useful for "what if I change my quote price?" comparisons.
 */
export async function runMarginCoreBatchAnalysis(params: {
  toolSlug: string;
  sectorSlug: string;
  inputs: MarginCoreInputValues;
  quotedPrices: number[];
  targetMarginPercent?: number;
  currency?: string;
}): Promise<PremiumVerdictReport[]> {
  const {
    toolSlug,
    sectorSlug,
    inputs,
    quotedPrices,
    targetMarginPercent = 20,
    currency = "USD",
  } = params;

  const riskProfile = getSectorRiskProfile(sectorSlug);
  const calculateNaiveCost = getNaiveCostCalculator(sectorSlug);
  const detectMarginLeaks = getMarginLeakDetector(sectorSlug);
  const verdictLabels = getVerdictLabels(sectorSlug);

  return quotedPrices.map((price) =>
    runMarginCoreEngine(
      {
        toolSlug,
        sectorSlug,
        inputs,
        riskProfile,
        calculateNaiveCost,
        detectMarginLeaks,
        verdictLabels,
        targetMarginPercent,
        currency,
        legalDisclaimer: LEGAL_DISCLAIMER,
      },
      price,
    ),
  );
}

// ---------------------------------------------------------------------------
// Sector Info (for UI — no formulas exposed)
// ---------------------------------------------------------------------------

/**
 * Get public sector metadata for UI display.
 * Does NOT expose risk profiles or formulas.
 */
export async function getSectorPublicInfo(sectorSlug: string): Promise<{
  cbamExposure: "none" | "low" | "medium" | "high";
  riskComplexity: "standard" | "complex" | "volatile";
  suggestedInputs: string[];
}> {
  const riskProfile = getSectorRiskProfile(sectorSlug);

  const cbamIndex = riskProfile.cbamExposureIndex;
  const cbamExposure =
    cbamIndex <= 0
      ? "none"
      : cbamIndex <= 0.2
        ? "low"
        : cbamIndex <= 0.5
          ? "medium"
          : "high";

  const volatility = riskProfile.baseVolatility;
  const riskComplexity =
    volatility <= 0.18
      ? "standard"
      : volatility <= 0.25
        ? "complex"
        : "volatile";

  const suggestedInputs = Object.keys(riskProfile.sectorRiskMultipliers);

  return { cbamExposure, riskComplexity, suggestedInputs };
}