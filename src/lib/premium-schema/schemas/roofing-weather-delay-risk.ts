import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const ROOFING_WEATHER_DELAY_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "roofing-weather-delay-risk",
  name: "Roofing Weather Delay Risk Calculator",
  sectorSlug: "roofing",
  category: "time",
  legacyPaidSlug: "landscaping-contract-profit-tool",
  painStatement:
    "Roofing jobs lose margin when weather delay, dump fees and warranty reserve are not included in the contract price.",

  inputs: [
    {
      id: "dailyCrewCost",
      label: "Daily crew cost",
      type: "number",
      unit: "USD/day",
      required: true,
      smartDefault: 1450,
      validation: { min: 0 },
      helper: "Loaded crew and equipment cost per site day.",
      expertMeaning: "Daily burn rate while weather holds the job.",
    },
    {
      id: "weatherDelayDays",
      label: "Weather delay days",
      type: "number",
      unit: "days",
      required: true,
      smartDefault: 4,
      validation: { min: 0 },
      helper: "Expected weather delay days on the contract.",
      expertMeaning: "Rain or wind days not in the schedule.",
    },
    {
      id: "dumpFees",
      label: "Dump fees",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 1800,
      validation: { min: 0 },
      helper: "Tear-off disposal and dump fees.",
      expertMeaning: "Disposal stack tied to delay and scope.",
    },
    {
      id: "warrantyReserve",
      label: "Warranty reserve",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 2400,
      validation: { min: 0 },
      helper: "Warranty and callback reserve for the job.",
      expertMeaning: "Post-install warranty envelope.",
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
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    { id: "delayCost", label: "Delay cost", unit: "USD", format: "currency" },
    { id: "dumpFees", label: "Dump fees", unit: "USD", format: "currency" },
    { id: "warrantyReserve", label: "Warranty reserve", unit: "USD", format: "currency" },
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
