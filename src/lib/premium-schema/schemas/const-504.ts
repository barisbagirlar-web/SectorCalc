import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const FIRE_SYSTEM_FLOW_HYDRANT_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "const-504",
  name: "Fire System Flow and Hydrant Calculator",
  sectorSlug: "construction",
  category: "measurement",
  painStatement:
    "Fire protection bids miss flow demand before hydrant and pipe sizing.",

  inputs: [
    {
      id: "protectedAreaM2",
      label: "Protected area",
      type: "number",
      unit: "m²",
      required: true,
      smartDefault: 1200,
      validation: { min: 1 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "designDensityLpmM2",
      label: "Design density",
      type: "number",
      unit: "L/min·m²",
      required: true,
      smartDefault: 10,
      validation: { min: 0.1 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "hydrantCapacityLpm",
      label: "Hydrant capacity",
      type: "number",
      unit: "L/min",
      required: true,
      smartDefault: 2500,
      validation: { min: 100 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "measurement.fire_flow_demand",
      inputMap: {
        protectedAreaM2: "protectedAreaM2",
        designDensityLpmM2: "designDensityLpmM2",
      },
      outputId: "flowDemandLpm",
    },
    {
      formulaId: "measurement.hydrant_count",
      inputMap: {
        flowDemandLpm: "flowDemandLpm",
        hydrantCapacityLpm: "hydrantCapacityLpm",
      },
      outputId: "hydrantCount",
    },
  ],

  outputs: [
    {
      id: "flowDemandLpm",
      label: "Required flow",
      unit: "L/min",
      format: "number",
      isBigNumber: true,
    },
    {
      id: "hydrantCount",
      label: "Hydrants required",
      unit: "units",
      format: "number",
    },
  ],

  thresholds: [
    {
      fieldId: "flowDemandLpm",
      warning: 8000,
      critical: 15000,
      direction: "higher_is_bad",
      warningMessage: "Flow demand is material — confirm pipe sizing and pump head.",
      criticalMessage: "Flow demand is very high — escalate hydraulic study before bid.",
    },
  ],

  reportTemplate: {
    title: "Fire Flow and Hydrant Decision Report",
    sections: ["executive_summary", "thresholds", "assumptions", "action_plan"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 5,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Flow demand = protected area × design density.",
      "Hydrant count = ceil(flow demand ÷ hydrant capacity).",
      "Informational screening only — verify with local fire code and hydraulic calculations.",
    ],
  },
};
