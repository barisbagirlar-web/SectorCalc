import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const THREE_B_PRINTING_BATCH_NESTING_SCHEMA: PremiumCalculatorSchema = {
  id: "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator",
  legacyPaidSlug: "3b-baski-parti-optimizasyonu-ve-yuvalama-calculator",
  name: "3D Printing Batch Nesting Optimizer",
  sectorSlug: "cnc-additive-manufacturing",
  category: "cost",
  painStatement:
    "Build plate utilization is often guessed, leaving machine hours and unit cost on the table.",

  inputs: [
    {
      id: "bedWidthMm",
      label: "Bed width",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 200,
      validation: { min: 1 },
      helper: "Printable bed width in millimeters.",
      expertMeaning: "Used to estimate parts per row.",
    },
    {
      id: "bedDepthMm",
      label: "Bed depth",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 200,
      validation: { min: 1 },
      helper: "Printable bed depth in millimeters.",
      expertMeaning: "Used to estimate parts per column.",
    },
    {
      id: "partWidthMm",
      label: "Part width",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 50,
      validation: { min: 1 },
      helper: "Bounding box width including minimum spacing allowance.",
      expertMeaning: "Denominator for row fit calculation.",
    },
    {
      id: "partDepthMm",
      label: "Part depth",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 50,
      validation: { min: 1 },
      helper: "Bounding box depth including minimum spacing allowance.",
      expertMeaning: "Denominator for column fit calculation.",
    },
    {
      id: "printTimeHours",
      label: "Batch print time",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 8,
      validation: { min: 0.1 },
      helper: "Estimated machine hours for one full bed batch.",
      expertMeaning: "Used to estimate machine time per nested part.",
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
      label: "Max parts per batch",
      unit: "parts",
      format: "number",
      isBigNumber: true,
    },
    {
      id: "utilizationRatePct",
      label: "Bed utilization",
      unit: "%",
      format: "percentage",
    },
    {
      id: "partsPerRow",
      label: "Parts per row",
      unit: "parts",
      format: "number",
    },
    {
      id: "partsPerColumn",
      label: "Parts per column",
      unit: "parts",
      format: "number",
    },
    {
      id: "machineHoursPerPart",
      label: "Machine hours per part",
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
      warningMessage: "Bed utilization is low — revisit nesting or part orientation.",
      criticalMessage: "Bed utilization is critically low — batch economics are weak.",
    },
  ],

  reportTemplate: {
    title: "3D Printing Batch Nesting Report",
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
    ],
  },
};
