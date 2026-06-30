/**
 * P6D — 3D Print Job Margin Tool premium-schema FormulaContract (identifier-safe manual patch).
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
import { THREE_D_PRINT_JOB_MARGIN_TOOL_INPUT_KEYS } from "@/lib/features/premium-schema/calculators/3d-print-job-margin-tool-validation";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, safety, or professional advice. Verify assumptions before business decisions.";

const REQUIRED_INPUTS = [...THREE_D_PRINT_JOB_MARGIN_TOOL_INPUT_KEYS];
const OUTPUTS = [
  "baseCost",
  "scrapCost",
  "overheadCost",
  "totalCost",
  "quotePrice",
  "grossProfit",
  "grossMarginPercent",
  "summaryLevel",
  "primaryDriver",
  "decisionVerdict",
] as const;

export const ThreeDPrintJobMarginToolCalculatorContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.3d-print-job-margin-tool",
  toolName: "3D Print Job Margin Tool",
  slug: "3d-print-job-margin-tool",
  purpose: "Estimate low-to-medium-risk 3D print job quote price with scrap, overhead and target margin included.",
  userDecision: "What is the deterministic quotePrice for this print job cost profile?",
  decisionImpact: "financial",
  requiredInputs: REQUIRED_INPUTS,
  criticalInputs: REQUIRED_INPUTS,
  outputs: [...OUTPUTS],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    "This tool provides deterministic cost/margin exposure estimation from declared inputs. It is not a regulatory, legal, safety, engineering or professional certification decision engine.",
    "Metadata lastUpdated: 2026-06-14.",
    "Metadata validUntil: 2027-06-14.",
    "baseCost = material + machine time + labor + electricity + post-processing.",
    "scrapCost = baseCost × failureScrapRatePercent ÷ 100.",
    "overheadCost = baseCost × overheadPercent ÷ 100.",
    "quotePrice = totalCost ÷ (1 − targetMarginPercent ÷ 100).",
    "summaryLevel uses failureScrapRatePercent thresholds warning 15 / critical 30 (higher_is_bad).",
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/3d-print-job-margin-tool-validation.ts",
      "validateThreeDPrintJobMarginToolInputs(inputs) → validation errors and warnings",
    ),
    calculatorProductionAssumption(
      "src/lib/premium-schema/calculators/3d-print-job-margin-tool.ts",
      "ThreeDPrintJobMarginToolCalculator(inputs) → quote metrics and decisionVerdict",
    ),
  ],
  formulaSummary:
    "Deterministic 3D print margin stack: base cost, scrap, overhead, target-margin quote price and gross margin percent.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "User-supplied numeric inputs align to the same job and billing period.",
    ],
    modelLimitations: [
      "Not a regulatory, legal, safety, or professional certification engine.",
      "Does not guarantee print success, part quality or operational outcomes.",
    ],
    futureExtensions: ["Machine-specific power curves and material batch variance packs."],
  }),
  validationRules: [
    {
      id: "required-numeric-inputs",
      description: "All required numeric inputs must be finite and within schema bounds.",
      kind: "edge",
    },
    {
      id: "finite-quote-price",
      description: "quotePrice must remain finite for admissible target margin inputs.",
      kind: "edge",
    },
  ],
  scenarioSpecs: [
    { id: "low-scrap-profile", description: "Simple low scrap baseline." },
    { id: "high-scrap-impact", description: "Elevated failure/scrap rate stress." },
    { id: "overhead-post-process", description: "Overhead and post-processing uplift." },
  ],
  monotonicityRules: [],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM, "Guaranteed savings", "Guaranteed margin"],
});

export const THREE_D_PRINT_JOB_MARGIN_TOOL_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  ThreeDPrintJobMarginToolCalculatorContract,
];
