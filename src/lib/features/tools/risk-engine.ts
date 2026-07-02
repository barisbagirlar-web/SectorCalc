/**
 * MarginCore Risk Engine - Central probabilistic & macro-economic math engine
 *
 * All math functions are isolated, pure, and deterministic given the same
 * inputs + risk profile. No side-effects, no I/O, no randomness.
 *
 * These functions run server-side only (Server Actions / Cloud Functions)
 * to protect IP from reverse engineering.
 *
 * Formula references:
 * P90 safe price: P_safe = E[C] + Z_90 × σ
 * CBAM liability: L_cbam = emissionFactor × outputUnits × carbonPrice
 * Sensitivity: scenario_i = base × (1 + shock_i) → re-evaluate
 */

import type {
 CBAMCostBreakdown,
 MarginCoreEngineInput,
 MarginCoreInputValues,
 MarginCoreRiskProfile,
 PremiumVerdict,
 PremiumVerdictReport,
 SensitivityScenario,
 VerdictSeverity,
} from "@/lib/core/types/margincore-engine";
import {
 applyRegionalRiskProfileOverlay,
 getRegionalCarbonPriceEur,
} from "@/lib/features/compliance/compliance-engine";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Z-score for 90th percentile (one-tailed) */
const Z_P90 = 1.2816;

/** Z-score for 95th percentile (used for "reject" threshold) */
const Z_P95 = 1.6449;

/** Default CBAM carbon price (EUR/tCO₂e) - EU ETS 2025 reference */
const DEFAULT_CARBON_PRICE_EUR = 85;

/** EUR → USD conversion (approximate, overridable) */
const EUR_USD_RATE = 1.08;

// ---------------------------------------------------------------------------
// 1. P90 Safe Cost Calculation
// ---------------------------------------------------------------------------

/**
 * Calculate the P90 safe cost using standard deviation and Z-score logic.
 *
 * Formula: P_safe = E[C] + Z_90 × σ
 *
 * Where:
 * E[C] = naive (expected) cost
 * σ = E[C] × baseVolatility (standard deviation of cost)
 * Z_90 = 1.2816 (90th-percentile, one-tailed)
 *
 * @param naiveCost - expected (base) cost before risk adjustment
 * @param riskProfile - sector risk profile containing baseVolatility
 * @returns P90 safe cost (currency)
 */
export function calculateP90SafeCost(
 naiveCost: number,
 riskProfile: MarginCoreRiskProfile,
): number {
 const sigma = naiveCost * riskProfile.baseVolatility;
 return naiveCost + Z_P90 * sigma;
}

/**
 * Calculate the P95 "reject threshold" cost.
 * If the market price is below this, the job should be rejected outright.
 */
export function calculateP95RejectThreshold(
 naiveCost: number,
 riskProfile: MarginCoreRiskProfile,
): number {
 const sigma = naiveCost * riskProfile.baseVolatility;
 return naiveCost + Z_P95 * sigma;
}

// ---------------------------------------------------------------------------
// 2. Sector Risk Multiplier Application
// ---------------------------------------------------------------------------

/**
 * Apply sector-specific risk multipliers to the naive cost.
 *
 * Each named multiplier represents a cost driver (e.g. toolBreakage,
 * supplyChain). The function compounds them multiplicatively.
 *
 * @param naiveCost - base cost
 * @param riskProfile - sector risk profile
 * @returns cost after all sector risk multipliers applied
 */
export function applySectorRiskMultipliers(
 naiveCost: number,
 riskProfile: MarginCoreRiskProfile,
): number {
 let adjusted = naiveCost;
 for (const multiplier of Object.values(riskProfile.sectorRiskMultipliers)) {
 adjusted *= multiplier;
 }
 return adjusted;
}

// ---------------------------------------------------------------------------
// 3. CBAM Shock (Carbon Border Adjustment Mechanism)
// ---------------------------------------------------------------------------

/**
 * Calculate CBAM carbon border tax liability.
 *
 * Formula: L_cbam = emissionFactor × baseCost_proxy × carbonPrice × exposureIndex
 *
 * The `sectorEmissionFactor` represents tCO₂e per $1000 of output cost.
 * This is a simplified proxy; real CBAM calculations require actual
 * embedded emissions data.
 *
 * @param baseCost - naive cost (used as proxy for output scale)
 * @param sectorEmissionFactor - tCO₂e per $1000 of output
 * @param cbamExposureIndex - 0 (no exposure) to 1 (full EU export)
 * @param carbonPriceOverride - optional carbon price override (EUR/tCO₂e)
 * @returns CBAM liability in USD
 */
