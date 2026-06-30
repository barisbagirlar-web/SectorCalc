/**
 * Patch plan diff contract — Phase 5I-B immutable safety contract.
 */

import type { PatchPlanDiffContract, PatchPlanType } from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-types";

const BASE_AUDIT_COMMANDS = [
  "npm run test:formulas",
  "npm run audit:formulas",
  "npm run check:secrets",
] as const;

const PATCH_TYPE_AUDIT_COMMANDS: Readonly<Record<PatchPlanType, readonly string[]>> = {
  metadata_only: ["npm run audit:input-design", "npm run audit:trust-trace"],
  fixture_ontology: ["npm run audit:alignment", "npm run audit:migration-plan"],
  input_design_patch: ["npm run audit:input-design", "npm run audit:migration-plan"],
  smart_form_patch: ["npm run audit:smart-form-pilot-qa", "npm run audit:full-tools"],
  trust_trace_patch: ["npm run audit:trust-trace", "npm run audit:trust-trace-export"],
  report_export_contract: ["npm run audit:trust-trace-export", "npm run audit:full-tools"],
  test_only_patch: ["npm run test:formulas"],
  blocked_manual_review: [],
};

const PATCH_TYPE_TESTS: Readonly<Record<PatchPlanType, readonly string[]>> = {
  metadata_only: ["src/lib/formula-governance/**/__tests__/**"],
  fixture_ontology: ["src/lib/formula-governance/calculation-ontology/**/__tests__/**"],
  input_design_patch: ["src/lib/formula-governance/input-design-audit/**/__tests__/**"],
  smart_form_patch: ["src/components/tools/smart-form/**/__tests__/**"],
  trust_trace_patch: ["src/lib/formula-governance/trust-trace-report/**/__tests__/**"],
  report_export_contract: ["src/lib/formula-governance/trust-trace-report/export-contract/**/__tests__/**"],
  test_only_patch: ["src/lib/formula-governance/**/__tests__/**"],
  blocked_manual_review: [],
};

export function buildPatchPlanDiffContract(patchType: PatchPlanType): PatchPlanDiffContract {
  return {
    noProductionCalculatorChange: true,
    noFormulaOutputChange: true,
    noRouteChange: true,
    noFirebaseChange: true,
    noAuthPricingMailChange: true,
    noDeployConfigChange: true,
    testsRequired: [...PATCH_TYPE_TESTS[patchType]],
    auditCommandsRequired: [...BASE_AUDIT_COMMANDS, ...PATCH_TYPE_AUDIT_COMMANDS[patchType]],
  };
}

export const GLOBAL_FORBIDDEN_FILES = [
  "src/lib/calculators/**",
  "src/lib/tools/**",
  "src/app/**",
  "functions/**",
  "firestore.rules",
  "firebase.json",
  "messages/**",
  ".env.local",
  ".env.production",
] as const;
