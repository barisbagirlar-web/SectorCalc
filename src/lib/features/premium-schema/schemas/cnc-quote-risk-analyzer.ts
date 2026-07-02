import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const CNC_QUOTE_RISK_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "cnc-quote-risk-analyzer",
  name: "CNC Audit Engine",
  sectorSlug: "cnc-manufacturing",
  category: "oee",
  legacyPaidSlug: "cnc-quote-risk-analyzer",
  painStatement:
    "Estimate minimum safe price and quote risk verdict for CNC jobs using setup, cycle, tooling, material and machine rate inputs.",

  inputs: [
    {
      id: "setupTime",
      label: "Setup Time",
      type: "number",
      unit: "minutes",
      required: true,
      validation: { min: 0 },
      helper: "Machine setup and tool change time for this job",
      expertMeaning: "Setup time including fixture mounting, tool loading, offset setting and first-part inspection",
    },
    {
      id: "cycleTime",
      label: "Cycle Time per Part",
      type: "number",
      unit: "minutes",
      required: true,
      validation: { min: 0.01 },
      helper: "Machining cycle time per part including loading and unloading",
      expertMeaning: "Total cycle time per part including cutting, indexing, tool change and part handling",
    },
    {
      id: "quantity",
      label: "Order Quantity",
      type: "number",
      unit: "count",
      required: true,
      validation: { min: 1 },
      helper: "Total number of parts to be produced",
      expertMeaning: "Batch quantity that determines total cycle time and tool wear allocation",
    },
    {
      id: "toolCost",
      label: "Tooling Cost",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Total cost for cutting tools, inserts and holders",
      expertMeaning: "Consumable tooling cost including inserts, end mills, drills, taps and tool holder rental",
    },
    {
      id: "materialCost",
      label: "Material Cost per Part",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Raw material cost per part including scrap allowance",
      expertMeaning: "Material cost per part including stock, scrap allowance and material handling surcharge",
    },
    {
      id: "machineRate",
      label: "Machine Hourly Rate",
      type: "number",
      unit: "currency",
      required: true,
      validation: { min: 0 },
      helper: "Hourly machine rate including depreciation, power and maintenance",
      expertMeaning: "Machine burden rate including depreciation, floor space, power, coolant and maintenance",
    },
    {
      id: "riskMargin",
      label: "Risk Margin (%)",
      type: "number",
      unit: "percent",
      required: true,
      validation: { min: 0, max: 100 },
      helper: "Additional margin buffer for risk and uncertainty",
      expertMeaning: "Risk premium added to target margin to cover scrap, rework and tolerance deviation",
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
      fieldId: "oeeScore",
      warning: 65,
      critical: 50,
      direction: "lower_is_bad",
      warningMessage: "OEE is below typical job-shop band - schedule and scrap buffers are tight.",
      criticalMessage: "High risk - hidden cost may erase the margin. Reprice before accepting this job.",
    },
    {
      fieldId: "scrapCost",
      warning: 50,
      critical: 120,
      direction: "higher_is_bad",
      warningMessage: "Scrap exposure is elevated - verify material yield and first-off plan.",
      criticalMessage: "Material fire cost is critical - raise quote or reduce scrap allowance.",
    },
  ],

  reportTemplate: {
    title: "CNC OEE & Loss Decision Report",
    sections: [
      "executive_summary",
      "loss_breakdown",
      "thresholds",
      "sensitivity",
      "action_plan",
      "assumptions",
    ],
    exportFormats: ["pdf"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.12,
    volatilityPercent: 22,
    targetMarginPercent: 15,
    assumptionNotes: [
      "Hidden buffers include setup overrun, tool wear and inspection load.",
      "P90 uses sector volatility 22% unless you override shop history.",
      "Outputs are estimates - verify before signing the job.",
    ],
  },
};
