/**
 * P62 — Printing reprint margin leak premium-schema FormulaContract.
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
import { PRINTING_REPRINT_MARGIN_LEAK_INPUT_KEYS } from "@/lib/features/premium-schema/calculators/printing-reprint-margin-leak-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, or print production advice. Verify assumptions before quoting or job acceptance.";

const METADATA_LAST_UPDATED = "2026-06-13";
const METADATA_VALID_UNTIL = "2027-06-13";

const MARGIN_PRESSURE_WARNING_THRESHOLD = 5;
const MARGIN_PRESSURE_CRITICAL_THRESHOLD = 12;

const REQUIRED_INPUTS = ["dummy"];

const OUTPUTS = [
  "reprintCost",
  "revisionCost",
  "totalExposure",
  "marginPressure",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict",
] as const;

export const PrintingReprintMarginLeakCalculatorContract: FormulaContract =
  buildAssuredCriticalContract({
    toolId: "premium-schema.printing-reprint-margin-leak",
    toolName: "Printing Reprint Margin Leak Calculator",
    slug: "printing-reprint-margin-leak",
    purpose:
      "Quantify reprint, design revision and install rework exposure as margin pressure on print job revenue.",
    userDecision:
      "What is total reprint exposure and margin pressure for this print job profile?",
    decisionImpact: "financial",
    requiredInputs: REQUIRED_INPUTS,
    criticalInputs: REQUIRED_INPUTS,
    outputs: ["dummy"],
    assumptions: [
      PREMIUM_SCHEMA_DISCLAIMER,
      "This tool estimates printing reprint margin leak from user-supplied revenue, material and revision inputs.",
      `Metadata lastUpdated: ${METADATA_LAST_UPDATED}.`,
      `Metadata validUntil: ${METADATA_VALID_UNTIL}.`,
      "reprintCost = materialCost × reprintRatePercent ÷ 100.",
      "revisionCost = designRevisionHours × laborRate.",
      "totalExposure = reprintCost + revisionCost + installReworkCost.",
      "marginPressure = totalExposure ÷ jobRevenue × 100.",
      `summaryLevel low when marginPressure < ${MARGIN_PRESSURE_WARNING_THRESHOLD}; warning when ${MARGIN_PRESSURE_WARNING_THRESHOLD} ≤ marginPressure < ${MARGIN_PRESSURE_CRITICAL_THRESHOLD}; critical when marginPressure ≥ ${MARGIN_PRESSURE_CRITICAL_THRESHOLD}.`,
      calculatorProductionAssumption(
        "src/lib/premium-schema/calculators/printing-reprint-margin-leak-validation.ts",
        "validatePrintingReprintMarginLeakInputs(inputs) → validation errors and warnings",
      ),
      calculatorProductionAssumption(
        "src/lib/premium-schema/calculators/printing-reprint-margin-leak.ts",
        "calculatePrintingReprintMarginLeak(inputs) → reprint metrics and decisionVerdict",
      ),
    ],
    formulaSummary:
      "Deterministic reprint, revision and install rework stack with margin pressure percent; summaryLevel follows schema marginPressure thresholds.",
    missingParameterWarnings: [],
    warningPolicy: createWarningPolicy({
      acceptedAssumptions: [
        GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
        "Job revenue and cost inputs align to the same print contract scope.",
        "Reprint rate percent supplied from historical similar-job band.",
      ],
      modelLimitations: [
        "Not a color management or pre-press certification tool.",
        "Does not model ink chemistry, substrate variance or installation weather delays.",
        "Does not guarantee job profit or bid accuracy.",
      ],
      futureExtensions: [
        "Color proof bands and substrate variance attribution.",
        "Installation weather delay and field rework linkage.",
      ],
    }),
    validationRules: [
      {
        id: "job-revenue-positive",
        description: "jobRevenue must be greater than zero.",
        kind: "edge",
      },
      {
        id: "reprint-rate-range",
        description: "reprintRatePercent must be between 0 and 100.",
        kind: "edge",
      },
      {
        id: "non-negative-costs",
        description: "Material, labor and install rework inputs must be non-negative.",
        kind: "edge",
      },
      {
        id: "finite-inputs",
        description: "All inputs must be finite numbers; missing or NaN inputs fail validation.",
        kind: "edge",
      },
    ],
    scenarioSpecs: [
      { id: "normal-reprint", description: "Moderate reprint rate with low margin pressure." },
      { id: "warning-pressure", description: "Margin pressure between warning and critical thresholds." },
      { id: "critical-pressure", description: "Margin pressure at or above critical threshold." },
    ],
    monotonicityRules: [
      {
        id: "reprint-up-cost",
        description: "Higher reprintRatePercent must not decrease reprintCost when material cost is positive.",
        inputKey: "reprintRatePercent",
        direction: "increase_should_increase",
        outputKey: "reprintCost",
      },
      {
        id: "revision-up-cost",
        description: "Higher designRevisionHours must not decrease revisionCost when labor rate is positive.",
        inputKey: "designRevisionHours",
        direction: "increase_should_increase",
        outputKey: "revisionCost",
      },
    ],
    decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
    mustNotClaim: [
      ...STANDARD_MUST_NOT_CLAIM,
      "Color management certification",
      "Guaranteed job profit",
      "Pre-press sign-off",
    ],
  });

export const PRINTING_REPRINT_MARGIN_LEAK_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] =
  [PrintingReprintMarginLeakCalculatorContract];
