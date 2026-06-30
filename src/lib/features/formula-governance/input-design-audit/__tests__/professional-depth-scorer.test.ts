/**
 * Phase 5H-C — professional depth scorer tests.
 */

import { describe, expect, test } from "vitest";
import { scoreProfessionalDepth } from "@/lib/features/formula-governance/input-design-audit/professional-depth-scorer";
import { FORMULA_CONTRACTS, getFormulaContractBySlug } from "@/lib/features/formula-governance/contracts";
import { runRequirementEngineForContract } from "@/lib/features/formula-governance/requirement-engine/contract-requirement-runner";
import type { ToolInputDesign } from "@/lib/features/formula-governance/requirement-engine/input-design-bridge";

const ROOFING_SLUG = "roofing-contract-margin-guard";
const CNC_SLUG = "cnc-quote-risk-analyzer";

describe("scoreProfessionalDepth", () => {
  test("premium tool without risk/advanced inputs lowers score", () => {
    const contract = getFormulaContractBySlug(CNC_SLUG)!;
    const emptyDesign: ToolInputDesign = {
      requiredFields: [],
      optionalFields: [],
      advancedFields: [],
      defaultedFields: [],
      acceptedAssumptions: [],
    };

    const result = scoreProfessionalDepth({
      contract: {
        ...contract,
        criticalInputs: ["materialCost"],
        requiredInputs: ["materialCost"],
      },
      inputDesign: emptyDesign,
    });

    expect(result.score).toBeLessThan(70);
    expect(result.warnings.some((warning) => warning.includes("risk-driver"))).toBe(true);
  });

  test("free tool with too many required inputs produces warning", () => {
    const freeContract = FORMULA_CONTRACTS.find((contract) =>
      contract.toolId.includes("free-traffic"),
    )!;
    const inputDesign: ToolInputDesign = {
      requiredFields: Array.from({ length: 8 }, (_, index) => ({
        variableId: `field${index}`,
        label: `Field ${index}`,
        required: true,
        defaulted: false,
        advanced: false,
        dimension: "count",
        unit: "unit",
        missingRisk: "low",
      })),
      optionalFields: [],
      advancedFields: [],
      defaultedFields: [],
      acceptedAssumptions: [],
    };

    const result = scoreProfessionalDepth({ contract: freeContract, inputDesign });
    expect(result.warnings.some((warning) => warning.includes("too deep for free tier"))).toBe(true);
  });

  test("oracle/scenario/property readiness affects score", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const rich = scoreProfessionalDepth({ contract });
    const sparse = scoreProfessionalDepth({
      contract: {
        ...contract,
        scenarioTests: contract.scenarioTests.map((test) => ({ ...test, present: false })),
        propertyTestsRegistered: false,
        oracleRequired: false,
        validationRules: [],
      },
    });

    expect(rich.score).toBeGreaterThan(sparse.score);
  });

  test("assumptions/limitations transparency affects score", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const transparent = scoreProfessionalDepth({ contract });
    const opaque = scoreProfessionalDepth({
      contract: {
        ...contract,
        assumptions: [],
        warningPolicy: undefined,
      },
    });

    expect(transparent.score).toBeGreaterThan(opaque.score);
  });

  test("runs deterministically", () => {
    const contract = getFormulaContractBySlug(ROOFING_SLUG)!;
    const run = runRequirementEngineForContract({ contract, knownInputs: {} });
    const first = scoreProfessionalDepth({
      contract,
      inputDesign: run.inputDesign,
      alignmentSummary: run.readinessAudit.alignmentSummary,
    });
    const second = scoreProfessionalDepth({
      contract,
      inputDesign: run.inputDesign,
      alignmentSummary: run.readinessAudit.alignmentSummary,
    });

    expect(first).toEqual(second);
  });
});
