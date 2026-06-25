/**
 * P62 — Sheet metal scrap risk premium-schema FormulaContract.
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
import { SHEET_METAL_SCRAP_RISK_INPUT_KEYS } from "@/lib/premium-schema/calculators/sheet-metal-scrap-risk-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, or fabrication advice. Verify assumptions before quoting or production decisions.";

const METADATA_LAST_UPDATED = "2026-06-13";
const METADATA_VALID_UNTIL = "2027-06-13";

const SCRAP_RATE_WARNING_THRESHOLD = 5;
const SCRAP_RATE_CRITICAL_THRESHOLD = 10;

const REQUIRED_INPUTS = ["dummy"];

const OUTPUTS = [
  "excessScrapCost",
  "reworkCost",
  "finishingCost",
  "totalExposure",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict",
] as const;

export const SheetMetalScrapRiskCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.sheet-metal-scrap-risk",
  toolName: "Sheet Metal Scrap Risk Calculator",
  slug: "sheet-metal-scrap-risk",
  purpose:
    "Quantify excess scrap, rework and finishing exposure as total fabrication risk for sheet metal jobs.",
  userDecision:
    "What is total sheet metal scrap exposure for this material and rework profile?",
  decisionImpact: "financial",
  requiredInputs: REQUIRED_INPUTS,
  criticalInputs: REQUIRED_INPUTS,
  outputs: ["dummy"],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    "This tool estimates sheet metal scrap risk from user-supplied material, scrap rate and rework inputs.",
    `Metadata lastUpdated: ${METADATA_LAST_UPDATED}.`,
    `Metadata validUntil: ${METADATA_VALID_UNTIL}.`,
    "excessScrapCost = materialCost × max(scrapRate − targetScrapRate, 0) ÷ 100.",
    "reworkCost = reworkHours × laborRate.",
    "totalExposure = excessScrapCost + reworkCost + finishingCost.",
    `summaryLevel low when scrapRate < ${SCRAP_RATE_WARNING_THRESHOLD}; warning when ${SCRAP_RATE_WARNING_THRESHOLD} ≤ scrapRate < ${SCRAP_RATE_CRITICAL_THRESHOLD}; critical when scrapRate ≥ ${SCRAP_RATE_CRITICAL_THRESHOLD}.`,
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/sheet-metal-scrap-risk-validation.ts",
      "validateSheetMetalScrapRiskInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/sheet-metal-scrap-risk.ts",
      "calculateSheetMetalScrapRisk(inputs) → scrap metrics and decisionVerdict",
    ),
  ],
  formulaSummary:
    "Deterministic excess scrap, rework and finishing stack; summaryLevel follows schema scrapRate thresholds with totalExposure as primary driver.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "Material cost and scrap rate align to the same job or period scope.",
      "Finishing cost supplied as user-estimated rework stack.",
    ],
    modelLimitations: [
      "Not a nesting optimizer or bend allowance certification tool.",
      "Does not model multi-operation nesting, tooling wear or powder coat chemistry.",
      "Does not guarantee quote accuracy or shop margin recovery.",
    ],
    futureExtensions: [
      "Nesting yield curves and bend sequence attribution.",
      "Powder coat chemistry and tooling wear linkage.",
    ],
  }),
  validationRules: [
    {
      id: "scrap-rate-range",
      description: "scrapRate and targetScrapRate must be between 0 and 100.",
      kind: "edge",
    },
    {
      id: "non-negative-costs",
      description: "Material, labor and finishing inputs must be non-negative.",
      kind: "edge",
    },
    {
      id: "non-negative-hours",
      description: "reworkHours must be greater than or equal to zero.",
      kind: "edge",
    },
    {
      id: "finite-inputs",
      description: "All inputs must be finite numbers; missing or NaN inputs fail validation.",
      kind: "edge",
    },
  ],
  scenarioSpecs: [
    { id: "normal-scrap", description: "Moderate scrap rate with low rework exposure." },
    { id: "warning-scrap", description: "Scrap rate between warning and critical thresholds." },
    { id: "critical-scrap", description: "Scrap rate at or above critical threshold." },
  ],
  monotonicityRules: [
    {
      id: "scrap-up-excess",
      description: "Higher scrapRate must not decrease excessScrapCost when material cost is positive and scrap exceeds target.",
      inputKey: "scrapRate",
      direction: "increase_should_increase",
      outputKey: "excessScrapCost",
    },
    {
      id: "rework-up-cost",
      description: "Higher reworkHours must not decrease reworkCost when labor rate is positive.",
      inputKey: "reworkHours",
      direction: "increase_should_increase",
      outputKey: "reworkCost",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [
    ...STANDARD_MUST_NOT_CLAIM,
    "Nesting optimization guarantee",
    "Fabrication sign-off",
    "Guaranteed quote accuracy",
  ],
});

export const SHEET_METAL_SCRAP_RISK_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  SheetMetalScrapRiskCalculatorContract,
];
