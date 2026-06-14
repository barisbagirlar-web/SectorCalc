import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const KaynakMaliyetiVeDolguMetaliTuketimCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "kaynak-maliyeti-ve-dolgu-metali-tuketim-calculator",
  name: "Kaynak Maliyeti Ve Dolgu Metali Tuketim",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Standard welding engineering cost estimation (AWS D1.1, ISO 3834)",

  inputs: [
    {
      id: "weldSize",
      label: "Weld size (leg length)",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 6,
      validation: { min: 1, max: 100 },
      helper: "Must be positive, typical fillet weld leg length",
      expertMeaning: "Weld size (leg length)",
    },
    {
      id: "weldLength",
      label: "Weld length per joint",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 100,
      validation: { min: 1, max: 10000 },
      helper: "Must be positive",
      expertMeaning: "Weld length per joint",
    },
    {
      id: "numberOfJoints",
      label: "Number of joints",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 1,
      validation: { min: 1, max: 100000 },
      helper: "Must be positive integer",
      expertMeaning: "Number of joints",
    },
    {
      id: "fillerDensity",
      label: "Filler metal density",
      type: "number",
      unit: "kg/m^3",
      required: true,
      smartDefault: 7850,
      validation: { min: 1000, max: 20000 },
      helper: "Typical steel density ~7850 kg/m^3",
      expertMeaning: "Filler metal density",
    },
    {
      id: "depositionEfficiency",
      label: "Deposition efficiency",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 85,
      validation: { min: 10, max: 100, step: 0.1 },
      helper: "Percent between 10 and 100",
      expertMeaning: "Deposition efficiency",
    },
    {
      id: "unitCostFiller",
      label: "Filler metal unit cost",
      type: "number",
      unit: "USD/kg",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative currency per kg",
      expertMeaning: "Filler metal unit cost",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "weldSize",
        "b": "weldLength",
        "c": "numberOfJoints"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "weldSize",
        "target": "weldLength"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total cost for all joints",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Cost per joint",
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
      "Fillet weld geometry assumed (triangular cross-section)",
      "Deposition efficiency constant across all joints",
      "Labor rate includes all direct labor burden",
    ],
  },
};
