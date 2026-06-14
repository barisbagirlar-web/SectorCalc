import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const RuzgarTurbiniYaklasikUretimHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "ruzgar-turbini-yaklasik-uretim-hesabi",
  name: "Rüzgar Türbini Yaklaşık Üretim Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Wind energy engineering and IEC 61400-12-1 standard",

  inputs: [
    {
      id: "averageWindSpeed",
      label: "Average wind speed at hub height",
      type: "number",
      unit: "m/s",
      required: true,
      smartDefault: 7,
      validation: { min: 0, max: 40 },
      helper: "Must be non-negative, typical range 3-25 m/s",
      expertMeaning: "Average wind speed at hub height",
    },
    {
      id: "weibullShapeParameter",
      label: "Weibull shape parameter (k)",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 2,
      validation: { min: 1, max: 4 },
      helper: "Typical range 1.5-3.0",
      expertMeaning: "Weibull shape parameter (k)",
    },
    {
      id: "rotorDiameter",
      label: "Rotor diameter",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 80,
      validation: { min: 1, max: 200 },
      helper: "Must be positive",
      expertMeaning: "Rotor diameter",
    },
    {
      id: "ratedPower",
      label: "Rated power",
      type: "number",
      unit: "kW",
      required: true,
      smartDefault: 2000,
      validation: { min: 1, max: 20000 },
      helper: "Must be positive",
      expertMeaning: "Rated power",
    },
    {
      id: "airDensity",
      label: "Air density at site",
      type: "number",
      unit: "kg/m³",
      required: true,
      smartDefault: 1.225,
      validation: { min: 0.9, max: 1.4 },
      helper: "Standard sea level is 1.225 kg/m³",
      expertMeaning: "Air density at site",
    },
    {
      id: "availabilityFactor",
      label: "Turbine availability factor",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 95,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Turbine availability factor",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "averageWindSpeed",
        "b": "weibullShapeParameter",
        "c": "rotorDiameter"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "averageWindSpeed",
        "target": "weibullShapeParameter"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Annual energy production (net)",
      unit: "kWh/year",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Capacity factor",
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
      "Weibull distribution accurately represents wind speed frequency",
      "Power curve is ideal (no degradation)",
      "Air density correction is linear",
    ],
  },
};
