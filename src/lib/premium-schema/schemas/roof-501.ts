import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const LANDSCAPING_CONTRACT_PROFIT_TOOL_SCHEMA: PremiumCalculatorSchema = {
  id: "roof-501",
  name: "Landscaping Contract Profit Tool",
  sectorSlug: "roofing",
  category: "time",
  legacyPaidSlug: "landscaping-contract-profit-tool",
  painStatement:
    "Find minimum monthly landscaping contract price with fuel, supplies and equipment wear included.",

  inputs: [
    {
      id: "dailyCrewCost",
      label: "Daily crew cost",
      type: "number",
      unit: "USD/day",
      required: true,
      smartDefault: 1450,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "weatherDelayDays",
      label: "Weather delay days",
      type: "number",
      unit: "days",
      required: true,
      smartDefault: 4,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "dumpFees",
      label: "Dump fees",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 1800,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "warrantyReserve",
      label: "Warranty reserve",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 2400,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "time.delay_cost",
      inputMap: { dailySiteCost: "dailyCrewCost", delayDays: "weatherDelayDays" },
      outputId: "delayCost",
    },
    {
      formulaId: "cost.total_exposure",
      inputMap: { a: "delayCost", b: "dumpFees", c: "warrantyReserve" },
      outputId: "totalExposure",
    },
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total weather delay exposure",
      unit: "$",
      format: "currency",
      isBigNumber: true,
    },
    { id: "delayCost", label: "Delay cost", unit: "$", format: "currency" },
    { id: "dumpFees", label: "Dump fees", unit: "$", format: "currency" },
    { id: "warrantyReserve", label: "Warranty reserve", unit: "$", format: "currency" },
  ],

  thresholds: [
    {
      fieldId: "weatherDelayDays",
      warning: 3,
      critical: 8,
      direction: "higher_is_bad",
      warningMessage: "Weather delay exposure is elevated — verify schedule buffer.",
      criticalMessage: "Critical delay band — reprice before accepting roofing work.",
    },
  ],

  reportTemplate: {
    title: "Roofing Weather Delay Risk Decision Report",
    sections: [
      "executive_summary",
      "loss_breakdown",
      "thresholds",
      "sensitivity",
      "action_plan",
      "assumptions",
    ],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.12,
    volatilityPercent: 20,
    targetMarginPercent: 15,
    assumptionNotes: [
      "Delay cost = daily crew cost × weather delay days.",
      "Total exposure sums delay, dump fees and warranty reserve.",
      "Seasonal volatility assumed at 20% unless shop history overrides.",
    ],
  },
};
