/**
 * MarginCore Premium Decision Engine - Type Standards (v1.0)
 */

import type { RegionCode } from "@/config/regions";

// ---------------------------------------------------------------------------
// 1. Risk Profile - injected per-sector into the engine
// ---------------------------------------------------------------------------

/** Sector-specific risk multipliers keyed by cost driver name */
export type SectorRiskMultipliers = Record<string, number>;

/**
 * Stochastic + macroeconomic risk parameters for a sector.
 *
 * `baseVolatility` - coefficient of variation (σ/μ) for the sector.
 * Typical range 0.05 (stable) → 0.35 (volatile).
 * `sectorRiskMultipliers` - named driver → multiplier map.
 * e.g. { toolBreakage: 1.12, supplyChain: 1.08 }
 * `cbamExposureIndex` - Carbon Border Adjustment Mechanism exposure.
 * 0 = no exposure, 1 = full EU export exposure.
 * `macroShockVectors` - optional named macro shocks (e.g. oil, labour).
 */
export interface MarginCoreRiskProfile {
 /** Coefficient of variation for the sector (σ/μ) */
 readonly baseVolatility: number;

 /** Named cost-driver → risk multiplier */
 readonly sectorRiskMultipliers: SectorRiskMultipliers;

 /** CBAM carbon-border exposure index (0–1) */
 readonly cbamExposureIndex: number;

 /** Optional macro-economic shock vectors */
 readonly macroShockVectors?: Readonly<Record<string, MacroShockVector>>;
}

/** A single macro-economic shock definition */
export interface MacroShockVector {
 /** Human-readable label (e.g. "Oil price spike") */
 readonly label: string;
 /** Probability of occurrence in a given quarter (0–1) */
 readonly probability: number;
 /** Cost impact multiplier when shock occurs (e.g. 1.15 = +15%) */
 readonly impactMultiplier: number;
}

// ---------------------------------------------------------------------------
// 2. Sensitivity Matrix - what-if scenarios
// ---------------------------------------------------------------------------

/** Single row of the sensitivity matrix */
export interface SensitivityScenario {
 /** Scenario description (e.g. "Material costs rise 10%") */
 readonly scenario: string;

 /** Margin impact in absolute currency (negative = erosion) */
 readonly impactOnMargin: number;

 /** Suggested safe price under this scenario */
 readonly suggestedSafePrice: number;

 /** Verdict under this scenario */
 readonly scenarioVerdict: VerdictSeverity;
}

// ---------------------------------------------------------------------------
// 3. Margin Leak Diagnosis
// ---------------------------------------------------------------------------

/** Single diagnosed margin leak */
export interface MarginLeakItem {
 /** Leak driver name (e.g. "Tooling wear", "Waste rate") */
 readonly driver: string;

 /** Estimated annual / per-job leak amount in currency */
 readonly leakAmount: number;

 /** Severity: how much this driver erodes target margin */
 readonly severity: "low" | "medium" | "high" | "critical";

 /** Suggested mitigation action */
 readonly suggestedAction: string;
}

// ---------------------------------------------------------------------------
// 4. CBAM / Carbon Cost
// ---------------------------------------------------------------------------

/** Carbon border adjustment cost breakdown */
export interface CBAMCostBreakdown {
 /** Sector emission factor (tCO₂e per unit of output) */
 readonly emissionFactor: number;

 /** Estimated carbon price per tonne (EUR) */
 readonly carbonPricePerTonne: number;

 /** Total CBAM liability in base currency */
 readonly cbamLiability: number;

 /** Whether the sector is currently in CBAM scope */
 readonly inScope: boolean;

 /** Human-readable CBAM summary */
 readonly summary: string;
}

// ---------------------------------------------------------------------------
// 5. Verdict
// ---------------------------------------------------------------------------

/** Canonical verdict severity levels */
export type VerdictSeverity = "accept" | "caution" | "reject";

/** Verdict with label + severity */
export interface PremiumVerdict {
 /** Human-readable label (sector-specific, e.g. "SAFE TO QUOTE") */
 readonly label: string;

 /** Machine-readable severity */
 readonly severity: VerdictSeverity;