export function applyCBAMShock(
 baseCost: number,
 sectorEmissionFactor: number,
 cbamExposureIndex: number,
 carbonPriceOverride?: number,
): number {
 if (cbamExposureIndex <= 0 || sectorEmissionFactor <= 0) {
 return 0;
 }

 const carbonPrice = carbonPriceOverride ?? DEFAULT_CARBON_PRICE_EUR;
 const outputScale = baseCost / 1000;
 const emissionsTons = sectorEmissionFactor * outputScale;
 const liabilityEur = emissionsTons * carbonPrice * cbamExposureIndex;

 return liabilityEur * EUR_USD_RATE;
}

/**
 * Build a full CBAM cost breakdown for the report.
 */
export function buildCBAMBreakdown(
 baseCost: number,
 riskProfile: MarginCoreRiskProfile,
 sectorEmissionFactor: number,
 cbamLiability: number,
): CBAMCostBreakdown | null {
 if (riskProfile.cbamExposureIndex <= 0) {
 return null;
 }

 const inScope = riskProfile.cbamExposureIndex > 0.3;

 return {
 emissionFactor: sectorEmissionFactor,
 carbonPricePerTonne: DEFAULT_CARBON_PRICE_EUR,
 cbamLiability: round2(cbamLiability),
 inScope,
 summary: inScope
 ? `Sector is within CBAM scope. Estimated carbon border liability: $${round2(cbamLiability).toLocaleString()} at €${DEFAULT_CARBON_PRICE_EUR}/tCO₂e.`
 : `Sector has low CBAM exposure. Monitor EU carbon border regulation for future scope changes.`,
 };
}

// ---------------------------------------------------------------------------
// 4. Sensitivity Matrix Generator
// ---------------------------------------------------------------------------

/** Standard sensitivity shock scenarios */
interface ShockDefinition {
 readonly label: string;
 readonly costDriverKey: string;
 readonly shockPercent: number;
}

/** Default shocks applied across all sectors */
const DEFAULT_SHOCKS: readonly ShockDefinition[] = [
 { label: "Material costs rise 10%", costDriverKey: "material", shockPercent: 0.10 },
 { label: "Labor/overhead costs rise 8%", costDriverKey: "labor", shockPercent: 0.08 },
 { label: "Timeline delay (+20% duration)", costDriverKey: "time", shockPercent: 0.20 },
];

/**
 * Generate a 3-scenario sensitivity matrix.
 *
 * For each shock, the engine recalculates the P90 safe price under the
 * shocked cost and measures the margin impact.
 *
 * @param inputs - user inputs
 * @param riskProfile - sector risk profile
 * @param calculateNaiveCost - sector-specific naive cost calculator
 * @param targetMarginPercent - target margin %
 * @returns array of 3 sensitivity scenarios
 */
export function generateSensitivityMatrix(
 inputs: MarginCoreInputValues,
 riskProfile: MarginCoreRiskProfile,
 calculateNaiveCost: (inputs: MarginCoreInputValues) => number,
 targetMarginPercent: number,
): readonly SensitivityScenario[] {
 const baseNaive = calculateNaiveCost(inputs);
 const baseP90 = calculateP90SafeCost(baseNaive, riskProfile);
 const baseTargetRevenue = baseNaive / (1 - targetMarginPercent / 100);

 return DEFAULT_SHOCKS.map((shock) => {
 // Create shocked inputs - apply shock to numeric inputs proportionally
 const shockedInputs = applyShockToInputs(inputs, shock.shockPercent);
 const shockedNaive = calculateNaiveCost(shockedInputs);
const shockedP90 = calculateP90SafeCost(shockedNaive, riskProfile);

 const marginImpact = shockedP90 - baseP90;
 const suggestedSafePrice = shockedP90 / (1 - targetMarginPercent / 100);

 const severity: VerdictSeverity =
 marginImpact > baseTargetRevenue * 0.15
 ? "reject"
 : marginImpact > baseTargetRevenue * 0.05
 ? "caution"
 : "accept";

 return {
 scenario: shock.label,
 impactOnMargin: round2(marginImpact),
 suggestedSafePrice: round2(suggestedSafePrice),
 scenarioVerdict: severity,
 };
 });
}

