import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const SHEET_METAL_QUOTE_RISK_TOOL_SCHEMA: PremiumCalculatorSchema = {
  id: "sheet-metal-quote-risk-tool",
  name: "Sheet Metal Quote Risk Tool",
  sectorSlug: "sheet-metal",
  category: "scrap",
  legacyPaidSlug: "sheet-metal-quote-risk-tool",
  painStatement:
    "Find safe sheet metal quote with programming, setup, scrap, bend labor and finishing included.",

  inputs: [
    {
      id: "programmingTime",
      label: "Programming Time",
      type: "number",
      unit: "hours",
      required: true,
      validation: { min: 0 },
      helper: "Time for CAM programming, nesting and CNC code generation",
      expertMeaning: "Pre-production programming including CAM, nesting optimization and CNC post-processing",
    },
    {
      id: "setupTime",
      label: "Setup Time",
      type: "number",
      unit: "hours",
      required: true,
      validation: { min: 0 },
      helper: "Machine setup time for tooling, material and offsets",
      expertMeaning: "Setup labor including coil loading, tool setup, offsets and first-article inspection",
    },
    {
      id: "cutTime",
      label: "Cut Time",
      type: "number",
      unit: "hours",
      required: true,
      validation: { min: 0.01 },
      helper: "Estimated laser, punch or shear cutting time",
      expertMeaning: "Machine cutting time for laser, punch or shear including turret indexing and repositioning",
    },
    {
      id: "bendCount",
      label: "Bend Count",
      type: "number",
      unit: "count",
      required: true,
      validation: { min: 0 },
      helper: "Total number of bends on the press brake",
      expertMeaning: "Number of press brake operations affecting labor cost and setup complexity",
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
      id: "materialCost",
      label: "Material Cost",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Total cost of sheet metal stock including waste allowance",
      expertMeaning: "Sheet metal material cost including gauge allowance, scrap factor and material handling surcharge",
    },
    {
      id: "scrapRatePercent",
      label: "Scrap Rate (%)",
      type: "number",
      unit: "percent",
      required: true,
      validation: { min: 0, max: 100 },
      helper: "Estimated scrap rate from nesting waste and defect parts",
      expertMeaning: "Material scrap rate from nesting inefficiency, edge waste, defect parts and overburn",
    },
    {
      id: "finishingCost",
      label: "Finishing Cost",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Cost for deburring, welding, painting or powder coating",
      expertMeaning: "Secondary finishing cost including deburring, weld grinding, powder coat, silk screen or assembly",
    },
    {
      id: "targetMargin",
      label: "Target Margin (%)",
      type: "number",
      unit: "percent",
      required: true,
      validation: { min: 0, max: 100 },
      helper: "Minimum margin target for this sheet metal job",
      expertMeaning: "Target gross margin used to compute minimum safe sheet metal quote price",
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
      fieldId: "scrapRate",
      warning: 5,
      critical: 10,
      direction: "higher_is_bad",
      warningMessage:
        "Scrap rate is above target — nesting or bend tolerance may be eroding quote margin.",
      criticalMessage:
        "Critical scrap band — reprice material and rework before accepting similar fabrication.",
    },
    {
      fieldId: "reworkHours",
      warning: 8,
      critical: 20,
      direction: "higher_is_bad",
      warningMessage: "Rework hours are elevated — verify setup and bend sequence assumptions.",
      criticalMessage:
        "Rework exposure is critical — stop treating bend errors as normal shop time.",
    },
  ],

  reportTemplate: {
    title: "Sheet Metal Scrap Risk Decision Report",
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
    hiddenLossMultiplier: 1.08,
    volatilityPercent: 14,
    targetMarginPercent: 18,
    assumptionNotes: [
      "Excess scrap = max(scrap rate − target, 0) applied to material cost.",
      "Rework cost = rework hours × labor rate.",
      "Total exposure sums excess scrap, rework and finishing cost.",
    ],
  },
};
