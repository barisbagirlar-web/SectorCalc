/**
 * Production readiness report formatter — Phase 5I-P.
 */

import { collectProductionReadinessGates } from "@/lib/features/formula-governance/production-readiness/production-readiness-runner";
import { computeReadinessScore } from "@/lib/features/formula-governance/production-readiness/production-readiness-score";
import type { ProductionReadinessAuditResult } from "@/lib/features/formula-governance/production-readiness/production-readiness-types";
import { runInvestorDemoAudit } from "@/lib/features/formula-governance/investor-demo/investor-demo-audit";
import { runBatchDeployReadyAudit } from "@/lib/features/formula-governance/tool-factory-orchestrator/human-approval/deploy-ready-audit";
import { runToolFactoryOrchestratorAudit } from "@/lib/features/formula-governance/tool-factory-orchestrator/tool-factory-audit";
import { ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_ROUTE_SLUGS } from "@/components/tools/smart-form/rollout-batch-h-catalog";

export function runProductionReadinessAudit(): ProductionReadinessAuditResult {
  const gateResults = collectProductionReadinessGates();
  const readinessScore = computeReadinessScore(gateResults);
  const investor = runInvestorDemoAudit();
  const factory = runToolFactoryOrchestratorAudit();
  const deployReady = runBatchDeployReadyAudit();

  const blockedAreas = Object.entries(gateResults)
    .filter(([, passed]) => !passed)
    .map(([gate]) => gate);

  const productionLiveProof = ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_ROUTE_SLUGS.map(
    (slug) => `/tools/free/${slug}`,
  );

  return {
    readinessScore,
    productionLiveProof: [...productionLiveProof],
    blockedAreas,
    topRisks: blockedAreas.slice(0, 5).map((area) => `${area} gate not passed`),
    nextActions: [
      "Complete human approval for deploy-ready candidates",
      "Expand smart form rollout to staging-only candidates",
      "Run remediation batch 1 controlled apply gate review",
    ],
    investorDemoReady: investor.investorDemoReady,
    toolFactoryReady: factory.status === "skeleton_ready",
    deploySafetyReady: deployReady.commandAllowedCount === 0,
    gateResults,
    blockers: blockedAreas.map((area) => `Gate failed: ${area}`),
    warnings: investor.warnings,
  };
}

export function formatProductionReadinessReport(result: ProductionReadinessAuditResult): string {
  return [
    "Production Readiness Master Audit",
    `Readiness score: ${result.readinessScore}`,
    `Investor demo ready: ${result.investorDemoReady}`,
    `Tool factory ready: ${result.toolFactoryReady}`,
    `Deploy safety ready: ${result.deploySafetyReady}`,
    `Blocked areas: ${result.blockedAreas.length}`,
    "",
    "Production live proof:",
    ...result.productionLiveProof.map((route) => `- ${route}`),
    "",
    "Top risks:",
    ...result.topRisks.map((risk) => `- ${risk}`),
    "",
    "Next actions:",
    ...result.nextActions.map((action) => `- ${action}`),
  ].join("\n");
}
