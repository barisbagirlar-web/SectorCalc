import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const PRESSURE_VESSEL_WALL_THICKNESS_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "pressure-vessel-wall-thickness-calculator",
  name: "Pressure Vessel Wall Thickness Calculator",
  sectorSlug: "manufacturing",
  category: "measurement",
  painStatement:
    "Fabricators need a quick thickness screen before detailed ASME calculations.",

  inputs: [
    {
      id: "designPressureBar",
      label: "Design pressure",
      type: "number",
      unit: "bar",
      required: true,
      smartDefault: 16,
      validation: { min: 0.1 },
      helper: "Internal design pressure for the vessel.",
      expertMeaning: "MAWP or design gauge pressure basis.",
    },
    {
      id: "diameterMm",
      label: "Inside diameter",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 900,
      validation: { min: 10 },
      helper: "Nominal inside diameter of the shell.",
      expertMeaning: "D used in thin-wall screening formula.",
    },
    {
      id: "allowableStressMpa",
      label: "Allowable stress",
      type: "number",
      unit: "MPa",
      required: true,
      smartDefault: 138,
      validation: { min: 1 },
      helper: "Material allowable stress at design temperature.",
      expertMeaning: "S value from code tables — informational input.",
    },
    {
      id: "weldEfficiency",
      label: "Weld efficiency",
      type: "number",
      unit: "×",
      required: true,
      smartDefault: 0.85,
      validation: { min: 0.1, max: 1 },
      helper: "Joint efficiency factor E (typical 0.7–1.0).",
      expertMeaning: "Longitudinal seam efficiency for screening.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "measurement.vessel_wall_thickness",
      inputMap: {
        designPressureBar: "designPressureBar",
        diameterMm: "diameterMm",
        allowableStressMpa: "allowableStressMpa",
        weldEfficiency: "weldEfficiency",
      },
      outputId: "wallThicknessMm",
    },
  ],

  outputs: [
    {
      id: "wallThicknessMm",
      label: "Minimum wall thickness",
      unit: "mm",
      format: "number",
      isBigNumber: true,
    },
  ],

  thresholds: [
    {
      fieldId: "wallThicknessMm",
      warning: 8,
      critical: 3,
      direction: "lower_is_bad",
      warningMessage: "Wall thickness is thin for the entered pressure — review material and joint efficiency.",
      criticalMessage: "Wall thickness is critically thin — obtain qualified pressure vessel design review.",
    },
  ],

  reportTemplate: {
    title: "Pressure Vessel Wall Thickness Screening Report",
    sections: ["executive_summary", "thresholds", "assumptions", "action_plan"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 5,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Screening thickness ≈ P × D ÷ (2 × S × E) with unit conversion proxy.",
      "Corrosion allowance, nozzle reinforcement and code editions are not modeled.",
      "Not ASME/API compliance output — engineering sign-off required.",
    ],
  },
};
