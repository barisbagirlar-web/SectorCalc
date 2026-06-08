/**
 * Full tool audit scorer — deterministic read-only scoring (Phase 5H-J).
 */

import type { FullToolAuditItem } from "@/lib/formula-governance/full-tool-audit/full-tool-audit-types";

export type ScoreFullToolAuditInput = {
  readonly hasFormulaContract: boolean;
  readonly hasProductionLocator: boolean;
  readonly oraclePass: boolean;
  readonly inputDesignProfessionalReady: boolean;
  readonly inputDesignUsable: boolean;
  readonly trustTraceReady: boolean;
  readonly smartFormReady: boolean;
  readonly reportReady: boolean;
  readonly blockerCount: number;
};

export function scoreFullToolAudit(input: ScoreFullToolAuditInput): number {
  let score = 0;

  if (input.hasFormulaContract) {
    score += 15;
  }
  if (input.hasProductionLocator) {
    score += 20;
  }
  if (input.oraclePass) {
    score += 20;
  }
  if (input.inputDesignProfessionalReady) {
    score += 15;
  } else if (input.inputDesignUsable) {
    score += 8;
  }
  if (input.trustTraceReady) {
    score += 10;
  }
  if (input.smartFormReady) {
    score += 10;
  }
  if (input.reportReady) {
    score += 10;
  }

  if (input.blockerCount > 0) {
    score = Math.min(score, 40);
  }

  return Math.max(0, Math.min(100, score));
}

export function buildReadinessFromScore(
  item: Pick<
    FullToolAuditItem,
    | "hasProductionLocator"
    | "oracleStatus"
    | "trustTraceStatus"
    | "smartFormStatus"
    | "reportStatus"
    | "blockers"
  >,
): FullToolAuditItem["readiness"] {
  const productionSafe =
    item.hasProductionLocator &&
    item.oracleStatus === "PASS" &&
    item.blockers.length === 0;

  const smartFormReady =
    item.smartFormStatus === "live_pilot" || item.smartFormStatus === "batch_eligible";

  const reportReady =
    item.trustTraceStatus === "trust_trace_ready" || item.reportStatus === "export_ready";

  const factoryReady =
    productionSafe && item.trustTraceStatus !== "blocked" && item.trustTraceStatus !== "missing";

  return {
    productionSafe,
    smartFormReady,
    reportReady,
    factoryReady,
  };
}
