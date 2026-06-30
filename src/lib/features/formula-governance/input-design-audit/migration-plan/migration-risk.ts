/**
 * Migration risk and priority helpers — Phase 5H-E.
 */

import type { ToolInputDesignAuditResult } from "@/lib/features/formula-governance/input-design-audit/input-design-audit-types";
import type { BatchAlignmentSummary } from "@/lib/features/formula-governance/requirement-engine/batch-alignment-audit";
import { isPremiumContract } from "@/lib/features/formula-governance/input-design-audit/input-design-helpers";
import type { FormulaContract } from "@/lib/features/formula-governance/types";
import type {
  MigrationPatchLevel,
  MigrationPriority,
  MigrationRiskLevel,
} from "@/lib/features/formula-governance/input-design-audit/migration-plan/migration-plan-types";

export function resolveMigrationRiskLevel(
  auditResult: ToolInputDesignAuditResult,
  alignmentSummary?: BatchAlignmentSummary,
): MigrationRiskLevel {
  if (auditResult.status === "blocked" || auditResult.status === "unsafe") {
    return "critical";
  }

  const driftScore = Math.max(
    auditResult.migrationRiskScore,
    alignmentSummary?.migrationRiskScore ?? 0,
  );

  if (auditResult.status === "shallow" || driftScore >= 40) {
    return "critical";
  }
  if (driftScore >= 28 || alignmentSummary?.status === "blocked") {
    return "high";
  }
  if (driftScore >= 15 || alignmentSummary?.status === "needs_review") {
    return "medium";
  }
  return "low";
}

function bumpPriority(priority: MigrationPriority): MigrationPriority {
  const order: MigrationPriority[] = ["defer", "low", "medium", "high", "immediate"];
  const index = order.indexOf(priority);
  return order[Math.min(index + 1, order.length - 1)] ?? priority;
}

export function resolveMigrationPriority(params: {
  readonly auditResult: ToolInputDesignAuditResult;
  readonly patchLevel: MigrationPatchLevel;
  readonly migrationRiskLevel: MigrationRiskLevel;
  readonly contract?: FormulaContract;
  readonly hasFixtureOntology: boolean;
}): MigrationPriority {
  const { auditResult, patchLevel, migrationRiskLevel, contract, hasFixtureOntology } = params;

  if (patchLevel === "blocked" || auditResult.status === "blocked") {
    return "immediate";
  }

  if (!auditResult.canPatchWithoutUIBreak && patchLevel === "smart_form_patch") {
    return "defer";
  }

  if (
    !auditResult.canPatchWithoutUIBreak &&
    (patchLevel === "controlled_input_patch" || patchLevel === "smart_form_patch")
  ) {
    return "defer";
  }

  let priority: MigrationPriority;

  if (auditResult.status === "professional_ready" && patchLevel !== "fixture_ontology") {
    priority = migrationRiskLevel === "low" ? "immediate" : "high";
  } else if (auditResult.status === "usable" && migrationRiskLevel === "low") {
    priority = "high";
  } else if (patchLevel === "fixture_ontology" || !hasFixtureOntology) {
    priority = "medium";
  } else if (auditResult.status === "shallow" || auditResult.status === "unsafe") {
    priority = "defer";
  } else if (migrationRiskLevel === "low") {
    priority = "low";
  } else {
    priority = "medium";
  }

  if (contract && isPremiumContract(contract) && priority !== "defer") {
    priority = bumpPriority(priority);
  }

  if (migrationRiskLevel === "critical") {
    priority = auditResult.blockers.length > 0 ? "immediate" : "defer";
  } else if (migrationRiskLevel === "high" && priority === "immediate") {
    priority = "high";
  }

  return priority;
}

export function resolveCanPatchWithoutUIBreak(
  patchLevel: MigrationPatchLevel,
  auditResult: ToolInputDesignAuditResult,
): boolean {
  if (patchLevel === "blocked") {
    return false;
  }
  if (
    patchLevel === "none" ||
    patchLevel === "metadata_only" ||
    patchLevel === "fixture_ontology" ||
    patchLevel === "input_design_only"
  ) {
    return true;
  }
  if (patchLevel === "report_trace_patch") {
    return auditResult.status === "professional_ready";
  }
  return false;
}
