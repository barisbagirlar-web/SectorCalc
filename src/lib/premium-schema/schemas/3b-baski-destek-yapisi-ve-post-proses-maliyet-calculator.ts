import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const THREE_B_PRINTING_SUPPORT_POST_PROCESS_SCHEMA: PremiumCalculatorSchema = {
  id: "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator",
  legacyPaidSlug: "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator",
  name: "3D Printing Support & Post-Process Cost Calculator",
  sectorSlug: "cnc-additive-manufacturing",
  category: "cost",
  painStatement:
    "Support material volume and post-process labor are often excluded from additive job costing.",

  inputs: [
    {
      id: "supportVolumeCm3",
      label: "Support volume",
      type: "number",
      unit: "cm³",
      required: true,
      smartDefault: 20,
      validation: { min: 0 },
      helper: "Estimated support structure volume for the build.",
      expertMeaning: "Multiplied by material cost per cm³ for support material spend.",
    },
    {
      id: "materialCostPerCm3",
      label: "Material cost per cm³",
      type: "number",
      unit: "currency/cm³",
      required: true,
      smartDefault: 0.05,
      validation: { min: 0 },
      helper: "Fully loaded resin or filament cost per cubic centimeter.",
      expertMeaning: "Includes material purchase price and typical waste factor.",
    },
    {
      id: "cleaningTimeMinutes",
      label: "Support removal time",
      type: "number",
      unit: "min",
      required: true,
      smartDefault: 15,
      validation: { min: 0 },
      helper: "Labor minutes for support removal and surface cleanup.",
      expertMeaning: "Converted to hours and multiplied by labor rate.",
    },
    {
      id: "laborRatePerHour",
      label: "Labor rate",
      type: "number",
      unit: "currency/hour",
      required: true,
      smartDefault: 25,
      validation: { min: 0 },
      helper: "Shop labor rate for post-processing work.",
      expertMeaning: "Applied to cleaning time for labor cost.",
    },
    {
      id: "batchQuantity",
      label: "Parts per batch",
      type: "number",
      unit: "parts",
      required: true,
      smartDefault: 1,
      validation: { min: 1 },
      helper: "Number of parts sharing this support/post-process estimate.",
      expertMeaning: "Used to derive per-part post-process cost.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "cost.product2",
      inputMap: { a: "supportVolumeCm3", b: "materialCostPerCm3" },
      outputId: "supportMaterialCost",
    },
    {
      formulaId: "time.downtime_minute_cost",
      inputMap: { downtimeMinutes: "cleaningTimeMinutes", hourlyRate: "laborRatePerHour" },
      outputId: "cleaningLaborCost",
    },
    {
      formulaId: "cost.sum2",
      inputMap: { a: "supportMaterialCost", b: "cleaningLaborCost" },
      outputId: "totalPostProcessCost",
    },
    {
      formulaId: "cost.unit_cost",
      inputMap: { totalCost: "totalPostProcessCost", quantity: "batchQuantity" },
      outputId: "postProcessCostPerPart",
    },
  ],

  outputs: [
    {
      id: "totalPostProcessCost",
      label: "Total post-process cost",
      unit: "currency",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "supportMaterialCost",
      label: "Support material cost",
      unit: "currency",
      format: "currency",
    },
    {
      id: "cleaningLaborCost",
      label: "Cleaning labor cost",
      unit: "currency",
      format: "currency",
    },
    {
      id: "postProcessCostPerPart",
      label: "Post-process cost per part",
      unit: "currency",
      format: "currency",
    },
  ],

  thresholds: [
    {
      fieldId: "totalPostProcessCost",
      warning: 50,
      critical: 200,
      direction: "higher_is_bad",
      warningMessage: "Post-process cost is material — review orientation and support strategy.",
      criticalMessage: "Post-process cost is high — redesign supports or batch nesting before quoting.",
    },
  ],

  reportTemplate: {
    title: "3D Printing Post-Process Cost Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 5,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Support volume is an engineering estimate — verify with slicer data when available.",
      "Cleaning time should include support removal, sanding, and IPA wash where applicable.",
      "This is an operational cost model, not a certified quote or ERP reconciliation.",
    ],
  },
};
