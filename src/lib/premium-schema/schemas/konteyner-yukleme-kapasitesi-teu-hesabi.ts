import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const KonteynerYuklemeKapasitesiTeuHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "konteyner-yukleme-kapasitesi-teu-hesabi",
  name: "Konteyner Yükleme Kapasitesi (TEU) Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Maritime container logistics and stowage planning standards",

  inputs: [
    {
      id: "totalContainerVolume",
      label: "Total container internal volume",
      type: "number",
      unit: "m³",
      required: true,
      smartDefault: 33.2,
      validation: { min: 1, max: 1000 },
      helper: "Must be positive volume",
      expertMeaning: "Total container internal volume",
    },
    {
      id: "standardTEUVolume",
      label: "Standard TEU volume (20 ft container)",
      type: "number",
      unit: "m³",
      required: true,
      smartDefault: 33.2,
      validation: { min: 1, max: 100 },
      helper: "Must be positive volume",
      expertMeaning: "Standard TEU volume (20 ft container)",
    },
    {
      id: "stowageFactor",
      label: "Stowage factor (utilization efficiency)",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 85,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Stowage factor (utilization efficiency)",
    },
    {
      id: "weightCapacity",
      label: "Container weight capacity (payload)",
      type: "number",
      unit: "t",
      required: true,
      smartDefault: 28,
      validation: { min: 0, max: 30 },
      helper: "Non-negative weight",
      expertMeaning: "Container weight capacity (payload)",
    },
    {
      id: "averageCargoWeightPerTEU",
      label: "Average cargo weight per TEU",
      type: "number",
      unit: "t",
      required: true,
      smartDefault: 14,
      validation: { min: 0.1, max: 30 },
      helper: "Must be positive weight",
      expertMeaning: "Average cargo weight per TEU",
    },
    {
      id: "safetyReductionFactor",
      label: "Safety reduction factor (lashing, clearance)",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 95,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Safety reduction factor (lashing, clearance)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "totalContainerVolume",
        "b": "standardTEUVolume",
        "c": "stowageFactor"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "totalContainerVolume",
        "target": "standardTEUVolume"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Maximum TEU capacity",
      unit: "TEU",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Volume utilization",
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
      "Standard TEU volume is based on 20 ft container (33.2 m³)",
      "Stowage factor accounts for typical cargo density and stacking inefficiencies",
      "Average cargo weight per TEU is representative of the cargo mix",
    ],
  },
};
