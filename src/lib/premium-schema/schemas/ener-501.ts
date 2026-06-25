import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CARBON_FOOTPRINT_COMPLIANCE_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "ener-501",
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
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "fuelEmissionsTon",
      label: "Fuel emissions",
      type: "number",
      unit: "ton CO₂e",
      required: true,
      smartDefault: 45,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "carbonPrice",
      label: "Carbon price",
      type: "number",
      unit: "USD/ton",
      required: true,
      smartDefault: 85,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "exposurePercent",
      label: "Exposure percent",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 60,
      validation: { min: 0, max: 100 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
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
