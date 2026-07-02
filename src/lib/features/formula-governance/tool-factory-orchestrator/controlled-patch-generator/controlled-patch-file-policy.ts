/**
 * Controlled patch file policy - Phase 5I-E allowed/forbidden paths.
 */

import { GLOBAL_FORBIDDEN_FILES } from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-diff-contract";
import type { PatchPlanType } from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-types";
import type { ControlledPatchOperation } from "@/lib/features/formula-governance/tool-factory-orchestrator/controlled-patch-generator/controlled-patch-types";

export const CONTROLLED_PATCH_FORBIDDEN_FILES = [...GLOBAL_FORBIDDEN_FILES] as const;

const ALLOWED_BY_PATCH_TYPE: Readonly<Record<PatchPlanType, readonly string[]>> = {
  metadata_only: [
    "src/lib/formula-governance/contracts/**",
    "src/lib/formula-governance/__tests__/**",
    "src/lib/formula-governance/**/__tests__/**",
  ],
  fixture_ontology: [
    "src/lib/formula-governance/calculation-ontology/**",
    "src/lib/formula-governance/calculation-ontology/**/__tests__/**",
  ],
  input_design_patch: [
    "src/lib/formula-governance/input-design-audit/controlled-input-patch/**",
    "src/lib/formula-governance/input-design-audit/__tests__/**",
    "src/lib/formula-governance/input-design-audit/**/__tests__/**",
  ],
  smart_form_patch: [
    "src/components/tools/smart-form/**",
    "src/lib/formula-governance/smart-form-architecture/**",
    "src/lib/formula-governance/smart-form-ui-bridge/**",
    "src/lib/feature-flags/**",
  ],
  trust_trace_patch: [
    "src/lib/formula-governance/trust-trace-report/**",
    "src/lib/formula-governance/trust-trace-report/**/__tests__/**",
  ],
  report_export_contract: [
    "src/lib/formula-governance/trust-trace-report/export-contract/**",
    "src/lib/formula-governance/report-renderer-contract/**",
  ],
  test_only_patch: ["src/lib/formula-governance/**/__tests__/**"],
  blocked_manual_review: [],
};

const FORBIDDEN_PATH_PATTERNS = [
  /^src\/lib\/calculators\//,
  /^src\/lib\/tools\//,
  /^src\/app\//,
  /^functions\//,
  /^firebase\.json$/,
  /^firestore\.rules$/,
  /^messages\//,
  /^\.env/,
] as const;

export function getAllowedFilesForPatchType(patchType: PatchPlanType): readonly string[] {
  return ALLOWED_BY_PATCH_TYPE[patchType];
}

export function isForbiddenTargetPath(targetPath: string): boolean {
  return FORBIDDEN_PATH_PATTERNS.some((pattern) => pattern.test(targetPath));
}

export function validateProposedOperations(
  operations: readonly ControlledPatchOperation[],
): string[] {
  const violations: string[] = [];

  for (const operation of operations) {
    if (isForbiddenTargetPath(operation.targetPath)) {
      violations.push(`Forbidden target path: ${operation.targetPath}`);
    }
    if (operation.targetPath.includes("src/lib/calculators/")) {
      violations.push(`calculators/** violation: ${operation.targetPath}`);
    }
  }

  return violations;
}

export function pathWithinAllowedScope(
  targetPath: string,
  allowedFiles: readonly string[],
): boolean {
  if (allowedFiles.length === 0) {
    return false;
  }

  const normalized = targetPath.replace(/\\/g, "/");

  return allowedFiles.some((allowed) => {
    const pattern = allowed.replace(/\\/g, "/");

    if (pattern.includes("/**/")) {
      const [head, tail] = pattern.split("/**/");
      const tailSegment = tail.replace(/\/\*\*$/, "");
      const directChildMatch =
        tailSegment === "__tests__" &&
        (normalized.startsWith(`${head}/__tests__/`) || normalized === `${head}/__tests__`);
      const nestedMatch =
        normalized.startsWith(`${head}/`) && normalized.includes(`/${tailSegment}/`);
      return directChildMatch || nestedMatch;
    }

    if (pattern.endsWith("/**")) {
      const prefix = pattern.slice(0, -3);
      return normalized.startsWith(prefix);
    }

    return normalized === pattern || normalized.startsWith(`${pattern}/`);
  });
}
