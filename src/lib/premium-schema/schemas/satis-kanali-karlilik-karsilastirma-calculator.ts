import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const SatisKanaliKarlilikKarsilastirmaCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "satis-kanali-karlilik-karsilastirma-calculator",
  name: "satis-kanali-karlilik-karsilastirma-calculator",
  sectorSlug: "cost",
  category: "cost",
  painStatement: "Industrial cost accounting and sales channel analysis",

  inputs: [
    {
      id: "channelName",
      label: "Channel name",
      type: "number",
      unit: "",
      required: true,
      smartDefault: 1,
      validation: { min: 0 },
      helper: "Non-empty string",
      expertMeaning: "Channel name",
    },
    {
      id: "unitPrice",
      label: "Unit selling price",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 100,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative currency",
      expertMeaning: "Unit selling price",
    },
    {
      id: "quantitySold",
      label: "Quantity sold",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 1000,
      validation: { min: 1, max: 10000000 },
      helper: "Positive integer",
      expertMeaning: "Quantity sold",
    },
    {
      id: "discountPercent",
      label: "Discount rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 0,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Discount rate",
    },
    {
      id: "returnsPercent",
      label: "Returns rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 0,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Returns rate",
    },
    {
      id: "unitCost",
      label: "Unit cost (COGS)",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 50,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative currency",
      expertMeaning: "Unit cost (COGS)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "channelName",
        "b": "unitPrice",
        "c": "quantitySold"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "channelName",
        "target": "unitPrice"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Net revenue",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total cost",
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
    title: "satis-kanali-karlilik-karsilastirma-calculator Decision Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.05,
    volatilityPercent: 8,
    targetMarginPercent: 15,
    assumptionNotes: [
      "All monetary values in same currency (USD)",
      "Discount and returns rates applied to gross revenue",
      "Fixed channel cost is period cost, not per unit",
    ],
  },
};
