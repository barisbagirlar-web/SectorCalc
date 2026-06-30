import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const WELDING_BID_RISK_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "welding-bid-risk-analyzer",
  name: "Welding Bid Risk Analyzer",
  sectorSlug: "manufacturing",
  category: "cost",
  legacyPaidSlug: "welding-bid-risk-analyzer",
  painStatement:
    "Find minimum safe welding bid with fit-up time, rework risk and consumables included.",

  inputs: [
    {
      id: "materialCost",
      label: "Base Material Cost",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Total cost of welding materials including filler rod and shielding gas",
      expertMeaning: "Direct material cost including filler metal, shielding gas, backing bars and pre-fab consumables",
    },
    {
      id: "laborHours",
      label: "Labor Hours",
      type: "number",
      unit: "hours",
      required: true,
      validation: { min: 0 },
      helper: "Estimated welding labor hours for the job",
      expertMeaning: "Direct labor hours for welding including setup, welding passes, cleaning and inspection",
    },
    {
      id: "laborRate",
      label: "Hourly Labor Rate",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Fully loaded hourly rate for welding labor",
      expertMeaning: "Labor rate including wages, burden, certification costs and shop overhead",
    },
    {
      id: "gasConsumableCost",
      label: "Gas & Consumable Cost",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Cost of shielding gas, electrodes and welding consumables",
      expertMeaning: "Consumable cost including argon/mix gas, electrodes, wire, discs and grinding wheels",
    },
    {
      id: "fitUpHours",
      label: "Fit-Up & Prep Hours",
      type: "number",
      unit: "hours",
      required: true,
      validation: { min: 0 },
      helper: "Hours for fit-up, alignment and joint preparation",
      expertMeaning: "Pre-welding preparation including beveling, clamping, fit-up and preheat",
    },
    {
      id: "reworkRiskPercent",
      label: "Rework Risk (%)",
      type: "number",
      unit: "percent",
      required: true,
      validation: { min: 0, max: 100 },
      helper: "Estimated probability of rework from weld defects or NDT failure",
      expertMeaning: "Historical or estimated rework rate from weld defects, NDT rejection or dimensional issues",
    },
    {
      id: "targetMargin",
      label: "Target Margin (%)",
      type: "number",
      unit: "percent",
      required: true,
      validation: { min: 0, max: 100 },
      helper: "Minimum margin target for this welding job",
      expertMeaning: "Target gross margin used to compute minimum safe welding bid price",
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
      fieldId: "toolCostPerPart",
      warning: 0.5,
      critical: 1.5,
      direction: "higher_is_bad",
      warningMessage: "Per-part tool cost is elevated — verify insert life and quoting allowance.",
      criticalMessage: "Tool cost per part is critical — reprice repeat jobs before accepting.",
    },
    {
      fieldId: "toolChangeMinutes",
      warning: 15,
      critical: 30,
      direction: "higher_is_bad",
      warningMessage: "Tool change time is above typical band — schedule and setup buffers may be tight.",
      criticalMessage: "Changeover time is critical — hidden spindle loss may erase margin.",
    },
  ],

  reportTemplate: {
    title: "CNC Tool Wear Cost Decision Report",
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
    hiddenLossMultiplier: 1.1,
    volatilityPercent: 16,
    targetMarginPercent: 18,
    assumptionNotes: [
      "Tool cost per part = monthly tool spend ÷ parts produced.",
      "Changeover cost = minutes × changes × hourly rate.",
      "Total exposure sums tool spend, changeover and coolant.",
    ],
  },
};
