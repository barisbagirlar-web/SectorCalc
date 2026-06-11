import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const INVENTORY_CARRYING_COST_EOQ_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "inventory-carrying-cost-eoq-calculator",
  name: "Inventory Carrying Cost and EOQ Calculator",
  sectorSlug: "logistics-transport",
  category: "benchmark",
  painStatement:
    "Inventory cost is underestimated when only warehouse rent is counted.",

  inputs: [
    {
      id: "annualDemand",
      label: "Annual demand",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 12000,
      validation: { min: 1 },
      helper: "Expected units consumed or sold per year.",
      expertMeaning: "Demand driver for EOQ sizing.",
    },
    {
      id: "orderCost",
      label: "Order cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 85,
      validation: { min: 0 },
      helper: "Fixed cost per purchase order placed.",
      expertMeaning: "Ordering and receiving burden per PO.",
    },
    {
      id: "unitCost",
      label: "Unit cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 14.5,
      validation: { min: 0.01 },
      helper: "Purchase or production cost per unit.",
      expertMeaning: "Value base for carrying cost.",
    },
    {
      id: "carryingCostPercent",
      label: "Carrying cost rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 18,
      validation: { min: 0.1, max: 100 },
      helper: "Annual carrying cost as percent of inventory value.",
      expertMeaning: "Storage, capital and obsolescence load.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "inventory.eoq_units",
      inputMap: {
        annualDemand: "annualDemand",
        orderCost: "orderCost",
        unitCost: "unitCost",
        carryingCostPercent: "carryingCostPercent",
      },
      outputId: "eoqUnits",
    },
    {
      formulaId: "inventory.carrying_cost_annual",
      inputMap: {
        eoqUnits: "eoqUnits",
        unitCost: "unitCost",
        carryingCostPercent: "carryingCostPercent",
      },
      outputId: "annualCarryingCost",
    },
  ],

  outputs: [
    {
      id: "eoqUnits",
      label: "Economic order quantity",
      unit: "units",
      format: "number",
      isBigNumber: true,
    },
    {
      id: "annualCarryingCost",
      label: "Annual carrying cost",
      unit: "$",
      format: "currency",
    },
  ],

  thresholds: [
    {
      fieldId: "annualCarryingCost",
      warning: 8000,
      critical: 20000,
      direction: "higher_is_bad",
      warningMessage: "Carrying cost is elevated — review order size and slow movers.",
      criticalMessage: "Carrying cost is very high — reduce average inventory before reordering.",
    },
  ],

  reportTemplate: {
    title: "Inventory EOQ and Carrying Cost Decision Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.03,
    volatilityPercent: 8,
    targetMarginPercent: 0,
    assumptionNotes: [
      "EOQ = √(2 × annual demand × order cost ÷ holding cost per unit).",
      "Holding cost per unit = unit cost × carrying cost rate.",
      "Average inventory assumed at EOQ ÷ 2 for carrying cost estimate.",
    ],
  },
};
