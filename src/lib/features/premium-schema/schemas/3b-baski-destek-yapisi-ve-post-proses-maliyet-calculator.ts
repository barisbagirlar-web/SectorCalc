import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const THREE_B_PRINTING_SUPPORT_POST_PROCESS_SCHEMA: PremiumCalculatorSchema = {
  id: "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator",
  legacyPaidSlug: "3b-baski-destek-yapisi-ve-post-proses-maliyet-calculator",
  name: "3D Printing Support & Post-Process Cost Calculator", name_i18n: {"en":"3D Printing Support & Post-Process Cost Calculator"},
  sectorSlug: "cnc-additive-manufacturing",
  category: "cost",
  painStatement: "Calculates the total cost of support structures and post-processing labor for 3D printed parts, revealing hidden expenses routinely excluded from additive manufacturing job quotes.\\n\\nAdditive manufacturing cost estimates frequently focus pre build time and model material, ignoring support material consumption, removal labor, and surface finishing. This tool aggregates support volume cost, removal labor, and batch post-process cost into a total that often adds 30-60% to the apparent part cost.\\n\\nExample: A part with 20 cm\\u00B3 support volume at $0.05/cm\\u00B3 and 15-minute cleaning time at $25/hour has $12.25 total post-process cost. In a batch of 10, post-process adds only $1.23 per part. But a single-part batch with 60 cm\\u00B3 support and 45-minute cleanup jumps to $46.50 — often more than the build cost.\\n\\nAdditive manufacturing engineers, shop owners, and quoting specialists use this calculator to build complete cost models, optimize part orientation for minimal support, and ensure every quote covers the full cost of post-processing.", painStatement_i18n: {"en":"Calculates the total cost of support structures and post-processing labor for 3D printed parts, revealing hidden expenses routinely excluded from additive manufacturing job quotes.\\n\\nAdditive manufacturing cost estimates frequently focus pre build time and model material, ignoring support material consumption, removal labor, and surface finishing. This tool aggregates support volume cost, removal labor, and batch post-process cost into a total that often adds 30-60% to the apparent part cost.\\n\\nExample: A part with 20 cm\\u00B3 support volume at $0.05/cm\\u00B3 and 15-minute cleaning time at $25/hour has $12.25 total post-process cost. In a batch of 10, post-process adds only $1.23 per part. But a single-part batch with 60 cm\\u00B3 support and 45-minute cleanup jumps to $46.50 — often more than the build cost.\\n\\nAdditive manufacturing engineers, shop owners, and quoting specialists use this calculator to build complete cost models, optimize part orientation for minimal support, and ensure every quote covers the full cost of post-processing."},

  inputs: [
    {
      id: "supportVolumeCm3",
      label: "Support volume", label_i18n: {"en":"Support volume"},
      type: "number",
      unit: "cm³",
      required: true,
      smartDefault: 20,
      validation: { min: 0 },
      helper: "Estimated support structure volume for the build.", helper_i18n: {"en":"Estimated support structure volume for the build."},
      expertMeaning: "Multiplied by material cost per cm³ for support material spend.", expertMeaning_i18n: {"en":"Multiplied by material cost per cm³ for support material spend."},
    },
    {
      id: "materialCostPerCm3",
      label: "Material cost per cm³", label_i18n: {"en":"Material cost per cm³"},
      type: "number",
      unit: "currency/cm³",
      required: true,
      smartDefault: 0.05,
      validation: { min: 0 },
      helper: "Fully loaded resin or filament cost per cubic centimeter.", helper_i18n: {"en":"Fully loaded resin or filament cost per cubic centimeter."},
      expertMeaning: "Includes material purchase price and typical waste factor.", expertMeaning_i18n: {"en":"Includes material purchase price and typical waste factor."},
    },
    {
      id: "cleaningTimeMinutes",
      label: "Support removal time", label_i18n: {"en":"Support removal time"},
      type: "number",
      unit: "min",
      required: true,
      smartDefault: 15,
      validation: { min: 0 },
      helper: "Labor minutes for support removal and surface cleanup.", helper_i18n: {"en":"Labor minutes for support removal and surface cleanup."},
      expertMeaning: "Converted to hours and multiplied by labor rate.", expertMeaning_i18n: {"en":"Converted to hours and multiplied by labor rate."},
    },
    {
      id: "laborRatePerHour",
      label: "Labor rate", label_i18n: {"en":"Labor rate"},
      type: "number",
      unit: "currency/hour",
      required: true,
      smartDefault: 25,
      validation: { min: 0 },
      helper: "Shop labor rate for post-processing work.", helper_i18n: {"en":"Shop labor rate for post-processing work."},
      expertMeaning: "Applied to cleaning time for labor cost.", expertMeaning_i18n: {"en":"Applied to cleaning time for labor cost."},
    },
    {
      id: "batchQuantity",
      label: "Parts per batch", label_i18n: {"en":"Parts per batch"},
      type: "number",
      unit: "parts",
      required: true,
      smartDefault: 1,
      validation: { min: 1 },
      helper: "Number of parts sharing this support/post-process estimate.", helper_i18n: {"en":"Number of parts sharing this support/post-process estimate."},
      expertMeaning: "Used to derive per-part post-process cost.", expertMeaning_i18n: {"en":"Used to derive per-part post-process cost."},
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
      label: "Total post-process cost", label_i18n: {"en":"Total post-process cost"},
      unit: "currency",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "supportMaterialCost",
      label: "Support material cost", label_i18n: {"en":"Support material cost"},
      unit: "currency",
      format: "currency",
    },
    {
      id: "cleaningLaborCost",
      label: "Cleaning labor cost", label_i18n: {"en":"Cleaning labor cost"},
      unit: "currency",
      format: "currency",
    },
    {
      id: "postProcessCostPerPart",
      label: "Post-process cost per part", label_i18n: {"en":"Post-process cost per part"},
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
      warningMessage: "Post-process cost is material — review orientation and support strategy.", warningMessage_i18n: {"en":"Post-process cost is material — review orientation and support strategy."},
      criticalMessage: "Post-process cost is high — redesign supports or batch nesting before quoting.", criticalMessage_i18n: {"en":"Post-process cost is high — redesign supports or batch nesting before quoting."},
    },
  ],

  reportTemplate: {
    title: "3D Printing Post-Process Cost Report", title_i18n: {"en":"3D Printing Post-Process Cost Report"},
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
    ],assumptionNotes_i18n:[{"en":"Support volume is an engineering estimate — verify with slicer data when available."},{"en":"Cleaning time should include support removal, sanding, and IPA wash where applicable."},{"en":"This is an operational cost model, not a certified quote or ERP reconciliation."}],
  },
};
