/**
 * Investor demo / operating system types - Phase 5I-O data contract only.
 */

export type InvestorDemoStatus = "investor_demo_ready" | "needs_review" | "blocked";

export type RemainingDebtEntry = {
  readonly id: string;
  readonly category: string;
  readonly severity: "critical" | "high" | "medium";
  readonly description: string;
};

export type InvestorDemoAuditResult = {
  readonly investorDemoReady: boolean;
  readonly status: InvestorDemoStatus;
  readonly liveSystemProofPoints: readonly string[];
  readonly moatSignals: readonly string[];
  readonly remainingDebtCount: number;
  readonly recommendedDemoFlow: readonly string[];
  readonly demoScriptDataContract: Readonly<Record<string, unknown>>;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};
