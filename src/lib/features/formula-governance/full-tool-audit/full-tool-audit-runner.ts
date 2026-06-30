/**
 * Full existing tool audit runner — Phase 5H-J read-only batch.
 */

import { FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts";
import { runBatchInputDesignAudit } from "@/lib/features/formula-governance/input-design-audit/batch-input-design-audit";
import { isPremiumContract } from "@/lib/features/formula-governance/input-design-audit/input-design-helpers";
import { buildExistingToolMigrationPlan } from "@/lib/features/formula-governance/input-design-audit/migration-plan/migration-planner";
import {
  buildReadinessFromScore,
  scoreFullToolAudit,
} from "@/lib/features/formula-governance/full-tool-audit/full-tool-audit-scorer";
import {
  buildRecommendedBatches,
  buildTop10QuickWins,
  buildTop10Risks,
  resolveRecommendedAction,
} from "@/lib/features/formula-governance/full-tool-audit/full-tool-audit-priority";
import type {
  FullExistingToolAuditResult,
  FullToolAuditItem,
} from "@/lib/features/formula-governance/full-tool-audit/full-tool-audit-types";
import { buildFormulaInventory } from "@/lib/features/formula-governance/inventory";
import { auditOracleComparisonForSlug } from "@/lib/features/formula-governance/oracle/compare-production-oracle";
import { getAnyProductionFormulaLocator } from "@/lib/features/formula-governance/oracle/production-formula-locator";
import { runBatchAlignmentAudit } from "@/lib/features/formula-governance/requirement-engine/batch-alignment-audit";
import { runBatchTrustTraceAudit } from "@/lib/features/formula-governance/trust-trace-report/batch-trust-trace-audit";
import type { FormulaContract, FormulaToolTier } from "@/lib/features/formula-governance/types";
import {
  getRolloutBatchHEligibleToolDefinitions,
  ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_GOVERNANCE_SLUGS,
} from "@/components/tools/smart-form/rollout-batch-h-catalog";

function resolveTier(contract: FormulaContract): FormulaToolTier {
  if (isPremiumContract(contract)) {
    return contract.toolId.includes("premium-schema") ? "premium-schema" : "premium";
  }
  if (contract.toolId.includes("revenue-free")) {
    return "revenue-free";
  }
  if (contract.toolId.includes("revenue-premium")) {
    return "revenue-premium";
  }
  if (contract.toolId.includes("free-traffic")) {
    return "free";
  }
  return "other";
}

function resolveSmartFormStatus(slug: string): string {
  if ((ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_GOVERNANCE_SLUGS as readonly string[]).includes(slug)) {
    return "live_pilot";
  }
  if (getRolloutBatchHEligibleToolDefinitions().some((tool) => tool.governanceSlug === slug)) {
    return "batch_eligible";
  }
  return "not_eligible";
}

function resolveRouteStatus(slug: string, hasProductionLocator: boolean): string {
  if ((ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_GOVERNANCE_SLUGS as readonly string[]).includes(slug)) {
    return "production_live_route";
  }
  if (hasProductionLocator) {
    return "production_locator_registered";
  }
  return "no_production_locator";
}

export function runFullExistingToolAudit(
  contracts: readonly FormulaContract[] = FORMULA_CONTRACTS,
  rootDir: string = process.cwd(),
): FullExistingToolAuditResult {
  const inventoryEntries = buildFormulaInventory(rootDir);
  const inputDesignAudit = runBatchInputDesignAudit({ contracts });
  const alignmentAudit = runBatchAlignmentAudit({ contracts });
  const migrationPlan = buildExistingToolMigrationPlan({
    inputDesignAudit,
    alignmentAudit,
    contracts,
  });
  const trustTraceAudit = runBatchTrustTraceAudit({ contracts });

  const items: FullToolAuditItem[] = [];

  for (const contract of contracts) {
    const inventoryEntry = inventoryEntries.find((entry) => entry.slug === contract.slug);
    const inputDesign = inputDesignAudit.summaries.find((summary) => summary.slug === contract.slug);
    const migrationItem = migrationPlan.items.find((item) => item.slug === contract.slug);
    const trustReport = trustTraceAudit.reports.find((report) => report.slug === contract.slug);
    const oracleSummary = auditOracleComparisonForSlug(contract.slug);
    const locator = getAnyProductionFormulaLocator(contract.slug);

    const blockers = [
      ...(inputDesign?.blockers ?? []),
      ...(trustReport?.blockers ?? []),
    ];
    const warnings = [
      ...(inputDesign?.warnings ?? []),
      ...(trustReport?.warnings ?? []),
    ];

    const score = scoreFullToolAudit({
      hasFormulaContract: true,
      hasProductionLocator: locator !== undefined,
      oraclePass: oracleSummary?.status === "PASS",
      inputDesignProfessionalReady: inputDesign?.status === "professional_ready",
      inputDesignUsable: inputDesign?.status === "usable",
      trustTraceReady: trustReport?.status === "trust_trace_ready",
      smartFormReady: resolveSmartFormStatus(contract.slug) !== "not_eligible",
      reportReady: trustReport?.reportExportReadiness.pdfReady ?? false,
      blockerCount: blockers.length,
    });

    const partialItem = {
      slug: contract.slug,
      title: contract.toolName,
      tier: resolveTier(contract),
      category: inventoryEntry?.category ?? "uncategorized",
      hasFormulaContract: true,
      hasProductionLocator: locator !== undefined,
      oracleStatus: oracleSummary?.status ?? "NOT_WIRED",
      scenarioStatus: trustReport?.scenarioCoverage.status ?? "missing",
      propertyStatus: trustReport?.propertyCoverage.status ?? "missing",
      inputDesignStatus: inputDesign?.status ?? ("missing" as const),
      smartFormStatus: resolveSmartFormStatus(contract.slug),
      trustTraceStatus: trustReport?.status ?? ("missing" as const),
      migrationStatus: migrationItem?.recommendedPatchLevel ?? ("missing" as const),
      routeStatus: resolveRouteStatus(contract.slug, locator !== undefined),
      reportStatus: trustReport?.reportExportReadiness.pdfReady ? "export_ready" : "needs_review",
      blockers,
      warnings,
      score,
      readiness: buildReadinessFromScore({
        hasProductionLocator: locator !== undefined,
        oracleStatus: oracleSummary?.status ?? "NOT_WIRED",
        trustTraceStatus: trustReport?.status ?? "missing",
        smartFormStatus: resolveSmartFormStatus(contract.slug),
        reportStatus: trustReport?.reportExportReadiness.pdfReady ? "export_ready" : "needs_review",
        blockers,
      }),
      recommendedAction: "no_action" as const,
    };

    items.push({
      ...partialItem,
      recommendedAction: resolveRecommendedAction({
        ...partialItem,
        readiness: partialItem.readiness,
      }),
    });
  }

  const recommendedBatches = buildRecommendedBatches(items);

  return {
    totalTools: items.length,
    productionSafeCount: items.filter((item) => item.readiness.productionSafe).length,
    smartFormReadyCount: items.filter((item) => item.readiness.smartFormReady).length,
    trustTraceReadyCount: items.filter((item) => item.trustTraceStatus === "trust_trace_ready").length,
    reportReadyCount: items.filter((item) => item.readiness.reportReady).length,
    blockedCount: items.filter((item) => item.recommendedAction === "blocked_manual_review").length,
    recommendedBatches,
    top10Risks: buildTop10Risks(items),
    top10QuickWins: buildTop10QuickWins(items),
    items,
    warnings: [...inputDesignAudit.warnings, ...trustTraceAudit.warnings],
    blockers: [...inputDesignAudit.blockers, ...trustTraceAudit.blockers],
  };
}
