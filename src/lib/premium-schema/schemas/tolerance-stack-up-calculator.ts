import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const TOLERANCE_STACK_UP_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "tolerance-stack-up-calculator",
  name: "Tolerance Stack-Up Calculator",
  sectorSlug: "manufacturing",
  category: "calibration",
  painStatement:
    "Fit issues often come from stacked tolerances without a documented chain check.",

  inputs: [
    {
      id: "t1",
      label: "Tolerance 1",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 0.15,
      validation: { min: 0 },
      helper: "First part tolerance contribution.",
      expertMeaning: "Symmetric tolerance band width for part one.",
    },
    {
      id: "t2",
      label: "Tolerance 2",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 0.1,
      validation: { min: 0 },
      helper: "Second part tolerance contribution.",
      expertMeaning: "Tolerance band width for part two.",
    },
    {
      id: "t3",
      label: "Tolerance 3",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 0.08,
      validation: { min: 0 },
      helper: "Third part tolerance contribution.",
      expertMeaning: "Tolerance band width for part three.",
    },
    {
      id: "t4",
      label: "Tolerance 4",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 0.12,
      validation: { min: 0 },
      helper: "Fourth part tolerance contribution.",
      expertMeaning: "Tolerance band width for part four.",
    },
    {
      id: "assemblyLimit",
      label: "Assembly limit",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 0.35,
      validation: { min: 0.01 },
      helper: "Maximum allowable stack for the assembly chain.",
      expertMeaning: "Design clearance or fit limit for comparison.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "calibration.tolerance_worst_case_stack",
      inputMap: { t1: "t1", t2: "t2", t3: "t3", t4: "t4" },
      outputId: "worstCaseStack",
    },
    {
      formulaId: "calibration.tolerance_rss_stack",
      inputMap: { t1: "t1", t2: "t2", t3: "t3", t4: "t4" },
      outputId: "rssStack",
    },
    {
      formulaId: "cost.difference",
      inputMap: { a: "assemblyLimit", b: "worstCaseStack" },
      outputId: "worstCaseClearance",
    },
  ],

  outputs: [
    {
      id: "worstCaseStack",
      label: "Worst-case stack",
      unit: "mm",
      format: "number",
      isBigNumber: true,
    },
    {
      id: "rssStack",
      label: "RSS stack",
      unit: "mm",
      format: "number",
    },
    {
      id: "worstCaseClearance",
      label: "Worst-case clearance",
      unit: "mm",
      format: "number",
    },
  ],

  thresholds: [
    {
      fieldId: "worstCaseClearance",
      warning: 0.05,
      critical: 0,
      direction: "lower_is_bad",
      warningMessage: "Worst-case stack is close to the assembly limit — review driving tolerances.",
      criticalMessage: "Worst-case stack exceeds assembly limit — adjust tolerances before build.",
    },
  ],

  reportTemplate: {
    title: "Tolerance Stack-Up Decision Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 5,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Worst-case stack = sum of four tolerance contributions.",
      "RSS stack = √(t1² + t2² + t3² + t4²).",
      "Worst-case clearance = assembly limit − worst-case stack.",
    ],
  },
};
