import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const SogukOdaSogutmaYukuHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "soguk-oda-sogutma-yuku-hesabi",
  name: "Soğuk Oda — Soğutma Yükü Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "ASHRAE Handbook - Refrigeration, heat gain through walls, infiltration, product load, and internal loads",

  inputs: [
    {
      id: "roomLength",
      label: "Room length",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 10,
      validation: { min: 0.1, max: 100 },
      helper: "Must be positive length",
      expertMeaning: "Room length",
    },
    {
      id: "roomWidth",
      label: "Room width",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 8,
      validation: { min: 0.1, max: 100 },
      helper: "Must be positive length",
      expertMeaning: "Room width",
    },
    {
      id: "roomHeight",
      label: "Room height",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 4,
      validation: { min: 0.1, max: 20 },
      helper: "Must be positive length",
      expertMeaning: "Room height",
    },
    {
      id: "wallUValue",
      label: "Wall U-value",
      type: "number",
      unit: "W/(m²·K)",
      required: true,
      smartDefault: 0.5,
      validation: { min: 0.1, max: 5 },
      helper: "Must be positive",
      expertMeaning: "Wall U-value",
    },
    {
      id: "ceilingUValue",
      label: "Ceiling U-value",
      type: "number",
      unit: "W/(m²·K)",
      required: true,
      smartDefault: 0.4,
      validation: { min: 0.1, max: 5 },
      helper: "Must be positive",
      expertMeaning: "Ceiling U-value",
    },
    {
      id: "floorUValue",
      label: "Floor U-value",
      type: "number",
      unit: "W/(m²·K)",
      required: true,
      smartDefault: 0.3,
      validation: { min: 0.1, max: 5 },
      helper: "Must be positive",
      expertMeaning: "Floor U-value",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "roomLength",
        "b": "roomWidth",
        "c": "roomHeight"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "roomLength",
        "target": "roomWidth"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Transmission load",
      unit: "kW",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Infiltration load",
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
      "Steady-state heat transfer",
      "Uniform wall/ceiling/floor U-values",
      "Air density constant at 1.2 kg/m³",
    ],
  },
};
