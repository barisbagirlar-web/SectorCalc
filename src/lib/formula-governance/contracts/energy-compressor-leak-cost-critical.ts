/**
 * P61 — Energy compressor leak cost premium-schema FormulaContract.
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
import { ENERGY_COMPRESSOR_LEAK_COST_INPUT_KEYS } from "@/lib/premium-schema/calculators/energy-compressor-leak-cost-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, or engineering advice. Verify assumptions before maintenance or energy decisions.";

const METADATA_LAST_UPDATED = "2026-06-13";
const METADATA_VALID_UNTIL = "2027-06-13";

const MONTHLY_COST_WARNING_THRESHOLD = 500;
const MONTHLY_COST_CRITICAL_THRESHOLD = 1500;

const REQUIRED_INPUTS = [...ENERGY_COMPRESSOR_LEAK_COST_INPUT_KEYS];

const OUTPUTS = [
  "leakKwh",
  "monthlyLeakCost",
  "annualLeakCost",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict",
] as const;

export const EnergyCompressorLeakCostCalculatorContract: FormulaContract =
  buildAssuredCriticalContract({
    toolId: "premium-schema.energy-compressor-leak-cost",
    toolName: "Compressor Leak Cost Calculator",
    slug: "energy-compressor-leak-cost",
    purpose:
      "Quantify compressed air leak kWh and monetary waste from compressor power, leak percent and operating hours.",
    userDecision:
      "What is the monthly and annual cost of compressed air leaks for this compressor profile?",
    decisionImpact: "financial",
    requiredInputs: REQUIRED_INPUTS,
    criticalInputs: REQUIRED_INPUTS,
    outputs: [...OUTPUTS],
    assumptions: [
      PREMIUM_SCHEMA_DISCLAIMER,
      "This tool estimates leak kWh and cost from user-supplied compressor power, hours and leak percent.",
      `Metadata lastUpdated: ${METADATA_LAST_UPDATED}.`,
      `Metadata validUntil: ${METADATA_VALID_UNTIL}.`,
      "leakKwh = compressorKw × operatingHours × leakPercent ÷ 100.",
      "monthlyLeakCost = leakKwh × energyRate.",
      "annualLeakCost = monthlyLeakCost × 12.",
      `summaryLevel low when monthlyLeakCost < ${MONTHLY_COST_WARNING_THRESHOLD}; warning when ${MONTHLY_COST_WARNING_THRESHOLD} ≤ monthlyLeakCost < ${MONTHLY_COST_CRITICAL_THRESHOLD}; critical when monthlyLeakCost ≥ ${MONTHLY_COST_CRITICAL_THRESHOLD}.`,
      calculatorProductionAssumption(
        "src/lib/premium-schema/calculators/energy-compressor-leak-cost-validation.ts",
        "validateEnergyCompressorLeakCostInputs(inputs) → validation errors and warnings",
      ),
      calculatorProductionAssumption(
        "src/lib/premium-schema/calculators/energy-compressor-leak-cost.ts",
        "calculateEnergyCompressorLeakCost(inputs) → leak cost metrics and decisionVerdict",
      ),
    ],
    formulaSummary:
      "Deterministic compressed air leak kWh and monthly/annual cost; summaryLevel follows schema monthlyLeakCost thresholds.",
    missingParameterWarnings: [],
    warningPolicy: createWarningPolicy({
      acceptedAssumptions: [
        GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
        "Leak percent supplied from audit band or user estimate.",
        "Single compressor scope; no multi-compressor plant allocation.",
      ],
      modelLimitations: [
        "Not an ultrasonic leak survey or maintenance work order system.",
        "Does not model pressure drop, load/unload cycles, or VSD efficiency curves.",
        "Does not guarantee leak repair savings or payback periods.",
      ],
      futureExtensions: [
        "Multi-compressor plant allocation and shift-profile hours.",
        "Repair payback from estimated leak reduction percent.",
      ],
    }),
    validationRules: [
      {
        id: "leak-percent-range",
        description: "leakPercent must be between 0 and 100.",
        kind: "edge",
      },
      {
        id: "non-negative-energy-inputs",
        description: "compressorKw, operatingHours and energyRate must be non-negative.",
        kind: "edge",
      },
      {
        id: "finite-inputs",
        description: "All inputs must be finite numbers; missing or NaN inputs fail validation.",
        kind: "edge",
      },
    ],
    scenarioSpecs: [
      { id: "normal-leak", description: "Moderate leak percent with typical operating hours." },
      { id: "warning-cost", description: "Monthly leak cost between warning and critical thresholds." },
      { id: "critical-cost", description: "Monthly leak cost at or above critical threshold." },
    ],
    monotonicityRules: [
      {
        id: "leak-up-cost",
        description: "Higher leakPercent must not decrease monthlyLeakCost when other inputs are fixed.",
        inputKey: "leakPercent",
        direction: "increase_should_increase",
        outputKey: "monthlyLeakCost",
      },
      {
        id: "rate-up-cost",
        description: "Higher energyRate must not decrease monthlyLeakCost.",
        inputKey: "energyRate",
        direction: "increase_should_increase",
        outputKey: "monthlyLeakCost",
      },
    ],
    decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
    mustNotClaim: [
      ...STANDARD_MUST_NOT_CLAIM,
      "Guaranteed energy savings",
      "Maintenance schedule",
      "Engineering sign-off",
    ],
  });

export const ENERGY_COMPRESSOR_LEAK_COST_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] =
  [EnergyCompressorLeakCostCalculatorContract];
