import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const BELT_PULLEY_SPEED_LENGTH_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "belt-pulley-speed-length-calculator",
  name: "Belt Pulley Speed and Length Calculator",
  sectorSlug: "manufacturing",
  category: "measurement",
  painStatement:
    "Drive changes are sized from memory instead of documented speed and belt length.",

  inputs: [
    {
      id: "driverRpm",
      label: "Driver RPM",
      type: "number",
      unit: "rpm",
      required: true,
      smartDefault: 1450,
      validation: { min: 1 },
      helper: "Motor or driver shaft speed.",
      expertMeaning: "Input speed for ratio and belt speed.",
    },
    {
      id: "driverDiameterMm",
      label: "Driver diameter",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 120,
      validation: { min: 1 },
      helper: "Driver pulley pitch diameter.",
      expertMeaning: "Driver pitch diameter for ratio and length.",
    },
    {
      id: "drivenDiameterMm",
      label: "Driven diameter",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 240,
      validation: { min: 1 },
      helper: "Driven pulley pitch diameter.",
      expertMeaning: "Driven pitch diameter for ratio and length.",
    },
    {
      id: "centerDistanceMm",
      label: "Center distance",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 420,
      validation: { min: 1 },
      helper: "Shaft center distance for open belt length.",
      expertMeaning: "Center distance C in belt length formula.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "measurement.pulley_driven_rpm",
      inputMap: {
        driverRpm: "driverRpm",
        driverDiameterMm: "driverDiameterMm",
        drivenDiameterMm: "drivenDiameterMm",
      },
      outputId: "drivenRpm",
    },
    {
      formulaId: "measurement.belt_speed_mpm",
      inputMap: { driverDiameterMm: "driverDiameterMm", driverRpm: "driverRpm" },
      outputId: "beltSpeedMpm",
    },
    {
      formulaId: "measurement.open_belt_length_mm",
      inputMap: {
        driverDiameterMm: "driverDiameterMm",
        drivenDiameterMm: "drivenDiameterMm",
        centerDistanceMm: "centerDistanceMm",
      },
      outputId: "beltLengthMm",
    },
  ],

  outputs: [
    {
      id: "drivenRpm",
      label: "Driven RPM",
      unit: "rpm",
      format: "number",
      isBigNumber: true,
    },
    {
      id: "beltSpeedMpm",
      label: "Belt speed",
      unit: "m/min",
      format: "number",
    },
    {
      id: "beltLengthMm",
      label: "Belt length",
      unit: "mm",
      format: "number",
    },
  ],

  thresholds: [
    {
      fieldId: "drivenRpm",
      warning: 3600,
      critical: 6000,
      direction: "higher_is_bad",
      warningMessage: "Driven speed is high — verify pulley rating and belt type.",
      criticalMessage: "Driven speed exceeds typical belt drive range — engineering review required.",
    },
  ],

  reportTemplate: {
    title: "Belt Drive Screening Summary",
    sections: ["executive_summary", "thresholds", "assumptions", "action_plan"],
    exportFormats: ["pdf"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 3,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Open belt length uses standard center-distance approximation.",
      "Does not replace manufacturer belt selection or tension specs.",
      "Verify slip, wrap angle and service factors before installation.",
    ],
  },
};
