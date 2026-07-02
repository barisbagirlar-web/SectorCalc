import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const LANDSCAPING_CONTRACT_PROFIT_TOOL_SCHEMA: PremiumCalculatorSchema = {
  id: "landscaping-contract-profit-tool",
  name: "Landscaping Contract Profit Tool",
  sectorSlug: "roofing",
  category: "time",
  legacyPaidSlug: "landscaping-contract-profit-tool",
  painStatement:
    "Find minimum monthly landscaping contract price with fuel, supplies and equipment wear included.",

  inputs: [
    {
      id: "crewHoursPerVisit",
      label: "Crew Hours per Visit",
      type: "number",
      unit: "hours",
      required: true,
      validation: { min: 0.25 },
      helper: "Total crew labor hours for each landscaping visit",
      expertMeaning: "Combined crew hours per service visit including mowing, trimming and cleanup",
    },
    {
      id: "laborRate",
      label: "Hourly Labor Rate",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Fully loaded hourly rate for landscaping crew",
      expertMeaning: "Labor rate including wages, payroll taxes, insurance and equipment allowance",
    },
    {
      id: "fuelCostPerVisit",
      label: "Fuel Cost per Visit",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Estimated fuel cost for equipment and travel per visit",
      expertMeaning: "Fuel consumption for mowers, trimmers, blowers and service vehicle per trip",
    },
    {
      id: "supplyCostPerMonth",
      label: "Monthly Supply Cost",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Monthly cost for chemicals, mulch, fertilizer and consumables",
      expertMeaning: "Recurring material cost including soil amendments, pest control and irrigation supplies",
    },
    {
      id: "visitsPerMonth",
      label: "Visits per Month",
      type: "number",
      unit: "count",
      required: true,
      validation: { min: 1 },
      helper: "Number of landscaping service visits per month",
      expertMeaning: "Service frequency determines monthly labor, fuel and consumable consumption",
    },
    {
      id: "equipmentWearCost",
      label: "Equipment Wear Cost per Visit",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Estimated equipment depreciation and maintenance per visit",
      expertMeaning: "Allocated equipment cost including depreciation, repairs and replacement reserve",
    },
    {
      id: "targetMargin",
      label: "Target Margin (%)",
      type: "number",
      unit: "percent",
      required: true,
      validation: { min: 0, max: 100 },
      helper: "Minimum profit margin target for this contract",
      expertMeaning: "Target gross margin used to compute minimum safe monthly landscaping price",
    },
  ],

  outputs: [
    { id: "minimumSafePrice", label: "Minimum Safe Price", unit: "currency", format: "currency", isBigNumber: true },
    { id: "quoteVerdict", label: "Quote Verdict", unit: "text", format: "number" },
    { id: "p90Cost", label: "P90 Cost Estimate", unit: "currency", format: "currency", isBigNumber: true },
    { id: "baseCost", label: "Base Cost", unit: "currency", format: "currency" },
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
