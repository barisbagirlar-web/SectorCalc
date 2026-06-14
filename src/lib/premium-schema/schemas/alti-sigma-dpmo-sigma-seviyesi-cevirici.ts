import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const AltiSigmaDpmoSigmaSeviyesiCevirici_SCHEMA: PremiumCalculatorSchema = {
  id: "alti-sigma-dpmo-sigma-seviyesi-cevirici",
  name: "Altı Sigma — DPMO — Sigma Seviyesi Converter",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Six Sigma quality methodology using standard normal distribution inverse (Z-table approximation)",

  inputs: [
    {
      id: "totalUnits",
      label: "Total Units Inspected",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 1000,
      validation: { min: 1, max: 1000000000 },
      helper: "Must be positive integer",
      expertMeaning: "Total Units Inspected",
    },
    {
      id: "totalDefects",
      label: "Total Defects Found",
      type: "number",
      unit: "defects",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 1000000000 },
      helper: "Non-negative integer",
      expertMeaning: "Total Defects Found",
    },
    {
      id: "opportunitiesPerUnit",
      label: "Opportunities per Unit",
      type: "number",
      unit: "opportunities",
      required: true,
      smartDefault: 1,
      validation: { min: 1, max: 10000 },
      helper: "Must be positive integer",
      expertMeaning: "Opportunities per Unit",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "totalUnits",
        "b": "totalDefects",
        "c": "opportunitiesPerUnit"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "totalUnits",
        "target": "totalDefects"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Defects Per Million Opportunities (DPMO)",
      unit: "defects per million",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Sigma Level (Short-Term with 1.5 Shift)",
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
      "Defects are independent and randomly distributed",
      "Process is stable and in statistical control",
      "Short-term sigma includes 1.5 sigma shift (Motorola convention)",
    ],
  },
};
