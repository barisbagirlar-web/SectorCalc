import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const KlimaBtuSecimHesaplama_SCHEMA: PremiumCalculatorSchema = {
  id: "klima-btu-secim-hesaplama",
  name: "Klima BTU Seçim Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "ASHRAE Handbook of Fundamentals, cooling load temperature difference (CLTD) method",

  inputs: [
    {
      id: "roomArea",
      label: "Room area",
      type: "number",
      unit: "m²",
      required: true,
      smartDefault: 25,
      validation: { min: 1, max: 1000 },
      helper: "Must be positive number",
      expertMeaning: "Room area",
    },
    {
      id: "solarHeatGain",
      label: "Solar heat gain per m²",
      type: "number",
      unit: "W/m²",
      required: true,
      smartDefault: 100,
      validation: { min: 0, max: 500 },
      helper: "Non-negative, typical range 0-500",
      expertMeaning: "Solar heat gain per m²",
    },
    {
      id: "conductionHeatGain",
      label: "Conduction heat gain per m²",
      type: "number",
      unit: "W/m²",
      required: true,
      smartDefault: 50,
      validation: { min: 0, max: 200 },
      helper: "Non-negative, typical range 0-200",
      expertMeaning: "Conduction heat gain per m²",
    },
    {
      id: "internalHeatGain",
      label: "Internal heat gain (appliances, lighting, people)",
      type: "number",
      unit: "W",
      required: true,
      smartDefault: 500,
      validation: { min: 0, max: 5000 },
      helper: "Non-negative, typical range 0-5000",
      expertMeaning: "Internal heat gain (appliances, lighting, people)",
    },
    {
      id: "occupants",
      label: "Number of occupants",
      type: "number",
      unit: "persons",
      required: true,
      smartDefault: 2,
      validation: { min: 1, max: 100 },
      helper: "Must be positive integer",
      expertMeaning: "Number of occupants",
    },
    {
      id: "insulationFactor",
      label: "Insulation factor",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 1,
      validation: { min: 0.5, max: 2 },
      helper: "0.5 (excellent) to 2.0 (very poor), typical 0.8-1.2",
      expertMeaning: "Insulation factor",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "roomArea",
        "b": "solarHeatGain",
        "c": "conductionHeatGain"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "roomArea",
        "target": "solarHeatGain"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Required cooling capacity",
      unit: "BTU/hr",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Recommended standard BTU capacity",
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
      "Standard ceiling height (2.7 m) assumed; for higher ceilings, apply correction factor.",
      "Internal heat gain includes typical appliances and lighting; adjust if unusual equipment present.",
      "Solar and conduction heat gains are based on typical construction; actual values may vary.",
    ],
  },
};
