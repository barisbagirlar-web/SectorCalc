/**
 * Shared FormulaContract fragments for critical tools (Phase 3).
 */

import type { DecisionLanguageRule, FormulaContract, ScenarioTestSpec } from "@/lib/formula-governance/types";

export const FINANCIAL_SIMULATION_DISCLAIMER =
  "Technical simulation only — not financial, legal, or tax advice. Verify assumptions before credit, pricing, or business decisions.";

export const STANDARD_MUST_NOT_CLAIM: readonly string[] = [
  "Guaranteed savings",
  "This is the best decision",
  "You should buy",
  "You should sell",
  "You should borrow",
  "Guaranteed margin",
  "Guaranteed profit",
];

export const STANDARD_DECISION_LANGUAGE_RULE: DecisionLanguageRule = {
  id: "assumption-qualified-output",
  description:
    "Outputs must use assumption-qualified language; no definitive borrow/buy/sell commands.",
  acceptablePhrases: [
    "Under these assumptions...",
    "Estimated result under the inputs entered.",
    "This model excludes taxes, fees, and market risk unless stated.",
  ],
  requiredDisclaimer: true,
  forbiddenPhrases: [
    "guaranteed savings",
    "best decision",
    "you should borrow",
    "you should buy",
    "you should sell",
    "guaranteed margin",
    "guaranteed profit",
  ],
};

export function scenarioSkeletons(
  specs: readonly { readonly id: string; readonly description: string }[],
): readonly ScenarioTestSpec[] {
  return specs.map((spec) => ({ ...spec, present: false }));
}

export function scenarioRuntimeTests(
  specs: readonly { readonly id: string; readonly description: string }[],
): readonly ScenarioTestSpec[] {
  return specs.map((spec) => ({ ...spec, present: true }));
}

export function buildCriticalContract(
  config: Omit<
    FormulaContract,
    "riskLevel" | "oracleRequired" | "propertyTestsRegistered" | "auditOwner" | "auditStatus"
  >,
): FormulaContract {
  return {
    ...config,
    riskLevel: "critical",
    oracleRequired: true,
    propertyTestsRegistered: false,
    auditOwner: "formula-governance",
    auditStatus: "NEEDS_REVIEW",
  };
}

/** Phase 4/5 — critical tools with oracle, property tests, and runtime scenarios wired. */
export function buildAssuredCriticalContract(
  config: Omit<
    FormulaContract,
    | "riskLevel"
    | "oracleRequired"
    | "propertyTestsRegistered"
    | "auditOwner"
    | "auditStatus"
    | "scenarioTests"
  > & {
    readonly scenarioSpecs: readonly { readonly id: string; readonly description: string }[];
  },
): FormulaContract {
  const { scenarioSpecs, ...rest } = config;
  return {
    ...rest,
    scenarioTests: scenarioRuntimeTests(scenarioSpecs),
    riskLevel: "critical",
    oracleRequired: true,
    propertyTestsRegistered: true,
    auditOwner: "formula-governance",
    auditStatus: "NEEDS_REVIEW",
  };
}

/** @deprecated Use buildAssuredCriticalContract */
export const buildFinanceAssuredContract = buildAssuredCriticalContract;
