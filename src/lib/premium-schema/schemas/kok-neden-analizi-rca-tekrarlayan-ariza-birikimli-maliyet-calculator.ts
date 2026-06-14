import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const KokNedenAnaliziRcaTekrarlayanArizaBirikimliMaliyetCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "kok-neden-analizi-rca-tekrarlayan-ariza-birikimli-maliyet-calculator",
  name: "Kok Neden Analizi Rca Tekrarlayan Ariza Birikimli Maliyet",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Reliability engineering and cost accounting standards (ISO 14224, IEC 60300-3-3)",

  inputs: [
    {
      id: "downtimeMinutes",
      label: "Downtime per failure (minutes)",
      type: "number",
      unit: "minutes",
      required: true,
      smartDefault: 60,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative integer",
      expertMeaning: "Downtime per failure (minutes)",
    },
    {
      id: "machineHourlyRate",
      label: "Machine hourly rate",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 100,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "Machine hourly rate",
    },
    {
      id: "laborHourlyRate",
      label: "Labor hourly rate",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 50,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
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
      helper: "Non-negative currency",
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
      helper: "Non-negative currency",
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
      label: "Total downtime cost",
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
      "All failures are independent and follow a constant failure rate.",
      "Downtime per failure is constant across failures.",
      "Machine and labor rates are constant.",
    ],
  },
};
