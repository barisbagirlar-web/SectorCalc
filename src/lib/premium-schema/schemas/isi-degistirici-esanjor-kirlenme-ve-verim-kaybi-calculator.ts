import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const IsiDegistiriciEsanjorKirlenmeVeVerimKaybiCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "isi-degistirici-esanjor-kirlenme-ve-verim-kaybi-calculator",
  name: "Isi Degistirici Esanjor Kirlenme Ve Verim Kaybi",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Heat transfer engineering and TEMA standards",

  inputs: [
    {
      id: "heatTransferArea",
      label: "Heat transfer area",
      type: "number",
      unit: "m²",
      required: true,
      smartDefault: 100,
      validation: { min: 0.01, max: 10000 },
      helper: "Must be positive",
      expertMeaning: "Heat transfer area",
    },
    {
      id: "heatDuty",
      label: "Heat duty (Q)",
      type: "number",
      unit: "W",
      required: true,
      smartDefault: 500000,
      validation: { min: 1, max: 100000000 },
      helper: "Must be positive",
      expertMeaning: "Heat duty (Q)",
    },
    {
      id: "lmtdClean",
      label: "Log mean temperature difference (clean)",
      type: "number",
      unit: "K",
      required: true,
      smartDefault: 30,
      validation: { min: 0.1, max: 500 },
      helper: "Must be positive",
      expertMeaning: "Log mean temperature difference (clean)",
    },
    {
      id: "lmtdActual",
      label: "Log mean temperature difference (actual)",
      type: "number",
      unit: "K",
      required: true,
      smartDefault: 25,
      validation: { min: 0.1, max: 500 },
      helper: "Must be positive",
      expertMeaning: "Log mean temperature difference (actual)",
    },
    {
      id: "maxFoulingFactor",
      label: "Maximum allowable fouling factor",
      type: "number",
      unit: "m²K/W",
      required: true,
      smartDefault: 0.0005,
      validation: { min: 0, max: 0.01 },
      helper: "Non-negative, typical range 0 to 0.01",
      expertMeaning: "Maximum allowable fouling factor",
    },
    {
      id: "operatingHoursPerYear",
      label: "Operating hours per year",
      type: "number",
      unit: "h",
      required: true,
      smartDefault: 8000,
      validation: { min: 0, max: 8760 },
      helper: "Between 0 and 8760",
      expertMeaning: "Operating hours per year",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "heatTransferArea",
        "b": "heatDuty",
        "c": "lmtdClean"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "heatTransferArea",
        "target": "heatDuty"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Fouling factor (R_f)",
      unit: "m²K/W",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Efficiency loss",
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
      "Steady-state operation",
      "Negligible heat losses to surroundings",
      "Constant fluid properties",
    ],
  },
};
