import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const IsiDegistiriciEsanjorKapasiteHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "isi-degistirici-esanjor-kapasite-hesabi",
  name: "Isı Değiştirici (Eşanjör) Kapasite Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Heat transfer engineering, ASME PTC 12.5",

  inputs: [
    {
      id: "hotFluidInletTemp",
      label: "Hot fluid inlet temperature",
      type: "number",
      unit: "°C",
      required: true,
      smartDefault: 90,
      validation: { min: -50, max: 1000 },
      helper: "Must be greater than hot fluid outlet temperature",
      expertMeaning: "Hot fluid inlet temperature",
    },
    {
      id: "hotFluidOutletTemp",
      label: "Hot fluid outlet temperature",
      type: "number",
      unit: "°C",
      required: true,
      smartDefault: 60,
      validation: { min: -50, max: 1000 },
      helper: "Must be less than hot fluid inlet temperature",
      expertMeaning: "Hot fluid outlet temperature",
    },
    {
      id: "coldFluidInletTemp",
      label: "Cold fluid inlet temperature",
      type: "number",
      unit: "°C",
      required: true,
      smartDefault: 20,
      validation: { min: -50, max: 1000 },
      helper: "Must be less than cold fluid outlet temperature",
      expertMeaning: "Cold fluid inlet temperature",
    },
    {
      id: "coldFluidOutletTemp",
      label: "Cold fluid outlet temperature",
      type: "number",
      unit: "°C",
      required: true,
      smartDefault: 40,
      validation: { min: -50, max: 1000 },
      helper: "Must be greater than cold fluid inlet temperature",
      expertMeaning: "Cold fluid outlet temperature",
    },
    {
      id: "overallHeatTransferCoefficient",
      label: "Overall heat transfer coefficient (U)",
      type: "number",
      unit: "W/(m²·K)",
      required: true,
      smartDefault: 500,
      validation: { min: 1, max: 10000 },
      helper: "Positive value typical for heat exchangers",
      expertMeaning: "Overall heat transfer coefficient (U)",
    },
    {
      id: "foulingMarginPercent",
      label: "Fouling margin",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Fouling margin",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "hotFluidInletTemp",
        "b": "hotFluidOutletTemp",
        "c": "coldFluidInletTemp"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "hotFluidInletTemp",
        "target": "hotFluidOutletTemp"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Heat transfer rate (Q)",
      unit: "kW",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Required heat transfer area (A_design)",
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
      "Constant specific heats",
      "Negligible heat loss to surroundings",
    ],
  },
};
