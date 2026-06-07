/**
 * Phase 5D — warning policy evaluation tests.
 */

import { describe, expect, test } from "vitest";
import { runGovernanceAudit } from "@/lib/formula-governance/audit-runner";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { buildAssuredCriticalContract } from "@/lib/formula-governance/contracts/shared";
import { evaluateCriticalPassPolicy, resolveAuditStatus } from "@/lib/formula-governance/risk-rules";
import type { FormulaContract } from "@/lib/formula-governance/types";
import {
  createWarningPolicy,
  evaluateWarningPolicy,
  summarizeWarningPolicy,
} from "@/lib/formula-governance/warning-policy";

function mockAssuredContract(
  overrides: Partial<Omit<FormulaContract, "scenarioTests">> &
    Pick<FormulaContract, "slug" | "toolId" | "toolName"> & {
      readonly scenarioSpecs?: readonly { readonly id: string; readonly description: string }[];
    },
): FormulaContract {
  const scenarioSpecs = overrides.scenarioSpecs ?? [
    { id: "s1", description: "s1" },
    { id: "s2", description: "s2" },
    { id: "s3", description: "s3" },
    { id: "s4", description: "s4" },
    { id: "s5", description: "s5" },
  ];
  const { scenarioSpecs: _omit, ...restOverrides } = overrides;
  const base = buildAssuredCriticalContract({
    ...restOverrides,
    toolId: overrides.toolId,
    toolName: overrides.toolName,
    slug: overrides.slug,
    purpose: overrides.purpose ?? "Test purpose for governance audit.",
    userDecision: overrides.userDecision ?? "Test decision question?",
    decisionImpact: overrides.decisionImpact ?? "financial",
    requiredInputs: overrides.requiredInputs ?? ["a"],
    criticalInputs: overrides.criticalInputs ?? ["a"],
    outputs: overrides.outputs ?? ["result"],
    assumptions: overrides.assumptions ?? ["Test assumption."],
    formulaSummary: overrides.formulaSummary ?? "result = a",
    missingParameterWarnings: overrides.missingParameterWarnings ?? [],
    validationRules: overrides.validationRules ?? [
      { id: "edge-a", description: "a must be positive", kind: "edge" },
    ],
    scenarioSpecs,
    monotonicityRules: overrides.monotonicityRules ?? [
      {
        id: "mono",
        description: "Higher a increases result",
        inputKey: "a",
        direction: "increase_should_increase",
        outputKey: "result",
      },
    ],
    decisionLanguageRules: overrides.decisionLanguageRules ?? [
      {
        id: "disclaimer",
        description: "Qualified output",
        requiredDisclaimer: true,
        forbiddenPhrases: ["guaranteed profit"],
      },
    ],
    mustNotClaim: overrides.mustNotClaim ?? ["Guaranteed profit"],
  });
  return base;
}

function evaluatePolicyStatus(contract: FormulaContract): string {
  const findings = evaluateCriticalPassPolicy({
    contract,
    findings: [],
    implementedInputKeys: [...contract.criticalInputs],
    oraclePresent: true,
    disclaimerPresent: true,
  });
  return resolveAuditStatus(findings);
}

