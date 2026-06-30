/**
 * P62 — Warehouse space cost leak premium-schema FormulaContract.
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
import { WAREHOUSE_SPACE_COST_LEAK_INPUT_KEYS } from "@/lib/premium-schema/calculators/warehouse-space-cost-leak-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, or logistics advice. Verify assumptions before warehouse or lease decisions.";

const METADATA_LAST_UPDATED = "2026-06-13";
const METADATA_VALID_UNTIL = "2027-06-13";

const UNUSED_SPACE_PERCENT_WARNING_THRESHOLD = 10;
const UNUSED_SPACE_PERCENT_CRITICAL_THRESHOLD = 20;

const REQUIRED_INPUTS = ["dummy"];

const OUTPUTS = [
  "unusedSpaceCost",
  "handlingOverrunCost",
  "totalExposure",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict",
] as const;

export const WarehouseSpaceCostLeakCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.warehouse-space-cost-leak",
  toolName: "Warehouse Space Cost Leak Calculator",
  slug: "warehouse-space-cost-leak",
  purpose:
    "Quantify unused space rent leak and handling overrun cost as total warehouse exposure.",
  userDecision:
    "What is total warehouse space cost leak from unused rent and handling overrun for this facility profile?",
  decisionImpact: "financial",
  requiredInputs: REQUIRED_INPUTS,
  criticalInputs: REQUIRED_INPUTS,
  outputs: ["dummy"],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    "This tool estimates warehouse space cost leak from user-supplied rent, utilization and handling inputs.",
    `Metadata lastUpdated: ${METADATA_LAST_UPDATED}.`,
    `Metadata validUntil: ${METADATA_VALID_UNTIL}.`,
    "unusedSpaceCost = monthlyRent × unusedSpacePercent ÷ 100.",
    "handlingOverrunCost = handlingOverrunHours × hourlyCost.",
    "totalExposure = unusedSpaceCost + handlingOverrunCost.",
    `summaryLevel low when unusedSpacePercent < ${UNUSED_SPACE_PERCENT_WARNING_THRESHOLD}; warning when ${UNUSED_SPACE_PERCENT_WARNING_THRESHOLD} ≤ unusedSpacePercent < ${UNUSED_SPACE_PERCENT_CRITICAL_THRESHOLD}; critical when unusedSpacePercent ≥ ${UNUSED_SPACE_PERCENT_CRITICAL_THRESHOLD}.`,
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/warehouse-space-cost-leak-validation.ts",
      "validateWarehouseSpaceCostLeakInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/warehouse-space-cost-leak.ts",
      "calculateWarehouseSpaceCostLeak(inputs) → space leak metrics and decisionVerdict",
    ),
  ],
  formulaSummary:
    "Deterministic unused space rent leak and handling overrun stack; summaryLevel follows schema unusedSpacePercent thresholds with totalExposure as primary driver.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "Monthly rent and unused space percent align to the same facility period.",
      "Total floor area is contextual — not used in exposure calculation.",
    ],
    modelLimitations: [
      "Not a WMS slotting optimizer or lease negotiation engine.",
      "Does not model seasonal demand, cross-dock peaks or automation ROI.",
      "Does not guarantee utilization recovery or lease savings.",
    ],
    futureExtensions: [
      "Zone-level utilization and pick path optimization bands.",
      "Seasonal demand curves and automation ROI linkage.",
    ],
  }),
  validationRules: [
    {
      id: "total-sqm-min",
      description: "totalSqm must be greater than or equal to 1.",
      kind: "edge",
    },
    {
      id: "unused-space-range",
      description: "unusedSpacePercent must be between 0 and 100.",
      kind: "edge",
    },
    {
      id: "non-negative-costs",
      description: "Rent, handling and hourly inputs must be non-negative.",
      kind: "edge",
    },
    {
      id: "finite-inputs",
      description: "All inputs must be finite numbers; missing or NaN inputs fail validation.",
      kind: "edge",
    },
  ],
  scenarioSpecs: [
    { id: "normal-utilization", description: "Low unused space with moderate handling overrun." },
    { id: "warning-space", description: "Unused space between warning and critical thresholds." },
    { id: "critical-space", description: "Unused space at or above critical threshold." },
  ],
  monotonicityRules: [
    {
      id: "unused-up-cost",
      description: "Higher unusedSpacePercent must not decrease unusedSpaceCost when rent is positive.",
      inputKey: "unusedSpacePercent",
      direction: "increase_should_increase",
      outputKey: "unusedSpaceCost",
    },
    {
      id: "hours-up-overrun",
      description: "Higher handlingOverrunHours must not decrease handlingOverrunCost when hourly cost is positive.",
      inputKey: "handlingOverrunHours",
      direction: "increase_should_increase",
      outputKey: "handlingOverrunCost",
    },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [
    ...STANDARD_MUST_NOT_CLAIM,
    "WMS optimization guarantee",
    "Lease negotiation outcome",
    "Utilization certification",
  ],
});

export const WAREHOUSE_SPACE_COST_LEAK_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  WarehouseSpaceCostLeakCalculatorContract,
];
