import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const KompresorDebisiTankHacmiHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "kompresor-debisi-tank-hacmi-hesabi",
  name: "Kompresör Debisi — Tank Hacmi Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Pneumatic system design standards (ISO 8573-1, PNEUROP)",

  inputs: [
    {
      id: "totalAirConsumption",
      label: "Total air consumption",
      type: "number",
      unit: "m³/min",
      required: true,
      smartDefault: 10,
      validation: { min: 0.1, max: 10000 },
      helper: "Must be positive",
      expertMeaning: "Total air consumption",
    },
    {
      id: "diversityFactor",
      label: "Diversity factor",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 80,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Diversity factor",
    },
    {
      id: "compressorFlowRate",
      label: "Compressor flow rate",
      type: "number",
      unit: "m³/min",
      required: true,
      smartDefault: 12,
      validation: { min: 0.1, max: 10000 },
      helper: "Must be positive",
      expertMeaning: "Compressor flow rate",
    },
    {
      id: "pressureDifferential",
      label: "Pressure differential",
      type: "number",
      unit: "bar",
      required: true,
      smartDefault: 2,
      validation: { min: 0.1, max: 20 },
      helper: "Must be positive",
      expertMeaning: "Pressure differential",
    },
    {
      id: "dutyCycle",
      label: "Duty cycle",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 60,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Duty cycle",
    },
    {
      id: "allowablePressureDrop",
      label: "Allowable pressure drop",
      type: "number",
      unit: "bar",
      required: true,
      smartDefault: 0.5,
      validation: { min: 0.01, max: 5 },
      helper: "Must be positive",
      expertMeaning: "Allowable pressure drop",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "totalAirConsumption",
        "b": "diversityFactor",
        "c": "compressorFlowRate"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "totalAirConsumption",
        "target": "diversityFactor"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Required tank volume",
      unit: "m³",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Compressor power estimate",
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
      "Isothermal compression",
      "Ideal gas behavior",
      "Steady-state operation",
    ],
  },
};
