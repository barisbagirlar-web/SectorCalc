import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const THREE_B_PRINTING_BATCH_NESTING_SCHEMA: PremiumCalculatorSchema = {
  id: "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator",
  legacyPaidSlug: "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator",
  name: "3D Printing Batch Nesting Optimizer", name_i18n: {"en":"3D Printing Batch Nesting Optimizer"},
  sectorSlug: "cnc-additive-manufacturing",
  category: "cost",
  painStatement:
    "Optimizes 3D printer build plate utilization by calculating maximum parts per batch based on bounding box dimensions, bed size, and nesting efficiency — translating utilization percentages into cost per part.\n\nBuild plate utilization is the single biggest lever for additive manufacturing profitability, yet most operators estimate it by eye. This tool calculates exact rectangular nesting fit, utilization percentage, and machine hours per part, revealing the true cost impact of inefficient bed packing.\n\nExample: A 200\u00D7200 mm bed with 50\u00D750 mm parts fits 12 parts per batch at 75% utilization with an 8-hour print. Each part costs 0.67 machine hours. Poor nesting fitting only 8 parts raises machine hours to 1.0 per part — a 50% cost increase that directly reduces margin.\n\nAdditive manufacturing engineers and production planners use this optimizer to maximize batch size, reduce per-part machine costs, and make data-driven decisions about build orientation and multi-part nesting strategy.", painStatement_i18n: {"en":"Optimizes 3D printer build plate utilization by calculating maximum parts per batch based pre bounding box dimensions, bed size, and nesting efficiency — translating utilization percentages into cost per part.\\n\\nBuild plate utilization is the single biggest lever for additive manufacturing profitability, yet most operators estimate it by eye. This tool calculates exact rectangular nesting fit, utilization percentage, and machine hours per part, revealing the true cost impact of inefficient bed packing.\\n\\nExample: A 200\\u00D7200 mm bed with 50\\u00D750 mm parts fits 12 parts per batch at 75% utilization with an 8-hour print. Each part costs 0.67 machine hours. Poor nesting fitting only 8 parts raises machine hours to 1.0 per part — a 50% cost increase that directly reduces margin.\\n\\nAdditive manufacturing engineers and production planners use this optimizer to maximize batch size, reduce per-part machine costs, and make data-driven decisions about build orientation and multi-part nesting strategy."},

  inputs: [
    {
      id: "bedWidthMm",
      label: "Bed width", label_i18n: {"en":"Bed width"},
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 200,
      validation: { min: 1 },
      helper: "Printable bed width in millimeters.", helper_i18n: {"en":"Printable bed width in millimeters."},
      expertMeaning: "Used to estimate parts per row.", expertMeaning_i18n: {"en":"Used to estimate parts per row."},
    },
    {
      id: "bedDepthMm",
      label: "Bed depth", label_i18n: {"en":"Bed depth"},
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 200,
      validation: { min: 1 },
      helper: "Printable bed depth in millimeters.", helper_i18n: {"en":"Printable bed depth in millimeters."},
      expertMeaning: "Used to estimate parts per column.", expertMeaning_i18n: {"en":"Used to estimate parts per column."},
    },
    {
      id: "partWidthMm",
      label: "Part width", label_i18n: {"en":"Part width"},
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 50,
      validation: { min: 1 },
      helper: "Bounding box width including minimum spacing allowance.", helper_i18n: {"en":"Bounding box width including minimum spacing allowance."},
      expertMeaning: "Denominator for row fit calculation.", expertMeaning_i18n: {"en":"Denominator for row fit calculation."},
    },
    {
      id: "partDepthMm",
      label: "Part depth", label_i18n: {"en":"Part depth"},
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 50,
      validation: { min: 1 },
      helper: "Bounding box depth including minimum spacing allowance.", helper_i18n: {"en":"Bounding box depth including minimum spacing allowance."},
      expertMeaning: "Denominator for column fit calculation.", expertMeaning_i18n: {"en":"Denominator for column fit calculation."},
    },
    {
      id: "printTimeHours",
      label: "Batch print time", label_i18n: {"en":"Batch print time"},
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 8,
      validation: { min: 0.1 },
      helper: "Estimated machine hours for one full bed batch.", helper_i18n: {"en":"Estimated machine hours for one full bed batch."},
      expertMeaning: "Used to estimate machine time per nested part.", expertMeaning_i18n: {"en":"Used to estimate machine time per nested part."},
    },
  ],

  formulaPipeline: [
    {
      formulaId: "layout.floor_parts_fit",
      inputMap: { span: "bedWidthMm", part: "partWidthMm" },
      outputId: "partsPerRow",
    },
    {
      formulaId: "layout.floor_parts_fit",
      inputMap: { span: "bedDepthMm", part: "partDepthMm" },
      outputId: "partsPerColumn",
    },
    {
      formulaId: "layout.nest_parts_count",
      inputMap: { rows: "partsPerRow", cols: "partsPerColumn" },
      outputId: "maxPartsPerBatch",
    },
    {
      formulaId: "layout.rect_bed_utilization_pct",
      inputMap: {
        partsPerRow: "partsPerRow",
        partsPerColumn: "partsPerColumn",
        partWidth: "partWidthMm",
        partDepth: "partDepthMm",
        bedWidth: "bedWidthMm",
        bedDepth: "bedDepthMm",
      },
      outputId: "utilizationRatePct",
    },
    {
      formulaId: "cost.unit_cost",
      inputMap: { totalCost: "printTimeHours", quantity: "maxPartsPerBatch" },
      outputId: "machineHoursPerPart",
    },
  ],

  outputs: [
    {
      id: "maxPartsPerBatch",
      label: "Max parts per batch", label_i18n: {"en":"Max parts per batch"},
      unit: "parts",
      format: "number",
      isBigNumber: true,
    },
    {
      id: "utilizationRatePct",
      label: "Bed utilization", label_i18n: {"en":"Bed utilization"},
      unit: "%",
      format: "percentage",
    },
    {
      id: "partsPerRow",
      label: "Parts per row", label_i18n: {"en":"Parts per row"},
      unit: "parts",
      format: "number",
    },
    {
      id: "partsPerColumn",
      label: "Parts per column", label_i18n: {"en":"Parts per column"},
      unit: "parts",
      format: "number",
    },
    {
      id: "machineHoursPerPart",
      label: "Machine hours per part", label_i18n: {"en":"Machine hours per part"},
      unit: "hours",
      format: "duration",
    },
  ],

  thresholds: [
    {
      fieldId: "utilizationRatePct",
      warning: 45,
      critical: 25,
      direction: "lower_is_bad",
      warningMessage: "Bed utilization is low — revisit nesting or part orientation.", warningMessage_i18n: {"en":"Bed utilization is low — revisit nesting or part orientation."},
      criticalMessage: "Bed utilization is critically low — batch economics are weak.", criticalMessage_i18n: {"en":"Bed utilization is critically low — batch economics are weak."},
    },
  ],

  reportTemplate: {
    title: "3D Printing Batch Nesting Report", title_i18n: {"en":"3D Printing Batch Nesting Report"},
    sections: ["executive_summary", "thresholds", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 5,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Rectangular bounding-box nesting — no irregular polygon packing.",
      "Spacing and brim margins should be included in part width/depth inputs.",
      "Machine hours per part assumes one full bed batch and even part mix.",
    ],assumptionNotes_i18n:[{"en":"Rectangular bounding-box nesting — no irregular polygon packing."},{"en":"Spacing and brim margins should be included in part width/depth inputs."},{"en":"Machine hours per part assumes one full bed batch and even part mix."}],
  },
};
