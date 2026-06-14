import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const SogutmaSivisiKarisimOraniAntifrizBorYagiHesaplama_SCHEMA: PremiumCalculatorSchema = {
  id: "sogutma-sivisi-karisim-orani-antifriz-bor-yagi-hesaplama",
  name: "Soğutma Sıvısı Karışım Oranı (Antifriz/Bor Yağı) Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Standard industrial coolant preparation practice based on volume ratios and temperature protection requirements",

  inputs: [
    {
      id: "totalVolume",
      label: "Total coolant volume",
      type: "number",
      unit: "L",
      required: true,
      smartDefault: 10,
      validation: { min: 0.1, max: 10000 },
      helper: "Must be positive",
      expertMeaning: "Total coolant volume",
    },
    {
      id: "desiredConcentration",
      label: "Desired antifreeze concentration",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 50,
      validation: { min: 1, max: 100, step: 0.1 },
      helper: "Percent between 1 and 100",
      expertMeaning: "Desired antifreeze concentration",
    },
    {
      id: "boricOilRatio",
      label: "Boric oil ratio (if used)",
      type: "number",
      unit: "%",
      required: false,
      smartDefault: 0,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100; if 0, no boric oil added",
      expertMeaning: "Boric oil ratio (if used)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "totalVolume",
        "b": "desiredConcentration",
        "c": "boricOilRatio"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "totalVolume",
        "target": "desiredConcentration"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Antifreeze volume",
      unit: "L",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Water volume",
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
      "Antifreeze and boric oil are pure concentrates",
      "Water is pure (no dissolved solids affecting volume)",
      "Temperature protection is directly proportional to concentration",
    ],
  },
};
