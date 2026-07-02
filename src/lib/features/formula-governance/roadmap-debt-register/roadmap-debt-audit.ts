/**
 * Roadmap debt audit - Phase 5I-Q read-only debt register.
 */

import { buildDebtRegister } from "@/lib/features/formula-governance/roadmap-debt-register/debt-register-builder";
import {
  buildFullProductizationPath,
  buildInvestorDemoMinimumPath,
  compressRoadmapToNext3Batches,
} from "@/lib/features/formula-governance/roadmap-debt-register/roadmap-compressor";
import type { RoadmapDebtAuditResult } from "@/lib/features/formula-governance/roadmap-debt-register/debt-register-types";

export function runRoadmapDebtAudit(): RoadmapDebtAuditResult {
  const entries = buildDebtRegister();

  return {
    totalRemainingDebt: entries.length,
    criticalDebt: entries.filter((e) => e.severity === "critical").length,
    highDebt: entries.filter((e) => e.severity === "high").length,
    mediumDebt: entries.filter((e) => e.severity === "medium").length,
    next3Batches: compressRoadmapToNext3Batches(),
    investorDemoMinimumPath: buildInvestorDemoMinimumPath(),
    fullProductizationPath: buildFullProductizationPath(),
    entries,
    blockers: [],
    warnings: [],
  };
}

export function formatRoadmapDebtReport(result: RoadmapDebtAuditResult): string {
  return [
    "Roadmap Debt Register Audit",
    `Total remaining debt: ${result.totalRemainingDebt}`,
    `Critical: ${result.criticalDebt} | High: ${result.highDebt} | Medium: ${result.mediumDebt}`,
    "",
    "Next 3 batches:",
    ...result.next3Batches.map((batch) => `- ${batch.batchId}: ${batch.title}`),
    "",
    "Investor demo minimum path:",
    ...result.investorDemoMinimumPath.map((step) => `- ${step}`),
    "",
    "Full productization path:",
    ...result.fullProductizationPath.map((step) => `- ${step}`),
  ].join("\n");
}
