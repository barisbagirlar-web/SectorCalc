import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const THREE_B_PRINTING_VS_MACHINING_BREAKEVEN_SCHEMA: PremiumCalculatorSchema = {
  id: "3d-printing-vs-machining-break-even-calculator",
  legacyPaidSlug: "3d-printing-vs-machining-break-even-calculator",
  name: "3D Printing vs Machining Break-Even Calculator", name_i18n: {"en":"3D Printing vs Machining Break-Even Calculator"},
  sectorSlug: "cnc-additive-manufacturing",
  category: "cost",
  painStatement: "Determines the exact production quantity at which 3D printing becomes more economical than CNC machining (or vice versa), using break-even analysis of setup costs and unit costs for both manufacturing methods.\\n\\nChoosing between additive manufacturing and subtractive machining is one of the most common production decisions in modern manufacturing. Without data-driven comparison, teams default to habit — overpaying for additive at high volumes or machining at low volumes. This tool calculates the crossover quantity, total cost curves, and cost difference at any specified volume.\\n\\nExample: With 3D printing at $100 setup and $5/part, and machining at $500 setup and $2/part, the break-even quantity is 134 parts. Below 134 units, printing is cheaper; above 134, machining wins. At 100 units, printing costs $600 vs. machining\\u2019s $700.\\n\\nManufacturing engineers, production planners, and sourcing managers use this break-even analyzer to objectively select the most cost-effective manufacturing process for any production quantity, eliminating guesswork and reducing per-part costs.", painStatement_i18n: {"en":"Determines the exact production quantity at which 3D printing becomes more economical than CNC machining (or vice versa), using break-even analysis of setup costs and unit costs for both manufacturing methods.\\n\\nChoosing between additive manufacturing and subtractive machining is one of the most common production decisions in modern manufacturing. Without data-driven comparison, teams default to habit — overpaying for additive at high volumes or machining at low volumes. This tool calculates the crossover quantity, total cost curves, and cost difference at any specified volume.\\n\\nExample: With 3D printing at $100 setup and $5/part, and machining at $500 setup and $2/part, the break-even quantity is 134 parts. Below 134 units, printing is cheaper; above 134, machining wins. At 100 units, printing costs $600 vs. machining\\u2019s $700.\\n\\nManufacturing engineers, production planners, and sourcing managers use this break-even analyzer to objectively select the most cost-effective manufacturing process for any production quantity, eliminating guesswork and reducing per-part costs."},

  inputs: [
    {
      id: "printingSetupCost",
      label: "3D printing setup cost", label_i18n: {"en":"3D printing setup cost"},
      type: "number",
      unit: "currency",
      required: true,
      smartDefault: 100,
      validation: { min: 0 },
      helper: "One-time setup, programming, and preparation for additive.", helper_i18n: {"en":"One-time setup, programming, and preparation for additive."},
      expertMeaning: "Fixed intercept for printing total cost curve.", expertMeaning_i18n: {"en":"Fixed intercept for printing total cost curve."},
    },
    {
      id: "printingUnitCost",
      label: "3D printing unit cost", label_i18n: {"en":"3D printing unit cost"},
      type: "number",
      unit: "currency/part",
      required: true,
      smartDefault: 5,
      validation: { min: 0 },
      helper: "Variable cost per printed part including material and machine time.", helper_i18n: {"en":"Variable cost per printed part including material and machine time."},
      expertMeaning: "Slope for printing total cost curve.", expertMeaning_i18n: {"en":"Slope for printing total cost curve."},
    },
    {
      id: "machiningSetupCost",
      label: "Machining setup cost", label_i18n: {"en":"Machining setup cost"},
      type: "number",
      unit: "currency",
      required: true,
      smartDefault: 500,
      validation: { min: 0 },
      helper: "Fixture, programming, and first-article setup for machining.", helper_i18n: {"en":"Fixture, programming, and first-article setup for machining."},
      expertMeaning: "Fixed intercept for machining total cost curve.", expertMeaning_i18n: {"en":"Fixed intercept for machining total cost curve."},
    },
    {
      id: "machiningUnitCost",
      label: "Machining unit cost", label_i18n: {"en":"Machining unit cost"},
      type: "number",
      unit: "currency/part",
      required: true,
      smartDefault: 2,
      validation: { min: 0 },
      helper: "Variable machining cost per good part.", helper_i18n: {"en":"Variable machining cost per good part."},
      expertMeaning: "Slope for machining total cost curve.", expertMeaning_i18n: {"en":"Slope for machining total cost curve."},
    },
    {
      id: "analysisQuantity",
      label: "Analysis quantity", label_i18n: {"en":"Analysis quantity"},
      type: "number",
      unit: "parts",
      required: true,
      smartDefault: 100,
      validation: { min: 1 },
      helper: "Quantity used to compare total costs at a specific demand level.", helper_i18n: {"en":"Quantity used to compare total costs at a specific demand level."},
      expertMeaning: "Not the break-even quantity — used for scenario totals only.", expertMeaning_i18n: {"en":"Not the break-even quantity — used for scenario totals only."},
    },
  ],

  formulaPipeline: [
    {
      formulaId: "cost.method_crossover_quantity",
      inputMap: {
        fixedA: "printingSetupCost",
        fixedB: "machiningSetupCost",
        unitA: "printingUnitCost",
        unitB: "machiningUnitCost",
      },
      outputId: "breakEvenQuantity",
    },
    {
      formulaId: "cost.fixed_plus_variable_total",
      inputMap: {
        fixedCost: "printingSetupCost",
        unitCost: "printingUnitCost",
        quantity: "analysisQuantity",
      },
      outputId: "printingTotalCost",
    },
    {
      formulaId: "cost.fixed_plus_variable_total",
      inputMap: {
        fixedCost: "machiningSetupCost",
        unitCost: "machiningUnitCost",
        quantity: "analysisQuantity",
      },
      outputId: "machiningTotalCost",
    },
    {
      formulaId: "cost.difference",
      inputMap: { a: "printingTotalCost", b: "machiningTotalCost" },
      outputId: "totalCostDelta",
    },
  ],

  outputs: [
    {
      id: "breakEvenQuantity",
      label: "Break-even quantity", label_i18n: {"en":"Break-even quantity"},
      unit: "parts",
      format: "number",
      isBigNumber: true,
    },
    {
      id: "printingTotalCost",
      label: "Printing total cost", label_i18n: {"en":"Printing total cost"},
      unit: "currency",
      format: "currency",
    },
    {
      id: "machiningTotalCost",
      label: "Machining total cost", label_i18n: {"en":"Machining total cost"},
      unit: "currency",
      format: "currency",
    },
    {
      id: "totalCostDelta",
      label: "Printing minus machining total", label_i18n: {"en":"Printing minus machining total"},
      unit: "currency",
      format: "currency",
    },
  ],

  thresholds: [
    {
      fieldId: "breakEvenQuantity",
      warning: 250,
      critical: 1000,
      direction: "higher_is_bad",
      warningMessage: "Break-even quantity is high — machining stays cheaper for typical batch sizes.", warningMessage_i18n: {"en":"Break-even quantity is high — machining stays cheaper for typical batch sizes."},
      criticalMessage: "Break-even is very high — additive is unlikely to win except at very low volume.", criticalMessage_i18n: {"en":"Break-even is very high — additive is unlikely to win except at very low volume."},
    },
  ],

  reportTemplate: {
    title: "Additive vs Machining Break-Even Report", title_i18n: {"en":"Additive vs Machining Break-Even Report"},
    sections: ["executive_summary", "thresholds", "sensitivity", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 8,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Linear unit-cost model — excludes tooling amortization beyond entered setup.",
      "Break-even uses printing setup/unit vs machining setup/unit crossover.",
      "Verify material yield, scrap, and post-process costs before production decisions.",
    ],assumptionNotes_i18n:[{"en":"Linear unit-cost model — excludes tooling amortization beyond entered setup."},{"en":"Break-even uses printing setup/unit vs machining setup/unit crossover."},{"en":"Verify material yield, scrap, and post-process costs before production decisions."}],
  },
};
