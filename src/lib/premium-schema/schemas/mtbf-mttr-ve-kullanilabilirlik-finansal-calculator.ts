import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const MtbfMttrVeKullanilabilirlikFinansalCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "mtbf-mttr-ve-kullanilabilirlik-finansal-calculator",
  name: "Mtbf Mttr Ve Kullanilabilirlik Finansal",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Maintenance reliability engineering and cost accounting",

  inputs: [
    {
      id: "downtimeMinutes",
      label: "Downtime minutes",
      type: "number",
      unit: "minutes",
      required: true,
      smartDefault: 60,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative",
      expertMeaning: "Downtime minutes",
    },
    {
      id: "machineHourlyRate",
      label: "Machine hourly rate",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 100,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative",
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
      helper: "Non-negative",
      expertMeaning: "Labor hourly rate",
    },
    {
      id: "lostProductionUnits",
      label: "Lost production units",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 100,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative integer",
      expertMeaning: "Lost production units",
    },
    {
      id: "contributionMarginPerUnit",
      label: "Contribution margin per unit",
      type: "number",
      unit: "USD/unit",
      required: true,
      smartDefault: 20,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative",
      expertMeaning: "Contribution margin per unit",
    },
    {
      id: "repairCost",
      label: "Repair cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 500,
      validation: { min: 0, max: 10000000 },
      helper: "Non-negative",
      expertMeaning: "Repair cost",
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
      label: "Total downtime cost (machine + labor)",
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
      "Machine and labor rates are constant during downtime",
      "Lost production units are valued at contribution margin",
      "Repair cost is a one-time expense",
    ],
  },
};
