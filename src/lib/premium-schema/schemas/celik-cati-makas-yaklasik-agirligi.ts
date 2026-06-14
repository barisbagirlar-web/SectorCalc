import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const CelikCatiMakasYaklasikAgirligi_SCHEMA: PremiumCalculatorSchema = {
  id: "celik-cati-makas-yaklasik-agirligi",
  name: "Çelik Çatı Makas Yaklaşık Ağırlığı",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Yapısal çelik tasarımında kullanılan ampirik ağırlık tahmin yöntemi",

  inputs: [
    {
      id: "spanLength",
      label: "Span length",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 10,
      validation: { min: 1, max: 100 },
      helper: "Must be between 1 and 100 meters",
      expertMeaning: "Span length",
    },
    {
      id: "trussHeight",
      label: "Truss height",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 2,
      validation: { min: 0.5, max: 50 },
      helper: "Must be between 0.5 and 50 meters",
      expertMeaning: "Truss height",
    },
    {
      id: "trussType",
      label: "Truss type",
      type: "number",
      unit: "",
      required: true,
      smartDefault: 1,
      validation: { min: 0 },
      helper: "Select one of: flat, triangular, pitched",
      expertMeaning: "Truss type",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "spanLength",
        "b": "trussHeight",
        "c": "trussType"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "spanLength",
        "target": "trussHeight"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Approximate weight (kg)",
      unit: "kg",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Approximate weight (ton)",
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
      "Truss is simply supported",
      "Steel density is 7850 kg/m³",
      "Truss type coefficient is empirical and approximate",
    ],
  },
};
