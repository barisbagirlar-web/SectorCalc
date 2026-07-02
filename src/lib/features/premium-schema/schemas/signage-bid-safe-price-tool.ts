import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const SIGNAGE_BID_SAFE_PRICE_TOOL_SCHEMA: PremiumCalculatorSchema = {
  id: "signage-bid-safe-price-tool",
  name: "Signage Bid Safe Price Tool",
  sectorSlug: "printing-signage",
  category: "scrap",
  legacyPaidSlug: "signage-bid-safe-price-tool",
  painStatement:
    "Find minimum safe signage price with design, install, ink, RIP/proofing and reprint risk included.",

  inputs: [
    {
      id: "materialCost",
      label: "Material Cost",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Cost of sign substrate, vinyl, acrylic and structural materials",
      expertMeaning: "Direct material cost for sign fabrication including substrate, laminate and hardware",
    },
    {
      id: "inkCost",
      label: "Ink & Toner Cost",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Ink, toner and solvent cost for the print run",
      expertMeaning: "Consumable ink cost including CMYK, white ink, primer and overlaminate",
    },
    {
      id: "designHours",
      label: "Design Hours",
      type: "number",
      unit: "hours",
      required: true,
      validation: { min: 0 },
      helper: "Hours for layout, proofing, artwork and RIP prep",
      expertMeaning: "Pre-production design time including layout, client revisions, RIP and color proofing",
    },
    {
      id: "laborRate",
      label: "Hourly Labor Rate",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Fully loaded hourly rate for production staff",
      expertMeaning: "Labor rate including wages, burden and shop overhead allocation",
    },
    {
      id: "installHours",
      label: "Install Hours",
      type: "number",
      unit: "hours",
      required: true,
      validation: { min: 0 },
      helper: "Estimated hours for onsite installation and mounting",
      expertMeaning: "Field installation labor including mounting, leveling, wiring and site cleanup",
    },
    {
      id: "reprintRiskPercent",
      label: "Reprint Risk (%)",
      type: "number",
      unit: "percent",
      required: true,
      validation: { min: 0, max: 100 },
      helper: "Estimated probability of reprint due to error or damage",
      expertMeaning: "Historical or estimated reprint rate from setup errors, material defects or client changes",
    },
    {
      id: "targetMargin",
      label: "Target Margin (%)",
      type: "number",
      unit: "percent",
      required: true,
      validation: { min: 0, max: 100 },
      helper: "Minimum margin target for this signage job",
      expertMeaning: "Target gross margin used to compute minimum safe signage price",
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
      fieldId: "reprintRatePercent",
      warning: 5,
      critical: 10,
      direction: "higher_is_bad",
      warningMessage: "Reprint rate is elevated - verify color proof and material allowance.",
      criticalMessage: "Critical reprint band - reprice before accepting similar print work.",
    },
    {
      fieldId: "marginPressure",
      warning: 5,
      critical: 12,
      direction: "higher_is_bad",
      warningMessage: "Margin pressure is building - hidden rework may compress profit.",
      criticalMessage: "Critical margin pressure - stop treating reprints as normal overhead.",
    },
  ],

  reportTemplate: {
    title: "Printing Reprint Margin Leak Decision Report",
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
    volatilityPercent: 15,
    targetMarginPercent: 20,
    assumptionNotes: [
      "Reprint cost = material cost × reprint rate.",
      "Revision cost = design hours × labor rate.",
      "Margin pressure = total exposure ÷ job revenue.",
    ],
  },
};
