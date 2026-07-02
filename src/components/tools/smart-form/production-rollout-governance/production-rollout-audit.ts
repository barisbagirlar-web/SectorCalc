/**
 * Smart form production rollout governance audit - Phase 5I-L read-only.
 */

import {
  isProductionRolloutApproved,
  PRODUCTION_ROLLOUT_DEPLOY_REQUIRED_DEFAULT,
} from "@/components/tools/smart-form/production-rollout-governance/production-rollout-approval";
import { validateProductionRolloutScope } from "@/components/tools/smart-form/production-rollout-governance/production-rollout-risk-gate";
import { buildProductionRolloutScope } from "@/components/tools/smart-form/production-rollout-governance/production-rollout-scope";
import type { ProductionRolloutGovernanceAuditResult } from "@/components/tools/smart-form/production-rollout-governance/production-rollout-types";

export function runProductionRolloutGovernanceAudit(): ProductionRolloutGovernanceAuditResult {
  const entries = buildProductionRolloutScope();
  const { blockers, warnings } = validateProductionRolloutScope(entries);

  return {
    livePilotCount: entries.filter((e) => e.status === "live_pilot").length,
    candidateCount: entries.filter((e) => e.status !== "blocked").length,
    stagingOnlyCount: entries.filter((e) => e.status === "staging_only").length,
    previewOnlyCount: entries.filter((e) => e.status === "preview_only").length,
    productionRolloutApproved: isProductionRolloutApproved(),
    deployRequired: PRODUCTION_ROLLOUT_DEPLOY_REQUIRED_DEFAULT,
    blockers,
    warnings,
    entries,
  };
}

export function formatProductionRolloutGovernanceReport(
  result: ProductionRolloutGovernanceAuditResult,
): string {
  return [
    "Smart Form Production Rollout Governance Audit",
    `Live pilot count: ${result.livePilotCount}`,
    `Candidate count: ${result.candidateCount}`,
    `Staging only: ${result.stagingOnlyCount}`,
    `Preview only: ${result.previewOnlyCount}`,
    `Production rollout approved: ${result.productionRolloutApproved}`,
    `Deploy required: ${result.deployRequired}`,
    `Blockers: ${result.blockers.length}`,
  ].join("\n");
}
