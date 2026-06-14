import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const VadeFarkiVeErkenOdemeIskontosuOptimizasyonCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "vade-farki-ve-erken-odeme-iskontosu-optimizasyon-calculator",
  name: "Vade Farki Ve Erken Odeme Iskontosu Optimizasyon",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Ticari finans ve nakit akışı yönetimi prensipleri",

  inputs: [
    {
      id: "faturaTutari",
      label: "Invoice amount",
      type: "number",
      unit: "TRY",
      required: true,
      smartDefault: 10000,
      validation: { min: 0.01, max: 1000000000 },
      helper: "Fatura tutarı pozitif olmalıdır",
      expertMeaning: "Invoice amount",
    },
    {
      id: "vadeFarkiYuzde",
      label: "Late payment interest rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Vade farkı yüzdesi 0-100 aralığında olmalıdır",
      expertMeaning: "Late payment interest rate",
    },
    {
      id: "erkenOdemeIskontoYuzde",
      label: "Early payment discount rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 3,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Erken ödeme iskonto yüzdesi 0-100 aralığında olmalıdır",
      expertMeaning: "Early payment discount rate",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "faturaTutari",
        "b": "vadeFarkiYuzde",
        "c": "erkenOdemeIskontoYuzde"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "faturaTutari",
        "target": "vadeFarkiYuzde"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Net late payment cost",
      unit: "TRY",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Net early payment gain",
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
      "All monetary values are in the same currency (TRY)",
      "Late payment interest and early payment discount are applied on the gross invoice amount",
      "No compounding or time value of money is considered",
    ],
  },
};
