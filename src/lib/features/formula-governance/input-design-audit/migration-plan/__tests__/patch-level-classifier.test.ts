/**
 * Phase 5H-E - patch level classifier tests.
 */

import { describe, expect, test } from "vitest";
import type { ToolInputDesignAuditResult } from "@/lib/features/formula-governance/input-design-audit/input-design-audit-types";
import { classifyPatchLevel } from "@/lib/features/formula-governance/input-design-audit/migration-plan/patch-level-classifier";

function buildAuditResult(
  overrides: Partial<ToolInputDesignAuditResult> = {},
): ToolInputDesignAuditResult {
  return {
    slug: "sample-tool",
    status: "usable",
    inputSufficiencyScore: 75,
    professionalDepthScore: 70,
    missingRequiredInputs: [],
    missingRiskDrivers: [],
    missingAdvancedInputs: [],
    derivedInputMisuse: [],
    defaultAssumptionGaps: [],
    validationGaps: [],
    dimensionGaps: [],
    alignmentStatus: "contract_only_analysis",
    migrationRiskScore: 0,
    recommendedPatchLevel: "minor_input_patch",
    canPatchWithoutUIBreak: false,
    nextAction: "review",
    warnings: [],
    blockers: [],
    ...overrides,
  };
}

describe("classifyPatchLevel", () => {
  test("metadata blocker maps to metadata_only", () => {
    const level = classifyPatchLevel({
      auditResult: buildAuditResult({
        blockers: ['Contract "sample-tool" is missing Production: assumption line.'],
      }),
      hasFixtureOntology: false,
      hasFullGovernanceCoverage: true,
    });

    expect(level).toBe("metadata_only");
  });

  test("missing fixture maps to fixture_ontology", () => {
    const level = classifyPatchLevel({
      auditResult: buildAuditResult({
        status: "usable",
        alignmentStatus: "contract_only_analysis",
      }),
      hasFixtureOntology: false,
      hasFullGovernanceCoverage: false,
    });

    expect(level).toBe("fixture_ontology");
  });

  test("missing required input maps to controlled_input_patch", () => {
    const level = classifyPatchLevel({
      auditResult: buildAuditResult({
        status: "usable",
        missingRequiredInputs: ["laborRate"],
        alignmentStatus: "low_risk",
      }),
      hasFixtureOntology: true,
      hasFullGovernanceCoverage: true,
    });

    expect(level).toBe("controlled_input_patch");
  });

  test("report and trust trace gap maps to report_trace_patch", () => {
    const level = classifyPatchLevel({
      auditResult: buildAuditResult({
        status: "usable",
        validationGaps: ["margin-percent rule missing"],
        alignmentStatus: "low_risk",
      }),
      hasFixtureOntology: true,
      hasFullGovernanceCoverage: true,
      alignmentSummary: {
        slug: "sample-tool",
        status: "needs_review",
        migrationRiskScore: 20,
        aliasCount: 2,
        manualReviewCount: 1,
        blockerCount: 0,
        warningCount: 1,
        safeToUseContractOntologyForRequirementEngine: true,
        recommendedAction: "review aliases",
      },
    });

    expect(level).toBe("report_trace_patch");
  });

  test("no issue maps to none", () => {
    const level = classifyPatchLevel({
      auditResult: buildAuditResult({
        status: "blocked",
        blockers: ["Hard runtime blocker"],
      }),
      hasFixtureOntology: true,
      hasFullGovernanceCoverage: true,
    });

    expect(level).toBe("blocked");
  });
});
