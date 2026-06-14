import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const CelikRafDepoRafiYukKapasitesi_SCHEMA: PremiumCalculatorSchema = {
  id: "celik-raf-depo-rafi-yuk-kapasitesi",
  name: "Çelik Raf — Depo Rafı Yük Kapasitesi",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Mühendislik mukavemet hesapları ve depo rafı standartları (FEM 10.2.02, EN 15512)",

  inputs: [
    {
      id: "beamLength",
      label: "Beam length",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 2.5,
      validation: { min: 0.5, max: 5 },
      helper: "Must be between 0.5 and 5 meters",
      expertMeaning: "Beam length",
    },
    {
      id: "beamWidth",
      label: "Beam width",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 0.1,
      validation: { min: 0.05, max: 0.3 },
      helper: "Must be between 0.05 and 0.3 meters",
      expertMeaning: "Beam width",
    },
    {
      id: "beamHeight",
      label: "Beam height",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 0.15,
      validation: { min: 0.05, max: 0.3 },
      helper: "Must be between 0.05 and 0.3 meters",
      expertMeaning: "Beam height",
    },
    {
      id: "columnHeight",
      label: "Column height",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 6,
      validation: { min: 1, max: 15 },
      helper: "Must be between 1 and 15 meters",
      expertMeaning: "Column height",
    },
    {
      id: "numberOfLevels",
      label: "Number of levels",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 4,
      validation: { min: 1, max: 10 },
      helper: "Must be integer between 1 and 10",
      expertMeaning: "Number of levels",
    },
    {
      id: "numberOfColumns",
      label: "Number of columns",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 4,
      validation: { min: 2, max: 50 },
      helper: "Must be integer between 2 and 50",
      expertMeaning: "Number of columns",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "beamLength",
        "b": "beamWidth",
        "c": "beamHeight"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "beamLength",
        "target": "beamWidth"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Allowable load per column",
      unit: "N",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total allowable load",
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
      "Steel is homogeneous and isotropic.",
      "Columns are perfectly straight and vertical.",
      "Load is static and uniformly distributed.",
    ],
  },
};
