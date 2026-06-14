import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const KritiklikRiskMatrisiVeBakimStratejisiSecimCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "kritiklik-risk-matrisi-ve-bakim-stratejisi-secim-calculator",
  name: "Kritiklik Risk Matrisi Ve Bakim Stratejisi Secim",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Reliability centered maintenance (RCM) and risk assessment",

  inputs: [
    {
      id: "downtimeMinutes",
      label: "Downtime per failure (minutes)",
      type: "number",
      unit: "minutes",
      required: true,
      smartDefault: 60,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative time",
      expertMeaning: "Downtime per failure (minutes)",
    },
    {
      id: "machineHourlyRate",
      label: "Machine hourly rate",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 100,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative rate",
      expertMeaning: "Machine hourly rate",
    },
    {
      id: "laborHourlyRate",
      label: "Labor hourly rate",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 50,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative rate",
      expertMeaning: "Labor hourly rate",
    },
    {
      id: "lostProductionUnits",
      label: "Lost production units per failure",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative integer",
      expertMeaning: "Lost production units per failure",
    },
    {
      id: "contributionMarginPerUnit",
      label: "Contribution margin per unit",
      type: "number",
      unit: "USD/unit",
      required: true,
      smartDefault: 20,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative margin",
      expertMeaning: "Contribution margin per unit",
    },
    {
      id: "repairCost",
      label: "Repair cost per failure",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 500,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative cost",
      expertMeaning: "Repair cost per failure",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "downtimeMinutes",
        "b": "machineHourlyRate",
        "c": "laborHourlyRate"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "downtimeMinutes",
        "target": "machineHourlyRate"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total downtime exposure cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Lost contribution margin",
      unit: "%",
      format: "percentage",
      isBigNumber: false,
    }
  ],

  thresholds: [
    {
      fieldId: "totalExposure",
      warning: 1,
      critical: 3,
      direction: "higher_is_bad",
      warningMessage: "Exposure is entering warning band — review drivers.",
      criticalMessage: "Exposure is critical — immediate operational review required.",
    },
  ],

  reportTemplate: {
    title: "[object Object] Decision Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.05,
    volatilityPercent: 8,
    targetMarginPercent: 15,
    assumptionNotes: [
      "All failures are independent",
      "MTBF and MTTR are constant over the period",
      "Lost production is linear with downtime",
    ],
  },
};
