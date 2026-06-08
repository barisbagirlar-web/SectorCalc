/**
 * Shared FormulaContract fragments for critical tools (Phase 3).
 */

import type { DecisionLanguageRule, FormulaContract, ScenarioTestSpec } from "@/lib/formula-governance/types";

export const FINANCIAL_SIMULATION_DISCLAIMER =
  "Job check only — not ERP, accounting, tax, legal or financial advice. Review your real numbers before credit, pricing or business decisions.";

export const FREE_TRAFFIC_PRODUCTION_FILE = "src/lib/tools/free-traffic-calculators.ts";

export const PREMIUM_DECISION_PRODUCTION_FILE = "src/lib/tools/premium-decision-engine.ts";

/** Phase 5H-D-A — governance ontology target alias notes (metadata only; production unchanged). */
export const GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE =
  "Governance ontology target `recommendedPrice` maps to the primary numeric decision output documented in formulaSummary.";

export const GOVERNANCE_MINIMUM_SAFE_BID_TARGET_NOTE =
  "Governance ontology target `minimumSafeBid` maps to break-even unit volume (`breakEvenUnits`).";

export const GOVERNANCE_RECOMMENDED_PRICE_DIFFERENCE_TARGET_NOTE =
  "Governance ontology target `recommendedPriceDifference` maps to netDifference (buy net position minus rent net position).";

export function freeTrafficProductionAssumption(slug: string, entry: string): string {
  return `Production: ${FREE_TRAFFIC_PRODUCTION_FILE} → CALCULATORS["${slug}"] → ${entry}`;
}

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
