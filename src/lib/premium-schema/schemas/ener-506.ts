import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const ENERGY_COMPRESSOR_LEAK_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "ener-506",
  name: "Compressor Leak Cost Calculator",
  sectorSlug: "energy-carbon",
  category: "energy",
  legacyPaidSlug: "cbam-compliance-verdict",
  painStatement:
    "Compressed air leaks turn electricity into invisible production cost.",

  inputs: [
    {
      id: "compressorKw",
      label: "Compressor power",
      type: "number",
      unit: "kW",
      required: true,
      smartDefault: 45,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "leakPercent",
      label: "Leak percent",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 12,
      validation: { min: 0, max: 100 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "operatingHours",
      label: "Operating hours",
      type: "number",
      unit: "hours/month",
      required: true,
      smartDefault: 360,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "energyRate",
      label: "Energy rate",
      type: "number",
      unit: "USD/kWh",
      required: true,
      smartDefault: 0.14,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "energy.compressor_leak_kwh",
      inputMap: {
        compressorKw: "compressorKw",
        leakPercent: "leakPercent",
        operatingHours: "operatingHours",
      },
      outputId: "leakKwh",
    },
    {
      formulaId: "energy.kwh_cost",
      inputMap: {
        kwh: "leakKwh",
        rate: "energyRate",
      },
      outputId: "monthlyLeakCost",
    },
    {
      formulaId: "cost.annualize",
      inputMap: {
        monthlyCost: "monthlyLeakCost",
      },
      outputId: "annualLeakCost",
    },
  ],

  outputs: [
    {
      id: "monthlyLeakCost",
      label: "Monthly leak cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "leakKwh",
      label: "Leak kWh",
      unit: "kWh",
      format: "number",
    },
    {
      id: "annualLeakCost",
      label: "Annual leak cost",
      unit: "USD",
      format: "currency",
    },
  ],

  thresholds: [
    {
      fieldId: "leakPercent",
      warning: 8,
      critical: 15,
      direction: "higher_is_bad",
      warningMessage:
        "Leak percent is above typical industrial band — schedule ultrasonic audit.",
      criticalMessage:
        "Critical leak band — compressed air waste may exceed maintenance budget.",
    },
    {
      fieldId: "monthlyLeakCost",
      warning: 500,
      critical: 1500,
      direction: "higher_is_bad",
      warningMessage: "Monthly leak cost is material — prioritize valve and fitting repairs.",
      criticalMessage:
        "Critical leak cost — stop treating compressed air loss as fixed overhead.",
    },
  ],

  reportTemplate: {
    title: "Compressor Leak Cost Decision Report",
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
    hiddenLossMultiplier: 1.04,
    volatilityPercent: 8,
    targetMarginPercent: 10,
    assumptionNotes: [
      "Leak kWh = compressor kW × operating hours × leak percent.",
      "Monthly leak cost = leak kWh × energy rate.",
      "Annual leak cost = monthly leak cost × 12.",
    ],
  },
};
