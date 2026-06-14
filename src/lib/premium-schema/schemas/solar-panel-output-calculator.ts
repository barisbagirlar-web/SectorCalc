import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const SolarPanelOutputCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "solar-panel-output-calculator",
  name: "Solar Panel Output Calculator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "IEC 61724-1 photovoltaic system performance monitoring standard",

  inputs: [
    {
      id: "panelRating_kW",
      label: "Panel rated power",
      type: "number",
      unit: "kW",
      required: true,
      smartDefault: 0.3,
      validation: { min: 0.001, max: 1000 },
      helper: "Must be positive, typical residential 0.3-0.5 kW",
      expertMeaning: "Panel rated power",
    },
    {
      id: "peakSunHours",
      label: "Peak sun hours per day",
      type: "number",
      unit: "hours/day",
      required: true,
      smartDefault: 5,
      validation: { min: 0.5, max: 12 },
      helper: "Typical range 3-7 hours for most locations",
      expertMeaning: "Peak sun hours per day",
    },
    {
      id: "performanceRatio",
      label: "Performance ratio",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 80,
      validation: { min: 50, max: 100, step: 0.1 },
      helper: "Typical 75-85% for well-designed systems",
      expertMeaning: "Performance ratio",
    },
    {
      id: "temperatureCoefficient",
      label: "Temperature coefficient of power",
      type: "number",
      unit: "%/°C",
      required: true,
      smartDefault: -0.4,
      validation: { min: -0.6, max: -0.2 },
      helper: "Typical -0.3 to -0.5 %/°C for crystalline silicon",
      expertMeaning: "Temperature coefficient of power",
    },
    {
      id: "cellTemperature",
      label: "Average cell temperature during peak hours",
      type: "number",
      unit: "°C",
      required: true,
      smartDefault: 45,
      validation: { min: -10, max: 80 },
      helper: "Typical 25-65°C depending on ambient and mounting",
      expertMeaning: "Average cell temperature during peak hours",
    },
    {
      id: "inverterEfficiency",
      label: "Inverter efficiency",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 96,
      validation: { min: 80, max: 100, step: 0.1 },
      helper: "Typical 95-98% for modern inverters",
      expertMeaning: "Inverter efficiency",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "panelRating_kW",
        "b": "peakSunHours",
        "c": "performanceRatio"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "panelRating_kW",
        "target": "peakSunHours"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Annual energy output (first year)",
      unit: "kWh",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Lifetime energy output",
      unit: "%",
      format: "percentage",
      isBigNumber: false,
    }
  ],

  thresholds: [
    {
      fieldId: "totalExposure",
      warning: 1,
      critical: 3,
      direction: "higher_is_bad",
      warningMessage: "Exposure is entering warning band — review drivers.",
      criticalMessage: "Exposure is critical — immediate operational review required.",
    },
  ],

  reportTemplate: {
    title: "[object Object] Decision Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.05,
    volatilityPercent: 8,
    targetMarginPercent: 15,
    assumptionNotes: [
      "Panel orientation is optimal (south-facing, tilt equal to latitude)",
      "No shading losses",
      "Temperature coefficient is linear",
    ],
  },
};
