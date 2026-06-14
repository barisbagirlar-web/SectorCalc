import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const PlastikEnjeksiyonCevrimSuresiTahmini_SCHEMA: PremiumCalculatorSchema = {
  id: "plastik-enjeksiyon-cevrim-suresi-tahmini",
  name: "Plastik Enjeksiyon Çevrim Süresi Tahmini",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering and plastics processing standards (SPI, Euromap)",

  inputs: [
    {
      id: "injectionTime",
      label: "Injection time",
      type: "number",
      unit: "s",
      required: true,
      smartDefault: 2,
      validation: { min: 0.1, max: 60 },
      helper: "Must be positive, typical range 0.1-60 s",
      expertMeaning: "Injection time",
    },
    {
      id: "coolingTime",
      label: "Cooling time",
      type: "number",
      unit: "s",
      required: true,
      smartDefault: 15,
      validation: { min: 0.1, max: 300 },
      helper: "Must be positive, typical range 0.1-300 s",
      expertMeaning: "Cooling time",
    },
    {
      id: "moldOpenCloseTime",
      label: "Mold open/close time",
      type: "number",
      unit: "s",
      required: true,
      smartDefault: 5,
      validation: { min: 0.1, max: 60 },
      helper: "Must be positive, typical range 0.1-60 s",
      expertMeaning: "Mold open/close time",
    },
    {
      id: "ejectionTime",
      label: "Ejection time",
      type: "number",
      unit: "s",
      required: true,
      smartDefault: 2,
      validation: { min: 0.1, max: 30 },
      helper: "Must be positive, typical range 0.1-30 s",
      expertMeaning: "Ejection time",
    },
    {
      id: "materialFactor",
      label: "Material factor",
      type: "number",
      unit: "-",
      required: true,
      smartDefault: 1,
      validation: { min: 0.5, max: 3 },
      helper: "Typical values: PP=1.0, PE=1.0, ABS=1.2, PC=1.5, PA=1.3, PMMA=1.4",
      expertMeaning: "Material factor",
    },
    {
      id: "wallThickness",
      label: "Average wall thickness",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 2.5,
      validation: { min: 0.5, max: 10 },
      helper: "Must be positive, typical range 0.5-10 mm",
      expertMeaning: "Average wall thickness",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "injectionTime",
        "b": "coolingTime",
        "c": "moldOpenCloseTime"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "injectionTime",
        "target": "coolingTime"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Cycle time per part",
      unit: "s",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Hourly output",
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
      "Material factor is based on typical flow characteristics; actual values may vary by grade",
      "Wall thickness adjustment assumes uniform thickness; complex geometries may require correction",
      "Auxiliary time is constant per cycle, not per cavity",
    ],
  },
};
