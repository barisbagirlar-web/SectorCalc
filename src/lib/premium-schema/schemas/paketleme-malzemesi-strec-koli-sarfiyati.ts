import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const PaketlemeMalzemesiStrecKoliSarfiyati_SCHEMA: PremiumCalculatorSchema = {
  id: "paketleme-malzemesi-strec-koli-sarfiyati",
  name: "Paketleme Malzemesi (Streç, Koli) Sarfiyatı",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering standard cost accounting for packaging materials",

  inputs: [
    {
      id: "productionQuantity",
      label: "Production quantity",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 100,
      validation: { min: 1, max: 1000000 },
      helper: "Must be positive integer",
      expertMeaning: "Production quantity",
    },
    {
      id: "lengthPerUnit",
      label: "Length of packaging per unit",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 1.5,
      validation: { min: 0.01, max: 100 },
      helper: "Must be positive",
      expertMeaning: "Length of packaging per unit",
    },
    {
      id: "widthPerUnit",
      label: "Width of packaging per unit",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 0.5,
      validation: { min: 0.01, max: 100 },
      helper: "Must be positive",
      expertMeaning: "Width of packaging per unit",
    },
    {
      id: "layers",
      label: "Number of layers",
      type: "number",
      unit: "layers",
      required: true,
      smartDefault: 2,
      validation: { min: 1, max: 10 },
      helper: "Must be integer between 1 and 10",
      expertMeaning: "Number of layers",
    },
    {
      id: "coveragePerKg",
      label: "Coverage per kg of material",
      type: "number",
      unit: "m²/kg",
      required: true,
      smartDefault: 10,
      validation: { min: 0.1, max: 100 },
      helper: "Must be positive",
      expertMeaning: "Coverage per kg of material",
    },
    {
      id: "unitMaterialCost",
      label: "Unit material cost per kg",
      type: "number",
      unit: "USD/kg",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative currency",
      expertMeaning: "Unit material cost per kg",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "productionQuantity",
        "b": "lengthPerUnit",
        "c": "widthPerUnit"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "productionQuantity",
        "target": "lengthPerUnit"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total material cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Material cost per unit",
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
      "Packaging material is homogeneous and coverage per kg is constant",
      "Scrap rate is representative of normal production conditions",
      "No significant price fluctuations in material cost during the period",
    ],
  },
};
