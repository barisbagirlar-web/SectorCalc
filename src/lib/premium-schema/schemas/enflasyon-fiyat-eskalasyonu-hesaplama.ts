import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const EnflasyonFiyatEskalasyonuHesaplama_SCHEMA: PremiumCalculatorSchema = {
  id: "enflasyon-fiyat-eskalasyonu-hesaplama",
  name: "Enflasyon — Fiyat Eskalasyonu Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Sözleşmelerde fiyat güncelleme ve enflasyon düzeltmesi için standart endeksleme yöntemi",

  inputs: [
    {
      id: "basePrice",
      label: "Base price (contract price)",
      type: "number",
      unit: "TRY",
      required: true,
      smartDefault: 100000,
      validation: { min: 0, max: 1000000000 },
      helper: "Non-negative currency amount",
      expertMeaning: "Base price (contract price)",
    },
    {
      id: "baseIndex",
      label: "Base index (I0) at contract date",
      type: "number",
      unit: "index points",
      required: true,
      smartDefault: 100,
      validation: { min: 0.01, max: 100000 },
      helper: "Must be positive",
      expertMeaning: "Base index (I0) at contract date",
    },
    {
      id: "currentIndex",
      label: "Current index (I1) at adjustment date",
      type: "number",
      unit: "index points",
      required: true,
      smartDefault: 120,
      validation: { min: 0.01, max: 100000 },
      helper: "Must be positive",
      expertMeaning: "Current index (I1) at adjustment date",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "basePrice",
        "b": "baseIndex",
        "c": "currentIndex"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "basePrice",
        "target": "baseIndex"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Escalation amount",
      unit: "TRY",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Updated price (base + escalation)",
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
      "Base and current indices are from the same source and type (e.g., ÜFE or TÜFE)",
      "Escalation is linear proportional to index change",
      "No cap or floor on escalation amount",
    ],
  },
};