 /** One-line action recommendation */
 readonly suggestedAction: string;
}

// ---------------------------------------------------------------------------
// 6. Premium Verdict Report - canonical output
// ---------------------------------------------------------------------------

/**
 * The single canonical return type for ALL MarginCore premium analyzers.
 *
 * UI components (`PremiumDecisionReportPanel`, `ExportToolbar`, PDF generator)
 * consume this type exclusively.
 */
export interface PremiumVerdictReport {
 /** Tool slug that generated this report */
 readonly toolSlug: string;

 /** Sector slug */
 readonly sectorSlug: string;

 /** Timestamp (ISO 8601) */
 readonly generatedAt: string;

 // ── Cost breakdown ────────────────────────────────────────────────────
 /** Naive (base) cost before risk adjustments */
 readonly naiveCost: number;

 /** P90 safe price - the minimum price at 90th-percentile confidence */
 readonly p90SafePrice: number;

 /** Risk buffer amount (p90SafePrice − naiveCost) */
 readonly riskBufferAmount: number;

 /** Risk buffer as percentage of naive cost */
 readonly riskBufferPercent: number;

 // ── Verdict ───────────────────────────────────────────────────────────
 /** Primary verdict */
 readonly verdict: PremiumVerdict;

 // ── Margin leak diagnosis ─────────────────────────────────────────────
 /** Ordered list of diagnosed margin leaks (worst first) */
 readonly marginLeakDiagnosis: readonly MarginLeakItem[];

 /** Total estimated margin leak across all drivers */
 readonly totalMarginLeak: number;

 // ── Sensitivity matrix ────────────────────────────────────────────────
 /** 3-scenario what-if sensitivity matrix */
 readonly sensitivityMatrix: readonly SensitivityScenario[];

 // ── CBAM / Carbon ─────────────────────────────────────────────────────
 /** CBAM cost breakdown (null if sector has no carbon exposure) */
 readonly cbamBreakdown: CBAMCostBreakdown | null;

 // ── Metadata ──────────────────────────────────────────────────────────
 /** Currency code (ISO 4217) */
 readonly currency: string;

 /** Legal disclaimer text */
 readonly legalDisclaimer: string;

 /** Risk profile snapshot used for this calculation */
 readonly riskProfileUsed: MarginCoreRiskProfile;
}

// ---------------------------------------------------------------------------
// 7. Engine Input - normalized input bag
// ---------------------------------------------------------------------------

/** Named numeric inputs from the tool form */
export type MarginCoreInputValues = Record<string, number | string>;

/**
 * Normalized input bag passed into the MarginCore engine.
 * Combines user inputs + sector risk profile + tool configuration.
 */
export interface MarginCoreEngineInput {
 /** Tool slug */
 readonly toolSlug: string;

 /** Sector slug */
 readonly sectorSlug: string;

 /** Raw user inputs */
 readonly inputs: MarginCoreInputValues;

 /** Sector risk profile */
 readonly riskProfile: MarginCoreRiskProfile;

 /** Sector-specific cost calculator (pure function) */
 readonly calculateNaiveCost: (inputs: MarginCoreInputValues) => number;

 /** Sector-specific margin leak detectors */
 readonly detectMarginLeaks: (
 inputs: MarginCoreInputValues,
 naiveCost: number,
 ) => MarginLeakItem[];

 /** Sector-specific verdict labels */
 readonly verdictLabels: {
 readonly accept: string;
 readonly caution: string;
 readonly reject: string;
 };

 /** Target margin percentage (from user input or sector default) */
 readonly targetMarginPercent: number;

  /** Currency code */
  readonly currency: string;

  /** Legal disclaimer */
  readonly legalDisclaimer: string;

  /** Operating region for compliance coefficients (TR | DE | EN) */
  readonly region?: RegionCode;
}

// ---------------------------------------------------------------------------
// 8. Sector Risk Profile Factory
// ---------------------------------------------------------------------------

/**
 * Factory function signature for sector-specific risk profile builders.
 * Each sector module exports one of these.
 */
export type SectorRiskProfileFactory = () => MarginCoreRiskProfile;