/**
 * Apply a proportional shock to all numeric inputs.
 * This is a simplified model; sector-specific implementations can override.
 */
function applyShockToInputs(
 inputs: MarginCoreInputValues,
 shockPercent: number,
): MarginCoreInputValues {
 const shocked: MarginCoreInputValues = {};
 for (const [key, value] of Object.entries(inputs)) {
 if (typeof value === "number") {
 // Shock cost-related inputs upward
 const isCostInput =
 /cost|price|rate|fee|expense|overhead/i.test(key) &&
 !/margin|target|percent|quantity|count|time|freq|visit|staff|area|size|qty/i.test(key);

 shocked[key] = isCostInput ? value * (1 + shockPercent) : value;
 } else {
 shocked[key] = value;
 }
 }
 return shocked;
}

// ---------------------------------------------------------------------------
// 5. Macro Shock Expected Value
// ---------------------------------------------------------------------------

/**
 * Calculate the expected cost impact of macro-economic shocks.
 *
 * E[shock] = Σ (probability_i × impactMultiplier_i − 1) × baseCost
 */
export function calculateMacroShockExpectedValue(
 baseCost: number,
 riskProfile: MarginCoreRiskProfile,
): number {
 if (!riskProfile.macroShockVectors) return 0;

 let expectedImpact = 0;
 for (const shock of Object.values(riskProfile.macroShockVectors)) {
 expectedImpact +=
 shock.probability * (shock.impactMultiplier - 1) * baseCost;
 }
 return expectedImpact;
}

// ---------------------------------------------------------------------------
// 6. Verdict Resolver
// ---------------------------------------------------------------------------

/**
 * Determine the final verdict based on P90 safe price vs. quoted price.
 *
 * - ACCEPT: quoted price ≥ P90 safe price
 * - CAUTION: quoted price ≥ naive cost but < P90 safe price
 * - REJECT: quoted price < naive cost
 */
export function resolveVerdict(
 naiveCost: number,
 p90SafePrice: number,
 quotedPrice: number,
 labels: { accept: string; caution: string; reject: string },
): PremiumVerdict {
 if (quotedPrice >= p90SafePrice) {
 return {
 label: labels.accept,
 severity: "accept",
 suggestedAction: "Price covers P90 risk exposure. Safe to proceed.",
 };
 }

 if (quotedPrice >= naiveCost) {
 return {
 label: labels.caution,
 severity: "caution",
 suggestedAction: `Reprice to at least $${round2(p90SafePrice).toLocaleString()} to cover P90 risk buffer.`,
 };
 }

 return {
 label: labels.reject,
 severity: "reject",
 suggestedAction: `Do not accept below $${round2(naiveCost).toLocaleString()} - naive cost not covered. Minimum safe price: $${round2(p90SafePrice).toLocaleString()}.`,
 };
}

// ---------------------------------------------------------------------------
// 7. Main Engine - runMarginCoreEngine
// ---------------------------------------------------------------------------

/**
 * Run the full MarginCore engine pipeline.
 *
 * Pipeline:
 * 1. Calculate naive cost (sector-specific)
 * 2. Apply sector risk multipliers
 * 3. Calculate P90 safe cost
 * 4. Add CBAM shock (if applicable)
 * 5. Add macro shock expected value
 * 6. Detect margin leaks (sector-specific)
 * 7. Generate sensitivity matrix
 * 8. Resolve verdict
 * 9. Assemble PremiumVerdictReport
 */
