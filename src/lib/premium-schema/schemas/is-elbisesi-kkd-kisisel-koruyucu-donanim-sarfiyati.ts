import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const IsElbisesiKkdKisiselKoruyucuDonanimSarfiyati_SCHEMA: PremiumCalculatorSchema = {
  id: "is-elbisesi-kkd-kisisel-koruyucu-donanim-sarfiyati",
  name: "İş Elbisesi — KKD (Kişisel Koruyucu Donanım) Sarfiyatı",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering cost accounting for consumable PPE",

  inputs: [
    {
      id: "numberOfWorkers",
      label: "Number of workers",
      type: "number",
      unit: "workers",
      required: true,
      smartDefault: 50,
      validation: { min: 1, max: 10000 },
      helper: "Must be positive integer",
      expertMeaning: "Number of workers",
    },
    {
      id: "usageRatePerPeriod",
      label: "Usage rate per worker per period",
      type: "number",
      unit: "units/worker/period",
      required: true,
      smartDefault: 2,
      validation: { min: 0.01, max: 100 },
      helper: "Must be positive",
      expertMeaning: "Usage rate per worker per period",
    },
    {
      id: "unitCost",
      label: "Unit cost per PPE item",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 25,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative currency",
      expertMeaning: "Unit cost per PPE item",
    },
    {
      id: "wasteRatePercent",
      label: "Waste rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Waste rate",
    },
    {
      id: "overheadRatePercent",
      label: "Overhead rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 20,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Overhead rate",
    },
    {
      id: "productionQuantity",
      label: "Production quantity (optional)",
      type: "number",
      unit: "units",
      required: false,
      smartDefault: 1000,
      validation: { min: 1, max: 1000000 },
      helper: "If provided, must be positive integer",
      expertMeaning: "Production quantity (optional)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "numberOfWorkers",
        "b": "usageRatePerPeriod",
        "c": "unitCost"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "numberOfWorkers",
        "target": "usageRatePerPeriod"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total PPE cost for period",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Cost per worker",
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
      "All workers require same PPE type and quantity",
      "Usage rate is constant over the period",
      "Waste rate includes breakage, loss, and defects",
    ],
  },
};
