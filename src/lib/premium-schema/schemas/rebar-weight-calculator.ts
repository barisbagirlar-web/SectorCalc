import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const RebarWeightCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "rebar-weight-calculator",
  name: "Rebar Weight Calculator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "ASTM A615 / TS 708 standard rebar weight formula",

  inputs: [
    {
      id: "nominalDiameter",
      label: "Nominal diameter",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 12,
      validation: { min: 6, max: 50 },
      helper: "Must be between 6 and 50 mm (standard rebar sizes)",
      expertMeaning: "Nominal diameter",
    },
    {
      id: "totalLength",
      label: "Total length",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 12,
      validation: { min: 0.1, max: 100000 },
      helper: "Must be positive",
      expertMeaning: "Total length",
    },
    {
      id: "unitPricePerKg",
      label: "Unit price per kg",
      type: "number",
      unit: "USD/kg",
      required: true,
      smartDefault: 0.8,
      validation: { min: 0, max: 100 },
      helper: "Non-negative",
      expertMeaning: "Unit price per kg",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "nominalDiameter",
        "b": "totalLength",
        "c": "unitPricePerKg"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "nominalDiameter",
        "target": "totalLength"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Weight per meter",
      unit: "kg/m",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total weight",
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
      "Steel density is constant at 7850 kg/m³",
      "Rebar is plain or deformed with nominal diameter as per standard",
      "No allowance for bending or cutting losses",
    ],
  },
};
