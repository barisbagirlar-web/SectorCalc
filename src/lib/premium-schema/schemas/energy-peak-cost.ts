import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const ENERGY_PEAK_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "energy-peak-cost",
  name: "Energy Peak & Efficiency Loss Report",
  sectorSlug: "energy-consumption",
  category: "energy",
  legacyPaidSlug: "energy-efficiency-report",
  painStatement:
    "Peak demand, excess kWh and tariff drift inflate bills beyond the visible meter reading.",

  inputs: [
    {
      id: "currentKwh",
      label: "Current kWh",
      type: "number",
      unit: "kWh",
      required: true,
      smartDefault: 12000,
      validation: { min: 0 },
      helper: "Billing-period consumption.",
      expertMeaning: "Measured use before efficiency target.",
    },
    {
      id: "targetKwh",
      label: "Target kWh",
      type: "number",
      unit: "kWh",
      required: true,
      smartDefault: 10000,
      validation: { min: 0 },
      helper: "Efficiency target or prior-year baseline.",
      expertMeaning: "Expected consumption after improvements.",
    },
    {
      id: "energyRate",
      label: "Energy rate",
      type: "number",
      unit: "$/kWh",
      required: true,
      smartDefault: 0.14,
      validation: { min: 0, step: 0.001 },
      helper: "Blended $/kWh for the period.",
      expertMeaning: "Standard energy tariff.",
    },
    {
      id: "peakKwh",
      label: "Peak kWh",
      type: "number",
      unit: "kWh",
      required: true,
      smartDefault: 2500,
      validation: { min: 0 },
      helper: "Demand during peak window.",
      expertMeaning: "Peak-interval draw.",
    },
    {
      id: "peakRate",
      label: "Peak rate",
      type: "number",
      unit: "$/kWh",
      required: true,
      smartDefault: 0.22,
      validation: { min: 0, step: 0.001 },
      helper: "Peak-interval tariff.",
      expertMeaning: "Premium kWh rate during peak.",
    },
    {
      id: "demandCharge",
      label: "Demand charge",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 350,
      validation: { min: 0 },
      helper: "Monthly peak kW demand charge.",
      expertMeaning: "Fixed peak capacity fee.",
    },
    {
      id: "plannedBudget",
      label: "Planned energy budget",
      type: "number",
      unit: "USD",
      required: false,
      smartDefault: 2000,
      validation: { min: 0 },
      helper: "Budget cap for the period.",
      expertMeaning: "Comparison for verdict.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "benchmark.variance_percent",
      formulaFamily: "benchmark",
      inputMap: { actual: "currentKwh", target: "targetKwh" },
      outputId: "kwhVariancePercent",
    },
    {
      formulaId: "energy.excess_kwh_cost",
      inputMap: {
        currentKwh: "currentKwh",
        targetKwh: "targetKwh",
        rate: "energyRate",
      },
      outputId: "excessKwhCost",
    },
    {
      formulaId: "energy.peak_demand_cost",
      inputMap: {
        peakKwh: "peakKwh",
        peakRate: "peakRate",
        demandCharge: "demandCharge",
      },
      outputId: "peakCost",
    },
    {
      formulaId: "energy.total_energy_cost",
      inputMap: {
        excessKwh: "excessKwhDerived",
        energyRate: "energyRate",
        peakCost: "peakCost",
      },
      outputId: "totalEnergyCost",
    },
    {
      formulaId: "loss.total_exposure",
      formulaFamily: "scrap",
      inputMap: {
        baseCost: "totalEnergyCost",
        hiddenMultiplier: "hiddenMultiplierConst",
      },
      outputId: "totalExposure",
    },
  ],

  outputs: [
    {
      id: "kwhVariancePercent",
      label: "kWh variance",
      unit: "%",
      format: "percentage",
    },
    {
      id: "excessKwhCost",
      label: "Excess kWh cost",
      unit: "USD",
      format: "currency",
    },
    {
      id: "peakCost",
      label: "Peak demand cost",
      unit: "USD",
      format: "currency",
    },
    {
      id: "totalExposure",
      label: "Energy loss exposure",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
  ],

  thresholds: [
    {
      fieldId: "kwhVariancePercent",
      warning: 10,
      critical: 20,
      direction: "higher_is_bad",
      warningMessage: "Consumption is above target — peak and idle load may be driving cost.",
      criticalMessage: "Energy and delay exposure are the main risk drivers — audit peak demand now.",
    },
    {
      fieldId: "totalEnergyCost",
      warning: 1800,
      critical: 2500,
      direction: "higher_is_bad",
      warningMessage: "Total energy cost is elevated versus typical efficiency band.",
      criticalMessage: "High risk — hidden cost may erase the margin on this budget period.",
    },
  ],

  reportTemplate: {
    title: "Energy Peak Loss Decision Report",
    sections: [
      "executive_summary",
      "loss_breakdown",
      "thresholds",
      "sensitivity",
      "action_plan",
      "assumptions",
    ],
    exportFormats: ["pdf", "excel"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.08,
    volatilityPercent: 18,
    targetMarginPercent: 10,
    assumptionNotes: [
      "Excess kWh = max(current − target, 0).",
      "Peak demand and tariff risk included in hidden multiplier.",
      "Tariff changes and power factor penalties not modeled unless you add inputs.",
    ],
  },
};
