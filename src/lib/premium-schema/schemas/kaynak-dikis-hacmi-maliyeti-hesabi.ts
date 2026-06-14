import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const KaynakDikisHacmiMaliyetiHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "kaynak-dikis-hacmi-maliyeti-hesabi",
  name: "Kaynak Dikiş Hacmi — Maliyeti Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Endüstri mühendisliği maliyet muhasebesi ve kaynak teknolojisi standartları",

  inputs: [
    {
      id: "rootThickness",
      label: "Root thickness",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 5,
      validation: { min: 0.1, max: 100 },
      helper: "Must be positive",
      expertMeaning: "Root thickness",
    },
    {
      id: "weldLength",
      label: "Weld length",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 100,
      validation: { min: 0.1, max: 10000 },
      helper: "Must be positive",
      expertMeaning: "Weld length",
    },
    {
      id: "reinforcementHeight",
      label: "Reinforcement height",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 2,
      validation: { min: 0, max: 50 },
      helper: "Non-negative",
      expertMeaning: "Reinforcement height",
    },
    {
      id: "reinforcementWidth",
      label: "Reinforcement width",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 100 },
      helper: "Non-negative",
      expertMeaning: "Reinforcement width",
    },
    {
      id: "density",
      label: "Material density",
      type: "number",
      unit: "g/mm³",
      required: true,
      smartDefault: 0.00785,
      validation: { min: 0.0001, max: 0.1 },
      helper: "Must be positive, typical steel ~0.00785",
      expertMeaning: "Material density",
    },
    {
      id: "scrapRate",
      label: "Scrap rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Scrap rate",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "rootThickness",
        "b": "weldLength",
        "c": "reinforcementHeight"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "rootThickness",
        "target": "weldLength"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Cost per weld",
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
      "Weld cross-section is approximated as rectangular root plus triangular reinforcement",
      "Material density is constant and homogeneous",
      "Labor cost is linear with weld length",
    ],
  },
};
