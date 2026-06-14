import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const NpuNpiProfilAgirlikHesaplama_SCHEMA: PremiumCalculatorSchema = {
  id: "npu-npi-profil-agirlik-hesaplama",
  name: "NPU — NPI Profil Ağırlık Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Çelik profil geometrisi ve yoğunluk esaslı standart mühendislik hesabı",

  inputs: [
    {
      id: "profileHeight",
      label: "Profile height (h)",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 200,
      validation: { min: 50, max: 500 },
      helper: "Must be between 50 and 500 mm",
      expertMeaning: "Profile height (h)",
    },
    {
      id: "flangeWidth",
      label: "Flange width (b)",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 100,
      validation: { min: 40, max: 300 },
      helper: "Must be between 40 and 300 mm",
      expertMeaning: "Flange width (b)",
    },
    {
      id: "webThickness",
      label: "Web thickness (t_w)",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 8,
      validation: { min: 4, max: 20 },
      helper: "Must be between 4 and 20 mm",
      expertMeaning: "Web thickness (t_w)",
    },
    {
      id: "flangeThickness",
      label: "Flange thickness (t_f)",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 10,
      validation: { min: 4, max: 30 },
      helper: "Must be between 4 and 30 mm",
      expertMeaning: "Flange thickness (t_f)",
    },
    {
      id: "profileLength",
      label: "Profile length (L)",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 6,
      validation: { min: 0.5, max: 24 },
      helper: "Must be between 0.5 and 24 m",
      expertMeaning: "Profile length (L)",
    },
    {
      id: "nominalWeightPerMeter",
      label: "Nominal weight per meter (from standard)",
      type: "number",
      unit: "kg/m",
      required: true,
      smartDefault: 25,
      validation: { min: 5, max: 200 },
      helper: "Must be between 5 and 200 kg/m",
      expertMeaning: "Nominal weight per meter (from standard)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "profileHeight",
        "b": "flangeWidth",
        "c": "webThickness"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "profileHeight",
        "target": "flangeWidth"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Cross-sectional area",
      unit: "mm²",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Calculated weight per meter",
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
      "Steel density is 7850 kg/m³",
      "Profile cross-section is perfectly rectangular with sharp corners",
      "No allowance for fillet radii or tolerances",
    ],
  },
};
