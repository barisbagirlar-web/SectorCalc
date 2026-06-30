/**
 * Controlled input design patch runner — Phase 5H-F read-only apply.
 * Does not mutate production calculators, UI, or oracle behavior.
 */

import type { ToolInputDesignAuditResult } from "@/lib/features/formula-governance/input-design-audit/input-design-audit-types";
import type {
  ControlledInputDesignPatch,
  ControlledInputDesignPatchResult,
} from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-patch-types";

export type ApplyControlledInputDesignPatchReadOnlyParams = {
  readonly auditResult: ToolInputDesignAuditResult;
  readonly patch: ControlledInputDesignPatch;
};

function validatePatchSafety(patch: ControlledInputDesignPatch): readonly string[] {
  const blockers: string[] = [];

  if (patch.productionImpact !== "none") {
    blockers.push(
      `Patch "${patch.slug}" declares productionImpact "${patch.productionImpact}" — read-only runner requires "none".`,
    );
  }
  if (patch.oracleImpact !== "none") {
    blockers.push(
      `Patch "${patch.slug}" declares oracleImpact "${patch.oracleImpact}" — read-only runner requires "none".`,
    );
  }

  return blockers;
}

export function applyControlledInputDesignPatchReadOnly(
  params: ApplyControlledInputDesignPatchReadOnlyParams,
): ControlledInputDesignPatchResult {
  const { auditResult, patch } = params;
  const safetyBlockers = validatePatchSafety(patch);
  const warnings = [...patch.warnings];

  if (patch.slug !== auditResult.slug) {
    return {
      slug: auditResult.slug,
      applied: false,
      productionImpact: "blocked",
      uiImpact: patch.uiImpact,
      oracleImpact: patch.oracleImpact,
      beforePatchLevel: auditResult.recommendedPatchLevel,
      afterPatchLevel: auditResult.recommendedPatchLevel,
      nextGate: "blocker_resolution",
      warnings,
      blockers: [`Patch slug "${patch.slug}" does not match audit slug "${auditResult.slug}".`],
    };
  }

  if (safetyBlockers.length > 0) {
    return {
      slug: patch.slug,
      applied: false,
      productionImpact: "blocked",
      uiImpact: patch.uiImpact,
      oracleImpact: patch.oracleImpact,
      beforePatchLevel: auditResult.recommendedPatchLevel,
      afterPatchLevel: auditResult.recommendedPatchLevel,
      nextGate: "blocker_resolution",
      warnings,
      blockers: [...patch.blockers, ...safetyBlockers],
    };
  }

  if (patch.requiredInputs.length === 0) {
    return {
      slug: patch.slug,
      applied: false,
      productionImpact: "none",
      uiImpact: patch.uiImpact,
      oracleImpact: patch.oracleImpact,
      beforePatchLevel: auditResult.recommendedPatchLevel,
      afterPatchLevel: auditResult.recommendedPatchLevel,
      nextGate: "blocker_resolution",
      warnings,
      blockers: [...patch.blockers, "Controlled input design patch must declare required inputs."],
    };
  }

  return {
    slug: patch.slug,
    applied: true,
    productionImpact: "none",
    uiImpact: patch.uiImpact,
    oracleImpact: "none",
    beforePatchLevel: auditResult.recommendedPatchLevel,
    afterPatchLevel: "input_design_patch_applied",
    nextGate: patch.nextGate,
    warnings,
    blockers: patch.blockers,
  };
}

export function applyRegisteredControlledInputDesignPatchesReadOnly(
  auditResults: readonly ToolInputDesignAuditResult[],
  registry: Readonly<Record<string, ControlledInputDesignPatch>>,
): readonly ControlledInputDesignPatchResult[] {
  const results: ControlledInputDesignPatchResult[] = [];

  for (const [slug, patch] of Object.entries(registry)) {
    const auditResult = auditResults.find((entry) => entry.slug === slug);
    if (!auditResult) {
      continue;
    }
    results.push(
      applyControlledInputDesignPatchReadOnly({
        auditResult,
        patch,
      }),
    );
  }

  return results;
}
