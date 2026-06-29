/**
 * Single trust trace report audit — Phase 5H-I read-only.
 */

import { getControlledInputDesignPatch } from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import { isPremiumContract } from "@/lib/formula-governance/input-design-audit/input-design-helpers";
import { getAnyProductionFormulaLocator } from "@/lib/formula-governance/oracle/production-formula-locator";
import {
  buildOracleCoverageTrace,
  buildPropertyCoverageTrace,
  buildScenarioCoverageTrace,
} from "@/lib/formula-governance/trust-trace-report/trust-trace-coverage";
import { buildTrustTraceReport } from "@/lib/formula-governance/trust-trace-report/trust-trace-builder";
import type { TrustTraceReport } from "@/lib/formula-governance/trust-trace-report/trust-trace-types";
import type { ToolInputDesignAuditResult } from "@/lib/formula-governance/input-design-audit/input-design-audit-types";
import type { ToolMigrationPlanItem } from "@/lib/formula-governance/input-design-audit/migration-plan/migration-plan-types";
import type { BatchAlignmentSummary } from "@/lib/formula-governance/requirement-engine/batch-alignment-audit";
import type { FormulaContract, FormulaToolTier } from "@/lib/formula-governance/types";
import {
  ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_GOVERNANCE_SLUGS,
} from "@/components/tools/smart-form/rollout-batch-h-catalog";
import { getRolloutBatchHEligibleToolDefinitions } from "@/components/tools/smart-form/rollout-batch-h-catalog";

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

function isSmartFormPilotLive(slug: string): boolean {
  return (ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_GOVERNANCE_SLUGS as readonly string[]).includes(slug);
}

function isSmartFormBatchEligible(slug: string): boolean {
  return getRolloutBatchHEligibleToolDefinitions().some((tool) => tool.governanceSlug === slug);
}

export type AuditTrustTraceReportParams = {
  readonly contract: FormulaContract;
  readonly inputDesignSummary?: ToolInputDesignAuditResult;
  readonly migrationItem?: ToolMigrationPlanItem;
  readonly alignmentSummary?: BatchAlignmentSummary;
};

export function auditTrustTraceReport(params: AuditTrustTraceReportParams): TrustTraceReport {
  const { contract, inputDesignSummary, migrationItem, alignmentSummary } = params;
  const patch = getControlledInputDesignPatch(contract.slug);
  const locator = getAnyProductionFormulaLocator(contract.slug);
  const hasProductionAssumptionLine = contract.assumptions.some((line) =>
    line.startsWith("Production:"),
  );

  const warningPolicy = contract.warningPolicy;
  const warningTrace = warningPolicy
    ? [...warningPolicy.hardFailWarnings, ...warningPolicy.futureExtensions]
    : contract.missingParameterWarnings;

  const limitationTrace = warningPolicy
    ? [...warningPolicy.modelLimitations]
    : contract.assumptions.filter((line) => line.toLowerCase().includes("model limitation"));

  const acceptedAssumptions = warningPolicy
    ? [...warningPolicy.acceptedAssumptions]
    : patch?.defaultAssumptions ?? [];

  return buildTrustTraceReport({
    slug: contract.slug,
    title: contract.toolName,
    tier: resolveTier(contract),
    riskLevel: contract.riskLevel,
    requiredInputs: contract.requiredInputs,
    criticalInputs: contract.criticalInputs,
    optionalInputs: patch?.optionalInputs ?? inputDesignSummary?.missingAdvancedInputs,
    advancedInputs: patch?.advancedInputs,
    defaultedInputs: inputDesignSummary ? [] : undefined,
    acceptedAssumptions,
    derivedFields: patch?.derivedInputs,
    validationRules: contract.validationRules.map((rule) => `${rule.id}: ${rule.description}`),
    formulaContractLines: [
      `toolId: ${contract.toolId}`,
      `purpose: ${contract.purpose}`,
      `userDecision: ${contract.userDecision}`,
      `formulaSummary: ${contract.formulaSummary}`,
    ],
    ontologyLines: alignmentSummary
      ? [
          `alignment: ${alignmentSummary.status}`,
          `migrationRisk: ${alignmentSummary.migrationRiskScore}`,
          `action: ${alignmentSummary.recommendedAction}`,
        ]
      : ["alignment: not_evaluated"],
    requirementEngineLines: inputDesignSummary
      ? [
          `inputDesign: ${inputDesignSummary.status}`,
          `sufficiency: ${inputDesignSummary.inputSufficiencyScore}`,
          `depth: ${inputDesignSummary.professionalDepthScore}`,
        ]
      : ["requirementEngine: not_evaluated"],
    oracleCoverage: buildOracleCoverageTrace(contract.slug),
    scenarioCoverage: buildScenarioCoverageTrace(contract),
    propertyCoverage: buildPropertyCoverageTrace(contract),
    warningTrace,
    limitationTrace,
    hasProductionLocator: locator !== undefined,
    hasProductionAssumptionLine,
    inputDesignStatus: inputDesignSummary?.status,
    alignmentStatus: alignmentSummary?.status ?? inputDesignSummary?.alignmentStatus,
    smartFormMetadata: {
      architectureReady: migrationItem?.smartFormArchitectureReady ?? false,
      renderingReady: false,
      uiBridgeReady: isSmartFormBatchEligible(contract.slug),
      pilotLive: isSmartFormPilotLive(contract.slug),
    },
    blockers: [
      ...(inputDesignSummary?.blockers ?? []),
      ...(migrationItem?.blockedBy ?? []),
    ],
    warnings: [
      ...(inputDesignSummary?.warnings ?? []),
      ...(migrationItem?.notes ?? []),
    ],
  });
}
