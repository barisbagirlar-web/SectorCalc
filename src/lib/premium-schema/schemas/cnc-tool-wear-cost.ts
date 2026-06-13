import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CNC_TOOL_WEAR_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "cnc-tool-wear-cost",
  name: "CNC Tool Wear Cost Calculator",
  sectorSlug: "manufacturing",
  category: "cost",
  legacyPaidSlug: "welding-bid-risk-analyzer",
  painStatement:
    "CNC jobs lose margin when tool wear, inserts, coolant and tool change downtime are not allocated per part.",

  inputs: [
    {
      id: "monthlyToolCost",
      label: "Monthly tool cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 3200,
      validation: { min: 0 },
      helper: "Inserts, tooling and consumables spend per month.",
      expertMeaning: "Direct tool envelope before per-part allocation.",
    },
    {
      id: "partsProduced",
      label: "Parts produced",
      type: "number",
      unit: "count",
      required: true,
      smartDefault: 4800,
      validation: { min: 1 },
      helper: "Good parts produced in the same period.",
      expertMeaning: "Volume denominator for unit tool cost.",
    },
    {
      id: "toolChangeMinutes",
      label: "Tool change minutes",
      type: "number",
      unit: "minutes",
      required: true,
      smartDefault: 18,
      validation: { min: 0 },
      helper: "Average minutes lost per tool change event.",
      expertMeaning: "Spindle downtime per changeover.",
    },
    {
      id: "changesPerMonth",
      label: "Changes per month",
      type: "number",
      unit: "count",
      required: true,
      smartDefault: 42,
      validation: { min: 0 },
      helper: "Tool change events in the period.",
      expertMeaning: "Frequency multiplier for changeover loss.",
    },
    {
      id: "hourlyCost",
      label: "Hourly cost",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 85,
      validation: { min: 0 },
      helper: "Loaded machine and operator rate.",
      expertMeaning: "Hourly burden applied to changeover time.",
    },
    {
      id: "coolantCost",
      label: "Coolant cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 420,
      validation: { min: 0 },
      helper: "Coolant and lubricant spend tied to tooling.",
      expertMeaning: "Fluid stack not always in per-part quotes.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "cost.unit_cost",
      inputMap: { totalCost: "monthlyToolCost", quantity: "partsProduced" },
      outputId: "toolCostPerPart",
    },
    {
      formulaId: "time.setup_loss",
      inputMap: {
        setupMinutes: "toolChangeMinutes",
        setupsPerMonth: "changesPerMonth",
        hourlyCost: "hourlyCost",
      },
      outputId: "toolChangeDowntimeCost",
    },
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        a: "monthlyToolCost",
        b: "toolChangeDowntimeCost",
        c: "coolantCost",
      },
      outputId: "totalExposure",
    },
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total tool wear exposure",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    { id: "toolCostPerPart", label: "Tool cost per part", unit: "USD", format: "currency" },
    {
      id: "toolChangeDowntimeCost",
      label: "Tool change downtime cost",
      unit: "USD",
      format: "currency",
    },
    { id: "coolantCost", label: "Coolant cost", unit: "USD", format: "currency" },
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