describe("warning policy evaluation", () => {
  test("acceptedAssumption alone does not produce critical FAIL", () => {
    const contract = mockAssuredContract({
      toolId: "test.accepted-only",
      toolName: "Accepted Only",
      slug: "accepted-only-test",
      warningPolicy: createWarningPolicy({
        acceptedAssumptions: ["Linear model simplification documented in assumptions."],
      }),
    });

    const { findings } = evaluateWarningPolicy(contract);
    expect(findings.some((f) => f.code === "CRIT_UNRESOLVED_WARNINGS")).toBe(false);
    expect(findings.some((f) => f.code === "CRIT_HARD_FAIL_WARNINGS")).toBe(false);
    expect(findings.some((f) => f.code === "INFO_ACCEPTED_ASSUMPTIONS")).toBe(true);
    expect(evaluatePolicyStatus(contract)).toBe("PASS");
  });

  test("hardFail warnings produce critical FAIL", () => {
    const contract = mockAssuredContract({
      toolId: "test.hard-fail",
      toolName: "Hard Fail",
      slug: "hard-fail-test",
      warningPolicy: createWarningPolicy({
        hardFailWarnings: ["Primary decision input not modeled"],
      }),
    });

    const { findings } = evaluateWarningPolicy(contract);
    expect(findings.some((f) => f.code === "CRIT_HARD_FAIL_WARNINGS")).toBe(true);
    expect(evaluatePolicyStatus(contract)).toBe("FAIL");
  });

  test("modelLimitation produces NEEDS_REVIEW not FAIL", () => {
    const contract = mockAssuredContract({
      toolId: "test.model-limit",
      toolName: "Model Limit",
      slug: "model-limit-test",
      warningPolicy: createWarningPolicy({
        modelLimitations: ["Tax escrow not modeled"],
      }),
    });

    const { findings } = evaluateWarningPolicy(contract);
    expect(findings.some((f) => f.code === "WARN_MODEL_LIMITATIONS")).toBe(true);
    expect(findings.some((f) => f.code === "CRIT_UNRESOLVED_WARNINGS")).toBe(false);
    expect(evaluatePolicyStatus(contract)).toBe("NEEDS_REVIEW");
  });

  test("futureExtensions produce NEEDS_REVIEW", () => {
    const contract = mockAssuredContract({
      toolId: "test.future-ext",
      toolName: "Future Ext",
      slug: "future-ext-test",
      warningPolicy: createWarningPolicy({
        futureExtensions: ["Inflation adjustment not modeled"],
      }),
    });

    expect(evaluatePolicyStatus(contract)).toBe("NEEDS_REVIEW");
  });

  test("legacy missingParameterWarnings without policy still fail", () => {
    const contract = mockAssuredContract({
      toolId: "test.legacy",
      toolName: "Legacy",
      slug: "legacy-warnings-test",
      missingParameterWarnings: ["Unclassified legacy warning"],
    });

    const { findings } = evaluateWarningPolicy(contract);
    expect(findings.some((f) => f.code === "CRIT_UNRESOLVED_WARNINGS")).toBe(true);
    expect(evaluatePolicyStatus(contract)).toBe("FAIL");
  });

  test("summarizeWarningPolicy returns counts and status reason", () => {
    const contract = getFormulaContractBySlug("loan-payment-calculator");
    expect(contract).toBeDefined();
    const summary = summarizeWarningPolicy(contract!);
    expect(summary.acceptedAssumptionsCount).toBeGreaterThan(0);
    expect(summary.modelLimitationsCount).toBeGreaterThan(0);
    expect(summary.hardFailWarningsCount).toBe(0);
    expect(summary.statusChangeReason).toContain("model limitation(s)");
  });
});

describe("warning policy wired tools", () => {
  test("rent vs buy remains PASS", () => {
    const report = runGovernanceAudit();
    const rent = report.results.find((r) => r.slug === "rent-vs-buy-calculator");
    expect(rent?.status).toBe("PASS");
    expect(rent?.findings.some((f) => f.code === "CRIT_UNRESOLVED_WARNINGS")).toBe(false);
    expect(rent?.findings.some((f) => f.code === "CRIT_HARD_FAIL_WARNINGS")).toBe(false);
  });

  test("cnc quote risk stays NEEDS_REVIEW with premium decision model limitation", () => {
    const report = runGovernanceAudit();
    const cnc = report.results.find((r) => r.slug === "cnc-quote-risk-analyzer");
    expect(cnc?.status).toBe("NEEDS_REVIEW");
    expect(cnc?.status).not.toBe("FAIL");
    expect(cnc?.findings.some((f) => f.code === "ORACLE_COMPARISON_PASS")).toBe(true);
    expect(cnc?.findings.some((f) => f.code === "WARN_MODEL_LIMITATIONS")).toBe(true);
    expect(
      cnc?.findings.some((f) =>
        f.message.includes("Premium decision layer (p90, safe price, verdict) not fully oracle-compared"),
      ),
    ).toBe(true);
  });

  test("wired finance tools no longer FAIL on CRIT_UNRESOLVED_WARNINGS", () => {
    const report = runGovernanceAudit();
    const slugs = [
      "loan-payment-calculator",
      "mortgage-calculator",
      "interest-calculator",
      "compound-interest-calculator",
      "profit-margin-calculator",
    ] as const;

    for (const slug of slugs) {
      const result = report.results.find((r) => r.slug === slug);
      expect(result?.status).toBe("NEEDS_REVIEW");
      expect(result?.findings.some((f) => f.code === "CRIT_UNRESOLVED_WARNINGS")).toBe(false);
      expect(result?.warningPolicySummary?.modelLimitationsCount).toBeGreaterThan(0);
    }
  });
});
