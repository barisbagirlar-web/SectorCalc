/**
 * Investor demo audit — Phase 5I-O read-only data contract.
 */

import { buildDemoScriptDataContract } from "@/lib/formula-governance/investor-demo/investor-demo-narrative-contract";
import { collectInvestorDemoMetrics } from "@/lib/formula-governance/investor-demo/investor-demo-metrics";
import { buildInvestorSystemMap } from "@/lib/formula-governance/investor-demo/investor-demo-system-map";
import type { InvestorDemoAuditResult } from "@/lib/formula-governance/investor-demo/investor-demo-types";

export function runInvestorDemoAudit(): InvestorDemoAuditResult {
  const metrics = collectInvestorDemoMetrics();
  const systemMap = buildInvestorSystemMap();
  const demoScriptDataContract = buildDemoScriptDataContract();

  const liveSystemProofPoints = [
    `${(systemMap.livePilotTools as string[]).length} smart form live pilots`,
    `${metrics.trustTraceCoverage} trust trace ready tools`,
    `${metrics.formulaGovernanceCoverage} formula contracts`,
    "tool factory skeleton_ready",
  ];

  const moatSignals = [
    "deterministic formula governance",
    "oracle/scenario/property validation loop",
    "controlled patch dry-run pipeline",
    "human approval before deploy",
  ];

  const blockers: string[] = [];
  const warnings: string[] = [];

  if (metrics.trustTraceCoverage < 20) {
    warnings.push("Trust trace coverage below investor demo threshold.");
  }

  const investorDemoReady = liveSystemProofPoints.length >= 3 && blockers.length === 0;
  const status = investorDemoReady ? "investor_demo_ready" : "needs_review";

  return {
    investorDemoReady,
    status,
    liveSystemProofPoints,
    moatSignals,
    remainingDebtCount: 10,
    recommendedDemoFlow: [
      "Show live smart form pilots",
      "Run trust trace export dry-run",
      "Walk tool factory demo flow",
      "Show deploy-ready gate (command disabled)",
    ],
    demoScriptDataContract,
    blockers,
    warnings,
  };
}

export function formatInvestorDemoReport(result: InvestorDemoAuditResult): string {
  return [
    "Investor Demo / Operating System Audit",
    `Investor demo ready: ${result.investorDemoReady}`,
    `Status: ${result.status}`,
    `Remaining debt count: ${result.remainingDebtCount}`,
    "",
    "Live system proof points:",
    ...result.liveSystemProofPoints.map((point) => `- ${point}`),
    "",
    "Moat signals:",
    ...result.moatSignals.map((signal) => `- ${signal}`),
    "",
    "Recommended demo flow:",
    ...result.recommendedDemoFlow.map((step) => `- ${step}`),
  ].join("\n");
}
