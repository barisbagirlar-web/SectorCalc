import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const EnjeksiyonDokumCekmePayiHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "enjeksiyon-dokum-cekme-payi-hesabi",
  name: "Enjeksiyon — Döküm Çekme Payı Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering and material science: shrinkage compensation for mold design",

  inputs: [
    {
      id: "nominalPartDimension",
      label: "Nominal part dimension",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 100,
      validation: { min: 0.1, max: 10000 },
      helper: "Must be positive length",
      expertMeaning: "Nominal part dimension",
    },
    {
      id: "shrinkageRatePercent",
      label: "Shrinkage rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 1.5,
      validation: { min: 0, max: 10, step: 0.1 },
      helper: "Percent between 0 and 10 for typical materials",
      expertMeaning: "Shrinkage rate",
    },
    {
      id: "materialCorrectionFactor",
      label: "Material correction factor",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 1,
      validation: { min: 0.5, max: 2 },
      helper: "Factor between 0.5 and 2",
      expertMeaning: "Material correction factor",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "nominalPartDimension",
        "b": "shrinkageRatePercent",
        "c": "materialCorrectionFactor"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "nominalPartDimension",
        "target": "shrinkageRatePercent"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Final mold dimension",
      unit: "mm",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Shrinkage allowance",
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
      "Shrinkage rate is uniform across part geometry",
      "Material correction factor accounts for processing conditions",
      "Nominal dimension is measured at room temperature",
    ],
  },
};
