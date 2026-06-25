import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CBAM_EXPOSURE_QUICK_CHECK_SCHEMA: PremiumCalculatorSchema = {
  id: "ener-503",
  name: "CBAM Exposure Quick Check",
  sectorSlug: "energy-carbon",
  category: "carbon",
  painStatement:
    "Importers can underestimate CBAM certificate cost when embedded emissions, certificate price and FX are not combined.",

  inputs: [
    {
      id: "embeddedEmissionsTon",
      label: "Embedded emissions",
      type: "number",
      unit: "ton CO₂e",
      required: true,
      smartDefault: 120,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "cbamCertificatePrice",
      label: "CBAM certificate price",
      type: "number",
      unit: "EUR/ton",
      required: true,
      smartDefault: 85,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "eurTryRate",
      label: "EUR/TRY rate",
      type: "number",
      unit: "TRY/EUR",
      required: true,
      smartDefault: 35,
      validation: { min: 0.01 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "productQuantity",
      label: "Product quantity",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 1000,
      validation: { min: 1 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "adminCost",
      label: "Admin cost",
      type: "number",
      unit: "TRY",
      required: true,
      smartDefault: 2500,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "carbon.cbam_certificate_exposure",
      inputMap: {
        embeddedEmissionsTon: "embeddedEmissionsTon",
        cbamCertificatePrice: "cbamCertificatePrice",
        eurTryRate: "eurTryRate",
      },
      outputId: "cbamCost",
    },
    {
      formulaId: "cost.unit_cost",
      inputMap: { totalCost: "cbamCost", quantity: "productQuantity" },
      outputId: "unitCbamCost",
    },
    {
      formulaId: "cost.sum2",
      inputMap: { a: "cbamCost", b: "adminCost" },
      outputId: "totalExposure",
    },
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total CBAM exposure",
      unit: "TRY",
      format: "currency",
      isBigNumber: true,
    },
    { id: "cbamCost", label: "CBAM certificate cost", unit: "TRY", format: "currency" },
    { id: "unitCbamCost", label: "Unit CBAM cost", unit: "TRY", format: "currency" },
    { id: "adminCost", label: "Admin cost", unit: "TRY", format: "currency" },
  ],

  thresholds: [
    {
      fieldId: "totalExposure",
      warning: 250000,
      critical: 500000,
      direction: "higher_is_bad",
      warningMessage: "CBAM exposure is elevated — verify certificate price and FX assumptions.",
      criticalMessage: "Critical exposure band — review embedded emissions data before shipment.",
    },
  ],

  reportTemplate: {
    title: "CBAM Exposure Quick Check Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.05,
    volatilityPercent: 12,
    targetMarginPercent: 0,
    assumptionNotes: [
      "CBAM cost = embeddedEmissionsTon × cbamCertificatePrice × eurTryRate.",
      "Unit CBAM cost = cbamCost ÷ productQuantity.",
      "Not a CBAM compliance obligation decision — financial exposure preview only.",
    ],
  },
};
