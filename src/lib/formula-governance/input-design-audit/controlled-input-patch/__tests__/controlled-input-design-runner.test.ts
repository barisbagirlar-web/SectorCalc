/**
 * Phase 5H-F — controlled input design runner tests.
 */

import { describe, expect, test } from "vitest";
import type { ToolInputDesignAuditResult } from "@/lib/formula-governance/input-design-audit/input-design-audit-types";
import { getControlledInputDesignPatch } from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import { applyControlledInputDesignPatchReadOnly } from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-runner";

function buildAuditResult(slug: string): ToolInputDesignAuditResult {
  return {
    slug,
    status: "professional_ready",
    inputSufficiencyScore: 100,
    professionalDepthScore: 90,
    missingRequiredInputs: [],
    missingRiskDrivers: [],
    missingAdvancedInputs: [],
    derivedInputMisuse: [],
    defaultAssumptionGaps: [],
    validationGaps: [],
    dimensionGaps: [],
    alignmentStatus: "contract_only_analysis",
    migrationRiskScore: 0,
    recommendedPatchLevel: "none",
    canPatchWithoutUIBreak: true,
    nextAction: "ready",
    warnings: [],
    blockers: [],
  };
}

describe("applyControlledInputDesignPatchReadOnly", () => {
  test("applies registered 3d-print patch with productionImpact none", () => {
    const patch = getControlledInputDesignPatch("3d-print-cost-check")!;
    const result = applyControlledInputDesignPatchReadOnly({
      auditResult: buildAuditResult("3d-print-cost-check"),
      patch,
    });

    expect(result.applied).toBe(true);
    expect(result.productionImpact).toBe("none");
    expect(result.oracleImpact).toBe("none");
    expect(result.nextGate).toBe("smart_form_architecture");
    expect(result.afterPatchLevel).toBe("input_design_patch_applied");
  });

  test("blocks when productionImpact is not none", () => {
    const patch = {
      ...getControlledInputDesignPatch("cabinet-cost-estimator")!,
      productionImpact: "mutates_calculator" as "none",
    };
    const result = applyControlledInputDesignPatchReadOnly({
      auditResult: buildAuditResult("cabinet-cost-estimator"),
      patch,
    });

    expect(result.applied).toBe(false);
    expect(result.productionImpact).toBe("blocked");
    expect(result.blockers.length).toBeGreaterThan(0);
  });

  test("rejects slug mismatch", () => {
    const patch = getControlledInputDesignPatch("auto-shop-margin-leak-detector")!;
    const result = applyControlledInputDesignPatchReadOnly({
      auditResult: buildAuditResult("cabinet-cost-estimator"),
      patch,
    });

    expect(result.applied).toBe(false);
    expect(result.blockers.some((blocker) => blocker.includes("does not match"))).toBe(true);
  });
});
