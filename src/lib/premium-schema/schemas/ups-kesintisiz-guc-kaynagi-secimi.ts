import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const UpsKesintisizGucKaynagiSecimi_SCHEMA: PremiumCalculatorSchema = {
  id: "ups-kesintisiz-guc-kaynagi-secimi",
  name: "UPS (Kesintisiz Güç Kaynağı) Seçimi",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "IEEE 446 / IEC 62040 standard UPS sizing methodology",

  inputs: [
    {
      id: "totalLoadVA",
      label: "Total connected load (VA)",
      type: "number",
      unit: "VA",
      required: true,
      smartDefault: 5000,
      validation: { min: 1, max: 10000000 },
      helper: "Must be positive integer",
      expertMeaning: "Total connected load (VA)",
    },
    {
      id: "diversityFactorPercent",
      label: "Diversity factor",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 80,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Diversity factor",
    },
    {
      id: "expansionMarginPercent",
      label: "Future expansion margin",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 20,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Future expansion margin",
    },
    {
      id: "requiredAutonomyMinutes",
      label: "Required autonomy time",
      type: "number",
      unit: "minutes",
      required: true,
      smartDefault: 15,
      validation: { min: 1, max: 1440 },
      helper: "Must be positive integer",
      expertMeaning: "Required autonomy time",
    },
    {
      id: "dcBusVoltage",
      label: "DC bus voltage",
      type: "number",
      unit: "V",
      required: true,
      smartDefault: 48,
      validation: { min: 12, max: 600 },
      helper: "Must be positive, typical values 12, 24, 48, 120, 240, 480",
      expertMeaning: "DC bus voltage",
    },
    {
      id: "inverterEfficiencyPercent",
      label: "Inverter efficiency",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 90,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Inverter efficiency",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "totalLoadVA",
        "b": "diversityFactorPercent",
        "c": "expansionMarginPercent"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "totalLoadVA",
        "target": "diversityFactorPercent"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Design load VA",
      unit: "VA",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Recommended UPS capacity (kVA)",
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
      "All loads are linear and resistive-inductive with given power factor",
      "Battery discharge is linear (Peukert effect ignored)",
      "Inverter efficiency constant over load range",
    ],
  },
};
