/**
 * Production readiness master audit types — Phase 5I-P.
 */

export type ProductionReadinessAuditResult = {
  readonly readinessScore: number;
  readonly productionLiveProof: readonly string[];
  readonly blockedAreas: readonly string[];
  readonly topRisks: readonly string[];
  readonly nextActions: readonly string[];
  readonly investorDemoReady: boolean;
  readonly toolFactoryReady: boolean;
  readonly deploySafetyReady: boolean;
  readonly gateResults: Readonly<Record<string, boolean>>;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};
