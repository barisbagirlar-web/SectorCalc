import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const CHANGE_ORDER_IMPACT_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "change-order-impact-analyzer",
  name: "Change Order Impact Analyzer",
  sectorSlug: "construction",
  category: "time",
  legacyPaidSlug: "change-order-impact-analyzer",
  painStatement:
    "Measure delay, crew cost and margin impact before accepting a construction change order.",

  inputs: [
    {
      id: "originalBudget",
      label: "Original Contract Budget",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 1 },
      helper: "Enter the original contract value before this change order",
      expertMeaning: "Baseline budget used to scale overhead and compute budget utilization ratios",
    },
    {
      id: "changeEstimate",
      label: "Change Order Estimate",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Contractor's quoted price for the change order scope",
      expertMeaning: "Direct cost estimate including labor, material and equipment for the change scope",
    },
    {
      id: "delayDays",
      label: "Estimated Delay Days",
      type: "number",
      unit: "days",
      required: true,
      validation: { min: 0 },
      helper: "How many calendar days will this change add to the schedule",
      expertMeaning: "Schedule slip days - each day incurs crew standby, site overhead and general conditions",
    },
    {
      id: "crewCostPerDay",
      label: "Daily Crew & Site Cost",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Total daily cost for crew, equipment and site overhead",
      expertMeaning: "Combined daily rate for labor, equipment rental and site general conditions",
    },
    {
      id: "marginTarget",
      label: "Target Margin (%)",
      type: "number",
      unit: "percent",
      required: true,
      validation: { min: 0, max: 100 },
      helper: "Minimum margin you want to maintain on this change order",
      expertMeaning: "Gross margin target used to calculate minimum safe change price",
    },
  ],

  outputs: [
    { id: "minimumSafePrice", label: "Minimum Safe Price", unit: "currency", format: "currency", isBigNumber: true },
    { id: "quoteVerdict", label: "Quote Verdict", unit: "text", format: "number" },
    { id: "p90Cost", label: "P90 Cost Estimate", unit: "currency", format: "currency", isBigNumber: true },
    { id: "suggestedAction", label: "Suggested Action", unit: "text", format: "number" },
  ],

  thresholds: [
    {
      fieldId: "delayDays",
      warning: 3,
      critical: 10,
      direction: "higher_is_bad",
      warningMessage:
        "Schedule slip is building - delay cost may erase contingency before closeout.",
      criticalMessage:
        "Critical delay exposure - reprice or resequence before accepting similar change scope.",
    },
    {
      fieldId: "laborOverrunPercent",
      warning: 5,
      critical: 15,
      direction: "higher_is_bad",
      warningMessage: "Labor drift is above typical band - verify crew productivity assumptions.",
      criticalMessage:
        "Labor overrun is critical - margin may disappear before project completion.",
    },
    {
      fieldId: "materialOverrunPercent",
      warning: 4,
      critical: 12,
      direction: "higher_is_bad",
      warningMessage: "Material variance is elevated - check lead times and substitution risk.",
      criticalMessage:
        "Material overrun is critical - audit procurement before signing similar work.",
    },
  ],

  reportTemplate: {
    title: "Construction Overrun Decision Report",
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
    targetMarginPercent: 12,
    assumptionNotes: [
      "Delay cost = daily site cost × delay days.",
      "Overrun costs apply percent drift to labor and material budgets separately.",
      "Total exposure sums delay, labor overrun and material overrun - no double-count with change-order fees.",
    ],
  },
};