export function runMarginCoreEngine(
 engineInput: MarginCoreEngineInput,
 quotedPrice?: number,
): PremiumVerdictReport {
 const {
 toolSlug,
 sectorSlug,
 inputs,
 riskProfile: baseRiskProfile,
 calculateNaiveCost,
 detectMarginLeaks,
 verdictLabels,
 targetMarginPercent,
 currency,
 legalDisclaimer,
 region = "EN",
 } = engineInput;

 const riskProfile = applyRegionalRiskProfileOverlay(baseRiskProfile, region);
 const regionalCarbonPrice = getRegionalCarbonPriceEur(region);

 // Step 1: Naive cost
 const naiveCost = calculateNaiveCost(inputs);

 // Step 2: Sector risk-adjusted cost
 const riskAdjustedCost = applySectorRiskMultipliers(naiveCost, riskProfile);

 // Step 3: P90 safe cost
 const p90Base = calculateP90SafeCost(riskAdjustedCost, riskProfile);

 // Step 4: CBAM shock
 const sectorEmissionFactor = getSectorEmissionFactor(sectorSlug);
 const cbamLiability = applyCBAMShock(
 naiveCost,
 sectorEmissionFactor,
 riskProfile.cbamExposureIndex,
 regionalCarbonPrice > 0 ? regionalCarbonPrice : undefined,
 );

 // Step 5: Macro shock expected value
 const macroShockEV = calculateMacroShockExpectedValue(naiveCost, riskProfile);

 // Final P90 safe price includes CBAM + macro
 const p90SafePrice = p90Base + cbamLiability + macroShockEV;

 // Step 6: Margin leak diagnosis
 const marginLeaks = detectMarginLeaks(inputs, naiveCost);
 const totalMarginLeak = marginLeaks.reduce((sum, l) => sum + l.leakAmount, 0);

 // Step 7: Sensitivity matrix
 const sensitivityMatrix = generateSensitivityMatrix(
 inputs,
 riskProfile,
 calculateNaiveCost,
 targetMarginPercent,
 );

 // Step 8: Verdict
 const effectiveQuotedPrice = quotedPrice ?? naiveCost;
 const verdict = resolveVerdict(
 naiveCost,
 p90SafePrice,
 effectiveQuotedPrice,
 verdictLabels,
 );

 // Step 9: CBAM breakdown
 const cbamBreakdown = buildCBAMBreakdown(
 naiveCost,
 riskProfile,
 sectorEmissionFactor,
 cbamLiability,
 );

 // Risk buffer
 const riskBufferAmount = p90SafePrice - naiveCost;
 const riskBufferPercent =
 naiveCost > 0 ? (riskBufferAmount / naiveCost) * 100 : 0;

 return {
 toolSlug,
 sectorSlug,
 generatedAt: new Date().toISOString(),
 naiveCost: round2(naiveCost),
 p90SafePrice: round2(p90SafePrice),
 riskBufferAmount: round2(riskBufferAmount),
 riskBufferPercent: round2(riskBufferPercent),
 verdict,
 marginLeakDiagnosis: marginLeaks,
 totalMarginLeak: round2(totalMarginLeak),
 sensitivityMatrix,
 cbamBreakdown,
 currency,
 legalDisclaimer,
 riskProfileUsed: riskProfile,
 };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Round to 2 decimal places */
function round2(n: number): number {
 return Math.round(n * 100) / 100;
}

/**
 * Sector emission factor lookup (tCO₂e per $1000 of output).
 * Based on IEA / EPA industry averages. Used as proxy for CBAM calculations.
 */
function getSectorEmissionFactor(sectorSlug: string): number {
 const factors: Record<string, number> = {
 "cnc-manufacturing": 0.45,
 "welding-fabrication": 0.52,
 "sheet-metal": 0.48,
 "3d-printing-service": 0.22,
 "construction": 0.38,
 "hvac": 0.30,
 "electrical-contracting": 0.18,
 "plumbing": 0.15,
 "roofing": 0.42,
 "painting": 0.12,
 "cleaning": 0.05,
 "landscaping-lawn-care": 0.08,
 "auto-repair-shop": 0.25,
 "restaurant": 0.10,
 "ecommerce": 0.06,
 "printing-signage": 0.20,
 "carpentry-millwork": 0.18,
 "logistics-transport": 0.55,
 "agriculture-crops": 0.35,
 "agriculture-irrigation": 0.28,
 "agriculture-feed": 0.40,
 "agriculture-dairy": 0.45,
 "energy-consumption": 0.60,
 "energy-carbon": 0.70,
 "daily-renovation": 0.25,
 "daily-fuel": 0.50,
 "daily-meals": 0.04,
 };

 return factors[sectorSlug] ?? 0;
}