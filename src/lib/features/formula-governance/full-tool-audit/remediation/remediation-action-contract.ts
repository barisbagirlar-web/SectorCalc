/**
 * Remediation action contract — Phase 5I-D immutable safety rules.
 */

import { GLOBAL_FORBIDDEN_FILES } from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-diff-contract";
import type { RemediationActionType } from "@/lib/features/formula-governance/full-tool-audit/remediation/remediation-types";

export const REMEDIATION_FORBIDDEN_FILES = [...GLOBAL_FORBIDDEN_FILES] as const;

const ALLOWED_BY_ACTION: Readonly<Record<RemediationActionType, readonly string[]>> = {
  metadata_hygiene: ["src/lib/formula-governance/contracts/**"],
  fixture_ontology_add: ["src/lib/formula-governance/calculation-ontology/**"],
  input_design_upgrade: ["src/lib/formula-governance/input-design-audit/**"],
  smart_form_rollout: ["src/components/tools/smart-form/**", "src/lib/feature-flags/**"],
  trust_trace_fix: ["src/lib/formula-governance/trust-trace-report/**"],
  report_export_mapping: ["src/lib/formula-governance/trust-trace-report/export-contract/**"],
  manual_review: [],
};

export function mapPatchTypeToRemediationAction(
  patchType: string,
): RemediationActionType {
  switch (patchType) {
    case "metadata_only":
      return "metadata_hygiene";
    case "fixture_ontology":
      return "fixture_ontology_add";
    case "input_design_patch":
      return "input_design_upgrade";
    case "smart_form_patch":
      return "smart_form_rollout";
    case "trust_trace_patch":
      return "trust_trace_fix";
    case "report_export_contract":
      return "report_export_mapping";
    case "blocked_manual_review":
      return "manual_review";
    default:
      return "metadata_hygiene";
  }
}

export function getRemediationAllowedFiles(actionType: RemediationActionType): readonly string[] {
  return ALLOWED_BY_ACTION[actionType];
}
