import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const PompaGucuBasmaYuksekligiHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "pompa-gucu-basma-yuksekligi-hesabi",
  name: "Pompa Gücü — Basma Yüksekliği Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Hidrolik mühendislik temel denklemleri (Bernoulli, güç formülü)",

  inputs: [
    {
      id: "flowRate",
      label: "Flow rate (Q)",
      type: "number",
      unit: "m³/h",
      required: true,
      smartDefault: 100,
      validation: { min: 0.001, max: 100000 },
      helper: "Must be positive",
      expertMeaning: "Flow rate (Q)",
    },
    {
      id: "density",
      label: "Fluid density (ρ)",
      type: "number",
      unit: "kg/m³",
      required: true,
      smartDefault: 1000,
      validation: { min: 1, max: 20000 },
      helper: "Must be positive, typical range 1-20000",
      expertMeaning: "Fluid density (ρ)",
    },
    {
      id: "suctionPressure",
      label: "Suction pressure (p1)",
      type: "number",
      unit: "bar",
      required: true,
      smartDefault: 1,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative",
      expertMeaning: "Suction pressure (p1)",
    },
    {
      id: "dischargePressure",
      label: "Discharge pressure (p2)",
      type: "number",
      unit: "bar",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative, typically > suction",
      expertMeaning: "Discharge pressure (p2)",
    },
    {
      id: "suctionVelocity",
      label: "Suction velocity (v1)",
      type: "number",
      unit: "m/s",
      required: true,
      smartDefault: 2,
      validation: { min: 0, max: 50 },
      helper: "Non-negative",
      expertMeaning: "Suction velocity (v1)",
    },
    {
      id: "dischargeVelocity",
      label: "Discharge velocity (v2)",
      type: "number",
      unit: "m/s",
      required: true,
      smartDefault: 3,
      validation: { min: 0, max: 50 },
      helper: "Non-negative",
      expertMeaning: "Discharge velocity (v2)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "flowRate",
        "b": "density",
        "c": "suctionPressure"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "flowRate",
        "target": "density"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total dynamic head (H)",
      unit: "m",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Hydraulic power (P_h)",
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
      "Steady-state flow, incompressible fluid",
      "Negligible friction losses in pipes (minor losses ignored)",
      "Uniform velocity profiles at suction and discharge",
    ],
  },
};
