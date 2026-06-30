/**
 * P62 — CNC tool wear cost premium-schema FormulaContract.
 */

import type { FormulaContract } from "@/lib/features/formula-governance/types";
import {
  GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
  STANDARD_DECISION_LANGUAGE_RULE,
  STANDARD_MUST_NOT_CLAIM,
  buildAssuredCriticalContract,
  calculatorProductionAssumption,
} from "@/lib/features/formula-governance/contracts/shared";
import { createWarningPolicy } from "@/lib/features/formula-governance/warning-policy";
import { CNC_TOOL_WEAR_COST_INPUT_KEYS } from "@/lib/features/premium-schema/calculators/cnc-tool-wear-cost-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, or manufacturing advice. Verify assumptions before quoting or production decisions.";

const METADATA_LAST_UPDATED = "2026-06-13";
const METADATA_VALID_UNTIL = "2027-06-13";

const TOOL_COST_PER_PART_WARNING_THRESHOLD = 0.5;
const TOOL_COST_PER_PART_CRITICAL_THRESHOLD = 1.5;

const REQUIRED_INPUTS = ["dummy"];

const OUTPUTS = [
  "toolCostPerPart",
  "toolChangeDowntimeCost",
  "totalExposure",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict",
] as const;

export const CncToolWearCostCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.cnc-tool-wear-cost",
  toolName: "CNC Tool Wear Cost Calculator",
  slug: "cnc-tool-wear-cost",
  purpose:
    "Quantify per-part tool cost, changeover downtime and total tool wear exposure for CNC production jobs.",
  userDecision:
    "What is the per-part tool cost and total tool wear exposure for this monthly tooling profile?",
  decisionImpact: "financial",
  requiredInputs: REQUIRED_INPUTS,
  criticalInputs: REQUIRED_INPUTS,
  outputs: ["dummy"],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    "This tool estimates tool wear exposure from user-supplied monthly tool spend, volume and changeover inputs.",
    `Metadata lastUpdated: ${METADATA_LAST_UPDATED}.`,
    `Metadata validUntil: ${METADATA_VALID_UNTIL}.`,
    "toolCostPerPart = monthlyToolCost ÷ partsProduced.",
    "toolChangeDowntimeCost = (toolChangeMinutes ÷ 60) × changesPerMonth × hourlyCost.",
    "totalExposure = monthlyToolCost + toolChangeDowntimeCost + coolantCost.",
    `summaryLevel low when toolCostPerPart < ${TOOL_COST_PER_PART_WARNING_THRESHOLD}; warning when ${TOOL_COST_PER_PART_WARNING_THRESHOLD} ≤ toolCostPerPart < ${TOOL_COST_PER_PART_CRITICAL_THRESHOLD}; critical when toolCostPerPart ≥ ${TOOL_COST_PER_PART_CRITICAL_THRESHOLD}.`,
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/cnc-tool-wear-cost-validation.ts",
      "validateCncToolWearCostInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/cnc-tool-wear-cost.ts",
      "calculateCncToolWearCost(inputs) → tool wear metrics and decisionVerdict",
    ),
  ],
  formulaSummary:
    "Deterministic per-part tool cost, changeover downtime and total exposure; summaryLevel follows schema toolCostPerPart thresholds.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "Monthly tool spend and parts produced align to the same production period.",
      "Loaded hourly cost supplied by the user for changeover downtime.",
    ],
    modelLimitations: [
      "Not a CAM toolpath optimizer or insert life prediction engine.",
      "Does not model coolant chemistry, chip load or multi-operation nesting.",
      "Does not guarantee quoting accuracy or shop margin recovery.",
    ],
    futureExtensions: [
      "Insert life curves and per-operation tool allocation.",
      "Coolant consumption tied to spindle hours.",
    ],
  }),
  validationRules: [
    {
      id: "parts-produced-min",
      description: "partsProduced must be greater than or equal to 1.",
      kind: "edge",
    },
    {
      id: "non-negative-costs",
      description: "Tool, hourly and coolant inputs must be non-negative.",
      kind: "edge",
    },
    {
      id: "finite-inputs",
      description: "All inputs must be finite numbers; missing or NaN inputs fail validation.",
      kind: "edge",
    },
  ],
  scenarioSpecs: [
    { id: "normal-wear", description: "Moderate per-part tool cost with typical changeover time." },
    { id: "warning-band", description: "Per-part tool cost between warning and critical thresholds." },
    { id: "critical-band", description: "Per-part tool cost at or above critical threshold." },
  ],
  monotonicityRules: [
    {
      id: "tool-spend-up-exposure",
      description: "Higher monthlyToolCost must not decrease totalExposure.",
      inputKey: "monthlyToolCost",
      direction: "increase_should_increase",
      outputKey: "totalExposure",
    },
    {
      id: "changes-up-downtime",
      description: "Higher changesPerMonth must not decrease toolChangeDowntimeCost when hourly cost is positive.",
      inputKey: "changesPerMonth",
      direction: "increase_should_increase",
      outputKey: "toolChangeDowntimeCost",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [
    ...STANDARD_MUST_NOT_CLAIM,
    "Guaranteed insert life",
    "CAM optimization",
    "Production sign-off",
  ],
});

export const CNC_TOOL_WEAR_COST_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  CncToolWearCostCalculatorContract,
];
