/**
 * SectorCalc Premium Tool Contract v1 — canonical types.
 *
 * Distinct from `@/lib/calculators/premium-types` (legacy scenario/report copy).
 * Consumed by `premium-tool-contracts.ts` and `premium-decision-engine.ts`.
 *
 * Architecture Reset v1: premium tools are loss / measurement / optimization
 * decision reports — not quote-only calculators.
 */

import type {
  PremiumArchitectureProfile,
  PremiumFieldPanel,
} from "@/lib/premium/premium-architecture";

/** Machine-readable verdict severity for premium decision reports. */
export type PremiumSeverity = "accept" | "caution" | "reject";

/** Human-facing verdict with action guidance. */
export interface PremiumVerdict {
 readonly severity: PremiumSeverity;
 readonly label: string;
 readonly suggestedAction: string;
}

/** Input field kinds aligned with revenue tool paidInputs. */
export type PremiumInputKind = "number" | "currency" | "percent" | "select";

/** Declarative paid-input spec for a premium analyzer contract. */
export interface PremiumInputSpec {
 readonly key: string;
 readonly label: string;
 readonly kind: PremiumInputKind;
 readonly unit?: string;
 readonly required: boolean;
 readonly defaultValue?: number | string;
 readonly helperText?: string;
 readonly options?: readonly { readonly value: string; readonly label: string }[];
}

/** Hidden operating variable applied as a cost multiplier in the decision engine. */
export interface PremiumHiddenVariable {
 readonly id: string;
 readonly label: string;
 readonly description: string;
 readonly defaultMultiplier: number;
}

/** Tolerance / precision rule that can tighten cost when triggered. */
export interface PremiumToleranceRule {
 readonly id: string;
 readonly label: string;
 readonly description: string;
 readonly costMultiplier: number;
 readonly triggerDescription: string;
}

/** Full product contract for one premium analyzer slug. */
export interface PremiumToolContract {
 readonly slug: string;
 readonly sectorSlug: string;
 readonly title: string;
 readonly promise: string;
 readonly inputs: readonly PremiumInputSpec[];
 readonly hiddenVariables: readonly PremiumHiddenVariable[];
 readonly toleranceRules: readonly PremiumToleranceRule[];
 /** Target margin as decimal 0–1 (e.g. 0.22 = 22%). */
 readonly targetMarginDefault: number;
 /** Base cost volatility as decimal (σ = adjustedCost × volatilityDefault). */
 readonly volatilityDefault: number;
 readonly primaryMetricLabel: string;
 readonly reportSections: readonly string[];
}

/** Diagnosed hidden cost driver surfaced in the decision report. */
export interface PremiumLossDriver {
 readonly id: string;
 readonly label: string;
 readonly amount: number;
 readonly amountDisplay: string;
 readonly explanation: string;
}

/** One-row what-if sensitivity result. */
export interface PremiumSensitivityRow {
 readonly factor: string;
 readonly shockPercent: number;
 readonly adjustedCost: number;
 readonly adjustedCostDisplay: string;
 readonly minimumSafePrice: number;
 readonly minimumSafePriceDisplay: string;
 readonly impactSummary: string;
}

/** Canonical premium decision report (contract engine output). */
export interface PremiumDecisionReport {
 readonly toolSlug: string;
 readonly sectorSlug: string;
 readonly generatedAt: string;
 readonly contractTitle: string;
 readonly primaryMetricLabel: string;
 readonly primaryMetricValue: string;
 readonly baseCost: number;
 readonly baseCostDisplay: string;
 readonly hiddenMultiplier: number;
 readonly adjustedCost: number;
 readonly adjustedCostDisplay: string;
 readonly volatilityBuffer: number;
 readonly volatilityBufferDisplay: string;
 readonly p90Cost: number;
 readonly p90CostDisplay: string;
 readonly minimumSafePrice: number;
 readonly minimumSafePriceDisplay: string;
 readonly quotedPrice: number | null;
 readonly quotedPriceDisplay: string | null;
 readonly targetMargin: number;
 readonly targetMarginDisplay: string;
 readonly verdict: PremiumVerdict;
 readonly hiddenLossDrivers: readonly PremiumLossDriver[];
 readonly sensitivity: readonly PremiumSensitivityRow[];
 readonly summary: string;
 readonly recommendation: string;
 readonly reportSections: readonly { readonly title: string; readonly body: string }[];
 readonly legalNote: string;
 /** Architecture Reset v1 — loss-family context and 3-second field panel. */
 readonly architecture: {
  readonly profile: PremiumArchitectureProfile;
  readonly fieldPanel: PremiumFieldPanel;
 };
}
