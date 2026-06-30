/**
 * Controlled patch draft generator — Phase 5I-E dry-run only.
 */

import { CONTROLLED_PATCH_DEFAULT_MODE } from "@/lib/features/formula-governance/tool-factory-orchestrator/controlled-patch-generator/controlled-patch-dry-run";
import { buildControlledPatchApprovalFlags } from "@/lib/features/formula-governance/tool-factory-orchestrator/controlled-patch-generator/controlled-patch-approval";
import {
  CONTROLLED_PATCH_FORBIDDEN_FILES,
  getAllowedFilesForPatchType,
  pathWithinAllowedScope,
  validateProposedOperations,
} from "@/lib/features/formula-governance/tool-factory-orchestrator/controlled-patch-generator/controlled-patch-file-policy";
import {
  classifyImpacts,
  resolveControlledPatchStatus,
} from "@/lib/features/formula-governance/tool-factory-orchestrator/controlled-patch-generator/controlled-patch-risk-gate";
import type {
  ControlledPatchDraft,
  ControlledPatchOperation,
} from "@/lib/features/formula-governance/tool-factory-orchestrator/controlled-patch-generator/controlled-patch-types";
import type { PatchPlan, PatchPlanType } from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-types";

function buildOperationsForPatchType(plan: PatchPlan): ControlledPatchOperation[] {
  const slug = plan.slug;

  switch (plan.patchType) {
    case "metadata_only":
      return [
        {
          kind: "add_metadata",
          targetPath: `src/lib/formula-governance/contracts/${slug}.ts`,
          summary: `Add metadata hygiene notes for ${slug}.`,
        },
        {
          kind: "add_test",
          targetPath: `src/lib/formula-governance/__tests__/${slug}-metadata.test.ts`,
          summary: `Add metadata governance test for ${slug}.`,
        },
      ];
    case "fixture_ontology":
      return [
        {
          kind: "add_fixture",
          targetPath: `src/lib/formula-governance/calculation-ontology/fixtures/${slug}-ontology.ts`,
          summary: `Register fixture ontology draft for ${slug}.`,
        },
        {
          kind: "add_test",
          targetPath: `src/lib/formula-governance/calculation-ontology/__tests__/${slug}-ontology.test.ts`,
          summary: `Add fixture ontology test for ${slug}.`,
        },
      ];
    case "input_design_patch":
      return [
        {
          kind: "update_file",
          targetPath: `src/lib/formula-governance/input-design-audit/controlled-input-patch/${slug}.ts`,
          summary: `Extend controlled input design patch for ${slug}.`,
        },
        {
          kind: "add_test",
          targetPath: `src/lib/formula-governance/input-design-audit/__tests__/${slug}-patch.test.ts`,
          summary: `Add input design patch test for ${slug}.`,
        },
      ];
    case "smart_form_patch":
      return [
        {
          kind: "update_file",
          targetPath: `src/components/tools/smart-form/${slug}-pilot-bridge.ts`,
          summary: `Extend smart form pilot bridge metadata for ${slug}.`,
        },
        {
          kind: "add_test",
          targetPath: `src/components/tools/smart-form/__tests__/${slug}-pilot.test.ts`,
          summary: `Add smart form pilot test for ${slug}.`,
        },
      ];
    case "trust_trace_patch":
      return [
        {
          kind: "update_file",
          targetPath: `src/lib/formula-governance/trust-trace-report/${slug}-trace.ts`,
          summary: `Extend trust trace metadata for ${slug}.`,
        },
        {
          kind: "add_test",
          targetPath: `src/lib/formula-governance/trust-trace-report/__tests__/${slug}-trace.test.ts`,
          summary: `Add trust trace test for ${slug}.`,
        },
      ];
    case "report_export_contract":
      return [
        {
          kind: "append_export",
          targetPath: `src/lib/formula-governance/trust-trace-report/export-contract/${slug}-export.ts`,
          summary: `Append export contract mapping for ${slug}.`,
        },
        {
          kind: "create_file",
          targetPath: `src/lib/formula-governance/report-renderer-contract/${slug}-renderer.ts`,
          summary: `Create renderer contract stub for ${slug}.`,
        },
      ];
    case "test_only_patch":
      return [
        {
          kind: "add_test",
          targetPath: `src/lib/formula-governance/__tests__/${slug}-governance.test.ts`,
          summary: `Add governance test coverage for ${slug}.`,
        },
      ];
    case "blocked_manual_review":
    default:
      return [{ kind: "no_op", targetPath: "(none)", summary: "Manual review required — no file operations." }];
  }
}

function validateAllowedScope(
  operations: readonly ControlledPatchOperation[],
  allowedFiles: readonly string[],
  patchType: PatchPlanType,
): string[] {
  const blockers: string[] = [];

  if (patchType === "blocked_manual_review") {
    return blockers;
  }

  for (const operation of operations) {
    if (operation.kind === "no_op") {
      continue;
    }
    if (!pathWithinAllowedScope(operation.targetPath, allowedFiles)) {
      blockers.push(`${operation.targetPath} is outside allowed scope for ${patchType}.`);
    }
  }

  return blockers;
}

export function buildControlledPatchDraft(patchPlan: PatchPlan): ControlledPatchDraft {
  const allowedFiles = getAllowedFilesForPatchType(patchPlan.patchType);
  const proposedOperations = buildOperationsForPatchType(patchPlan);
  const proposedFiles = proposedOperations
    .filter((op) => op.kind !== "no_op")
    .map((op) => op.targetPath);

  const operationViolations = validateProposedOperations(proposedOperations);
  const scopeViolations = validateAllowedScope(proposedOperations, allowedFiles, patchPlan.patchType);
  const blockers = [...patchPlan.blockers, ...operationViolations, ...scopeViolations];
  const warnings = [...patchPlan.warnings];

  const impacts = classifyImpacts(proposedOperations, blockers);
  const status = resolveControlledPatchStatus(patchPlan, [...operationViolations, ...scopeViolations]);
  const approval = buildControlledPatchApprovalFlags();

  return {
    patchId: `controlled-patch-${patchPlan.slug}`,
    sourcePatchPlanId: patchPlan.planId,
    slug: patchPlan.slug,
    patchType: patchPlan.patchType,
    mode: CONTROLLED_PATCH_DEFAULT_MODE,
    proposedFiles,
    proposedOperations,
    allowedFiles,
    forbiddenFiles: [...CONTROLLED_PATCH_FORBIDDEN_FILES],
    expectedDiffSummary: `Dry-run ${patchPlan.patchType} patch for ${patchPlan.slug} — no files written.`,
    requiredTests: [...patchPlan.requiredTests],
    ...approval,
    ...impacts,
    blockers,
    warnings,
    status,
  };
}
