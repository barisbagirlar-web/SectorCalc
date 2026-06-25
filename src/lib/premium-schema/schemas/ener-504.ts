import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CBAM_UNIT_PRODUCT_CARBON_FOOTPRINT_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "ener-504",
  name: "CBAM Unit Product Carbon Footprint Calculator",
  sectorSlug: "energy-carbon",
  category: "carbon",
  painStatement:
    "Exporters need product-level carbon evidence but lack affordable tooling.",

  inputs: [
    {
      id: "energyEmissionsTon",
      label: "Energy emissions",
      type: "number",
      unit: "ton CO₂e",
      required: true,
      smartDefault: 48,
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
      smartDefault: 12,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "productionUnits",
      label: "Production units",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 5000,
      validation: { min: 1 },
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
  ],

  formulaPipeline: [
    {
      formulaId: "carbon.total_emissions",
      inputMap: { energyEmissionsTon: "energyEmissionsTon", fuelEmissionsTon: "fuelEmissionsTon" },
      outputId: "totalEmissions",
    },
    {
      formulaId: "carbon.unit_product_emissions",
      inputMap: { totalEmissionsTon: "totalEmissions", productionUnits: "productionUnits" },
      outputId: "unitEmissionsTon",
    },
    {
      formulaId: "carbon.unit_exposure_cost",
      inputMap: { unitEmissionsTon: "unitEmissionsTon", carbonPrice: "carbonPrice" },
      outputId: "unitCarbonCost",
    },
  ],

  outputs: [
    {
      id: "unitEmissionsTon",
      label: "Unit embedded emissions",
      unit: "ton CO₂e",
      format: "number",
      isBigNumber: true,
    },
    {
      id: "totalEmissions",
      label: "Total batch emissions",
      unit: "ton CO₂e",
      format: "number",
    },
    {
      id: "unitCarbonCost",
      label: "Unit carbon cost exposure",
      unit: "USD",
      format: "currency",
    },
  ],

  thresholds: [
    {
      fieldId: "unitEmissionsTon",
      warning: 0.05,
      critical: 0.12,
      direction: "higher_is_bad",
      warningMessage: "Unit carbon intensity is elevated — verify energy and yield assumptions.",
      criticalMessage: "Unit carbon intensity is very high — review process before export filing.",
    },
  ],

  reportTemplate: {
    title: "CBAM Unit Carbon Footprint Decision Report",
    sections: ["executive_summary", "thresholds", "assumptions", "action_plan"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.02,
    volatilityPercent: 12,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Unit emissions = total batch emissions ÷ production units.",
      "Unit carbon cost = unit emissions × reference carbon price.",
      "Informational simulation only — not legal or compliance certification.",
    ],
  },
};
