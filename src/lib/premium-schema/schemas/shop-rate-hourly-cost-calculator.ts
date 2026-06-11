import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const SHOP_RATE_HOURLY_COST_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "shop-rate-hourly-cost-calculator",
  name: "Machine Hour Rate Calculator",
  sectorSlug: "manufacturing",
  category: "cost",
  painStatement:
    "Most shops estimate shop rate from labor and power only, understating true hourly burden.",

  inputs: [
    {
      id: "fixedMonthlyCost",
      label: "Fixed monthly cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 18500,
      validation: { min: 0 },
      helper: "Rent, depreciation, admin and indirect burden for the month.",
      expertMeaning: "Monthly fixed envelope allocated to machine hours.",
    },
    {
      id: "monthlyMachineHours",
      label: "Monthly machine hours",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 320,
      validation: { min: 1 },
      helper: "Billable or scheduled spindle hours per month.",
      expertMeaning: "Denominator for fixed cost per hour.",
    },
    {
      id: "variableCostPerHour",
      label: "Variable cost per hour",
      type: "number",
      unit: "USD/h",
      required: true,
      smartDefault: 12,
      validation: { min: 0 },
      helper: "Power, consumables and direct variable burden per hour.",
      expertMeaning: "Incremental hourly cost on top of fixed allocation.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "cost.shop_hourly_rate",
      inputMap: {
        fixedMonthlyCost: "fixedMonthlyCost",
        monthlyMachineHours: "monthlyMachineHours",
        variableCostPerHour: "variableCostPerHour",
      },
      outputId: "hourlyRate",
    },
  ],

  outputs: [
    {
      id: "hourlyRate",
      label: "Loaded hourly rate",
      unit: "$/h",
      format: "currency",
      isBigNumber: true,
    },
  ],

  thresholds: [
    {
      fieldId: "hourlyRate",
      warning: 45,
      critical: 30,
      direction: "lower_is_bad",
      warningMessage: "Shop rate may be below loaded cost — verify fixed allocation and hours.",
      criticalMessage: "Hourly rate is critically low — reprice jobs before quoting.",
    },
  ],

  reportTemplate: {
    title: "Machine Hour Rate Decision Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.03,
    volatilityPercent: 6,
    targetMarginPercent: 15,
    assumptionNotes: [
      "Hourly rate = fixed monthly cost ÷ machine hours + variable cost per hour.",
      "Fixed envelope should include depreciation and floor-space share.",
    ],
  },
};
