import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CARBON_FOOTPRINT_COMPLIANCE_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "carbon-footprint-compliance-risk",
  name: "Carbon Footprint Compliance Risk Calculator",
  sectorSlug: "energy-carbon",
  category: "carbon",
  legacyPaidSlug: "cbam-compliance-verdict",
  painStatement:
    "Exporters and manufacturers can underestimate carbon exposure when energy, fuel and carbon price assumptions are not connected.",

  inputs: [
    {
      id: "energyEmissionsTon",
      label: "Energy emissions",
      type: "number",
      unit: "ton CO₂e",
      required: true,
      smartDefault: 120,
      validation: { min: 0 },
      helper: "Energy-related emissions tonnage for the period.",
      expertMeaning: "Scope-style energy emissions stack.",
    },
    {
      id: "fuelEmissionsTon",
      label: "Fuel emissions",
      type: "number",
      unit: "ton CO₂e",
      required: true,
      smartDefault: 45,
      validation: { min: 0 },
      helper: "Fuel and transport emissions tonnage.",
      expertMeaning: "Mobile and fuel combustion emissions.",
    },
    {
      id: "carbonPrice",
      label: "Carbon price",
      type: "number",
      unit: "USD/ton",
      required: true,
      smartDefault: 85,
      validation: { min: 0 },
      helper: "Assumed carbon price or CBAM reference rate.",
      expertMeaning: "Price per ton applied to exposed emissions.",
    },
    {
      id: "exposurePercent",
      label: "Exposure percent",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 60,
      validation: { min: 0, max: 100 },
      helper: "Share of emissions subject to compliance cost.",
      expertMeaning: "Regulatory or export exposure band.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "carbon.total_emissions",
      inputMap: { energyEmissionsTon: "energyEmissionsTon", fuelEmissionsTon: "fuelEmissionsTon" },
      outputId: "totalEmissions",
    },
    {
      formulaId: "carbon.cbam_exposure",
      inputMap: {
        emissionsTon: "totalEmissions",
        carbonPrice: "carbonPrice",
        exposurePercent: "exposurePercent",
      },
      outputId: "carbonExposure",
    },
  ],

  outputs: [
    {
      id: "carbonExposure",
      label: "Carbon compliance exposure",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    { id: "totalEmissions", label: "Total emissions", unit: "ton CO₂e", format: "number" },
  ],

  thresholds: [
    {
      fieldId: "carbonExposure",
      warning: 5000,
      critical: 20000,
      direction: "higher_is_bad",
      warningMessage: "Carbon exposure is elevated — verify reporting and export assumptions.",
      criticalMessage: "Critical compliance exposure — reprice or hedge before export shipment.",
    },
  ],

  reportTemplate: {
    title: "Carbon Footprint Compliance Risk Decision Report",
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
    hiddenLossMultiplier: 1.1,
    volatilityPercent: 25,
    targetMarginPercent: 10,
    assumptionNotes: [
      "Total emissions = energy + fuel tonnage.",
      "Carbon exposure = emissions × carbon price × exposure percent.",
      "Compliance estimates vary by jurisdiction — verify before reporting.",
    ],
  },
};
