/**
 * Remediation apply safety policy — Phase 5I-J forbidden paths.
 */

import type { ControlledPatchDraft } from "@/lib/formula-governance/tool-factory-orchestrator/controlled-patch-generator/controlled-patch-types";

export const REMEDIATION_APPLY_FORBIDDEN_OPERATIONS = [
  "modify_calculators",
  "modify_tools_production",
  "modify_app_routes",
  "modify_firebase_config",
  "modify_deploy_config",
  "modify_auth_pricing_mail",
  "execute_deploy_command",
  "write_env_files",
] as const;

export const REMEDIATION_APPLY_ALLOWED_OPERATIONS = [
  "add_metadata",
  "add_test",
  "add_fixture",
  "append_export",
  "update_governance_file",
] as const;

const FORBIDDEN_PATH_PREFIXES = [
  "src/lib/calculators/",
  "src/lib/tools/",
  "src/app/",
  "functions/",
  "firebase.json",
  "firestore.rules",
  "messages/",
  ".env",
] as const;

export function validateDraftForApplyBatch(draft: ControlledPatchDraft): string[] {
  const violations: string[] = [];

  if (draft.status === "blocked") {
    violations.push(`${draft.slug}: blocked patch draft cannot enter apply batch.`);
  }

  for (const operation of draft.proposedOperations) {
    for (const prefix of FORBIDDEN_PATH_PREFIXES) {
      if (operation.targetPath.includes(prefix)) {
        violations.push(`${draft.slug}: forbidden path ${operation.targetPath}`);
      }
    }
  }

  if (draft.calculatorImpact === "blocked" || draft.routeImpact === "blocked") {
    violations.push(`${draft.slug}: impact gate blocked.`);
  }

  return violations;
}

export function isDraftEligibleForApplyBatch(draft: ControlledPatchDraft): boolean {
  return validateDraftForApplyBatch(draft).length === 0 && draft.status !== "blocked";
}
