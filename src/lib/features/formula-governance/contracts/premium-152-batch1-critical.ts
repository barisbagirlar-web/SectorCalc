/**
 * Premium 152 — batch 1 FormulaContracts (lean + additive manufacturing).
 */

import type { FormulaContract } from "@/lib/features/formula-governance/types";
import {
  STANDARD_DECISION_LANGUAGE_RULE,
  STANDARD_MUST_NOT_CLAIM,
  buildAssuredCriticalContract,
  calculatorProductionAssumption,
} from "@/lib/features/formula-governance/contracts/shared";
import { createWarningPolicy } from "@/lib/features/formula-governance/warning-policy";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, or engineering advice. Verify assumptions before bid, pricing or business decisions.";

const BATCH1_SCENARIO = [
  {
    id: "finite-positive-output",
    description: "Representative inputs produce finite non-negative primary output.",
  },
] as const;

function buildBatchContract(config: {
  slug: string;
  toolName: string;
  purpose: string;
  userDecision: string;
  requiredInputs: readonly string[];
  outputs: readonly string[];
  productionEntry: string;
}): FormulaContract {
  return buildAssuredCriticalContract({
    toolId: `premium-schema.${config.slug}`,
    toolName: config.toolName,
    slug: config.slug,
    purpose: config.purpose,
    userDecision: config.userDecision,
    decisionImpact: "operational",
    requiredInputs: config.requiredInputs,
    criticalInputs: config.requiredInputs.slice(0, 5),
    outputs: config.outputs,
    assumptions: [
      PREMIUM_SCHEMA_DISCLAIMER,
      calculatorProductionAssumption(
        "src/lib/premium-schema/premium-schema-engine.ts",
        config.productionEntry,
      ),
    ],
    formulaSummary: config.purpose,
    missingParameterWarnings: [],
    warningPolicy: createWarningPolicy({
      acceptedAssumptions: [PREMIUM_SCHEMA_DISCLAIMER],
      modelLimitations: ["Operational estimate only — not audited financial advice."],
      futureExtensions: ["ERP actuals import and sector benchmark overlays."],
    }),
    validationRules: [
      {
        id: "required-inputs-present",
        description: "All required schema inputs must be present before calculation.",
        kind: "edge",
      },
    ],
    scenarioSpecs: BATCH1_SCENARIO,
    monotonicityRules: [],
    decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
    mustNotClaim: [...STANDARD_MUST_NOT_CLAIM],
  });
}

export const ThreeBPrintingSupportPostProcessContract = buildBatchContract({
  slug: "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator",
  toolName: "3D Printing Support & Post-Process Cost Calculator",
  purpose: "Expose support material and cleaning labor costs that are often omitted from additive quotes.",
  userDecision: "What is the true post-process cost for this build batch?",
  requiredInputs: [
    "supportVolumeCm3",
    "materialCostPerCm3",
    "cleaningTimeMinutes",
    "laborRatePerHour",
    "batchQuantity",
  ],
  outputs: ["totalPostProcessCost", "supportMaterialCost", "cleaningLaborCost", "postProcessCostPerPart"],
  productionEntry: "runPremiumSchemaEngine → THREE_B_PRINTING_SUPPORT_POST_PROCESS_SCHEMA",
});

export const ThreeBPrintingBatchNestingContract = buildBatchContract({
  slug: "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator",
  toolName: "3D Printing Batch Nesting Optimizer",
  purpose: "Estimate how many parts fit per bed and the resulting utilization rate.",
  userDecision: "How many parts fit on the bed and is utilization strong enough?",
  requiredInputs: ["bedWidthMm", "bedDepthMm", "partWidthMm", "partDepthMm", "printTimeHours"],
  outputs: ["maxPartsPerBatch", "utilizationRatePct", "partsPerRow", "partsPerColumn", "machineHoursPerPart"],
  productionEntry: "runPremiumSchemaEngine → THREE_B_PRINTING_BATCH_NESTING_SCHEMA",
});

export const ThreeBPrintingVsMachiningBreakevenContract = buildBatchContract({
  slug: "3b-baski-vs-talasli-imalat-basabas-noktasi-calculator",
  toolName: "3D Printing vs Machining Break-Even Calculator",
  purpose: "Compare additive and machining cost curves to find crossover quantity.",
  userDecision: "At what quantity does additive become cheaper than machining?",
  requiredInputs: [
    "printingSetupCost",
    "printingUnitCost",
    "machiningSetupCost",
    "machiningUnitCost",
    "analysisQuantity",
  ],
  outputs: ["breakEvenQuantity", "printingTotalCost", "machiningTotalCost", "totalCostDelta"],
  productionEntry: "runPremiumSchemaEngine → THREE_B_PRINTING_VS_MACHINING_BREAKEVEN_SCHEMA",
});

export const FiveSAuditEfficiencyLossContract = buildBatchContract({
  slug: "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator",
  toolName: "5S Audit Score Efficiency Loss Cost Converter",
  purpose: "Translate 5S audit scores into monthly efficiency loss and improvement potential.",
  userDecision: "What is the monetary cost of the current 5S gap?",
  requiredInputs: [
    "current5sScore",
    "target5sScore",
    "totalEmployees",
    "avgHourlyCost",
    "monthlyWorkingHours",
  ],
  outputs: ["monthlyLossCost", "efficiencyLossPct", "improvementPotentialCost", "improvementGapPct"],
  productionEntry: "runPremiumSchemaEngine → FIVE_S_AUDIT_EFFICIENCY_LOSS_SCHEMA",
});

export const PREMIUM_152_BATCH1_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  ThreeBPrintingSupportPostProcessContract,
  ThreeBPrintingBatchNestingContract,
  ThreeBPrintingVsMachiningBreakevenContract,
  FiveSAuditEfficiencyLossContract,
];
