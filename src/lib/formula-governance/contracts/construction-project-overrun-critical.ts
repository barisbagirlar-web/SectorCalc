/**
 * P62 — Construction project overrun premium-schema FormulaContract.
 */

import type { FormulaContract } from "@/lib/formula-governance/types";
import {
  GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
  STANDARD_DECISION_LANGUAGE_RULE,
  STANDARD_MUST_NOT_CLAIM,
  buildAssuredCriticalContract,
  calculatorProductionAssumption,
} from "@/lib/formula-governance/contracts/shared";
import { createWarningPolicy } from "@/lib/formula-governance/warning-policy";
import { CONSTRUCTION_PROJECT_OVERRUN_INPUT_KEYS } from "@/lib/premium-schema/calculators/construction-project-overrun-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, or engineering advice. Verify assumptions before contract or schedule decisions.";

const METADATA_LAST_UPDATED = "2026-06-13";
const METADATA_VALID_UNTIL = "2027-06-13";

const DELAY_DAYS_WARNING_THRESHOLD = 3;
const DELAY_DAYS_CRITICAL_THRESHOLD = 10;

const REQUIRED_INPUTS = ["dummy"];

const OUTPUTS = [
  "delayCost",
  "laborOverrunCost",
  "materialOverrunCost",
  "totalExposure",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict",
] as const;

export const ConstructionProjectOverrunCalculatorContract: FormulaContract =
  buildAssuredCriticalContract({
    toolId: "premium-schema.construction-project-overrun",
    toolName: "Construction Project Overrun Calculator",
    slug: "construction-project-overrun",
    purpose:
      "Quantify delay, labor and material overrun exposure when construction projects drift beyond baseline budgets.",
    userDecision:
      "What is total overrun exposure from schedule delay, labor drift and material variance for this project profile?",
    decisionImpact: "financial",
    requiredInputs: REQUIRED_INPUTS,
    criticalInputs: REQUIRED_INPUTS,
    outputs: ["dummy"],
    assumptions: [
      PREMIUM_SCHEMA_DISCLAIMER,
      "This tool estimates overrun exposure from user-supplied site cost, delay days and budget drift inputs.",
      `Metadata lastUpdated: ${METADATA_LAST_UPDATED}.`,
      `Metadata validUntil: ${METADATA_VALID_UNTIL}.`,
      "delayCost = dailySiteCost × delayDays.",
      "laborOverrunCost = laborBudget × laborOverrunPercent ÷ 100.",
      "materialOverrunCost = materialBudget × materialOverrunPercent ÷ 100.",
      "totalExposure = delayCost + laborOverrunCost + materialOverrunCost.",
      `summaryLevel low when delayDays < ${DELAY_DAYS_WARNING_THRESHOLD}; warning when ${DELAY_DAYS_WARNING_THRESHOLD} ≤ delayDays < ${DELAY_DAYS_CRITICAL_THRESHOLD}; critical when delayDays ≥ ${DELAY_DAYS_CRITICAL_THRESHOLD}.`,
      calculatorProductionAssumption(
        "src/lib/premium-schema/calculators/construction-project-overrun-validation.ts",
        "validateConstructionProjectOverrunInputs(inputs) → validation errors and warnings",
      ),
      calculatorProductionAssumption(
        "src/lib/premium-schema/calculators/construction-project-overrun.ts",
        "calculateConstructionProjectOverrun(inputs) → overrun metrics and decisionVerdict",
      ),
    ],
    formulaSummary:
      "Deterministic delay, labor and material overrun stack; summaryLevel follows schema delayDays thresholds.",
    missingParameterWarnings: [],
    warningPolicy: createWarningPolicy({
      acceptedAssumptions: [
        GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
        "Daily site cost is fully loaded for crew, equipment and overhead.",
        "Labor and material overrun percents supplied from forecast or historical drift.",
      ],
      modelLimitations: [
        "Not a change-order pricing engine or schedule critical-path optimizer.",
        "Does not model liquidated damages, retainage or owner delay claims.",
        "Does not guarantee contingency adequacy or contract recovery.",
      ],
      futureExtensions: [
        "Change-order fee stack and liquidated damages bands.",
        "Critical-path delay attribution by trade.",
      ],
    }),
    validationRules: [
      {
        id: "overrun-percent-range",
        description: "laborOverrunPercent and materialOverrunPercent must be between 0 and 100.",
        kind: "edge",
      },
      {
        id: "non-negative-budgets",
        description: "Site cost and budget inputs must be non-negative.",
        kind: "edge",
      },
      {
        id: "finite-inputs",
        description: "All inputs must be finite numbers; missing or NaN inputs fail validation.",
        kind: "edge",
      },
    ],
    scenarioSpecs: [
      { id: "normal-schedule", description: "Minimal delay with moderate budget drift." },
      { id: "warning-delay", description: "Delay days between warning and critical thresholds." },
      { id: "critical-delay", description: "Delay days at or above critical threshold." },
    ],
    monotonicityRules: [
      {
        id: "delay-up-cost",
        description: "Higher delayDays must not decrease delayCost when daily site cost is positive.",
        inputKey: "delayDays",
        direction: "increase_should_increase",
        outputKey: "delayCost",
      },
      {
        id: "labor-drift-up",
        description: "Higher laborOverrunPercent must not decrease laborOverrunCost.",
        inputKey: "laborOverrunPercent",
        direction: "increase_should_increase",
        outputKey: "laborOverrunCost",
      },
    ],
    decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
    mustNotClaim: [
      ...STANDARD_MUST_NOT_CLAIM,
      "Schedule guarantee",
      "Contract approval",
      "Engineering sign-off",
    ],
  });

export const CONSTRUCTION_PROJECT_OVERRUN_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] =
  [ConstructionProjectOverrunCalculatorContract];
