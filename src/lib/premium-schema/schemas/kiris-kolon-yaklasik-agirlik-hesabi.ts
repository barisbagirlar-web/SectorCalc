import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const KirisKolonYaklasikAgirlikHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "kiris-kolon-yaklasik-agirlik-hesabi",
  name: "Kiriş — Kolon Yaklaşık Ağırlık Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Civil engineering reinforced concrete design standards (TS 500, ACI 318)",

  inputs: [
    {
      id: "elementWidth",
      label: "Element width",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 0.3,
      validation: { min: 0.1, max: 5 },
      helper: "Must be positive, typical beam/column width 0.1-5 m",
      expertMeaning: "Element width",
    },
    {
      id: "elementDepth",
      label: "Element depth",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 0.5,
      validation: { min: 0.1, max: 5 },
      helper: "Must be positive, typical beam/column depth 0.1-5 m",
      expertMeaning: "Element depth",
    },
    {
      id: "elementLength",
      label: "Element length",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 4,
      validation: { min: 0.5, max: 20 },
      helper: "Must be positive, typical beam/column length 0.5-20 m",
      expertMeaning: "Element length",
    },
    {
      id: "reinforcementRatioPercent",
      label: "Reinforcement ratio",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 1.5,
      validation: { min: 0.5, max: 4, step: 0.1 },
      helper: "Typical reinforcement ratio 0.5-4%",
      expertMeaning: "Reinforcement ratio",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "elementWidth",
        "b": "elementDepth",
        "c": "elementLength"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "elementWidth",
        "target": "elementDepth"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total weight (mass)",
      unit: "kg",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total weight (force)",
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
      "Unit weight of reinforced concrete is 2500 kg/m³ (mass) or 25 kN/m³ (weight)",
      "Steel density is 7850 kg/m³",
      "Reinforcement ratio is by volume of concrete",
    ],
  },
};
