import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const QUALITY_COST_PAF_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "quality-cost-paf-calculator",
  name: "Quality Cost PAF Calculator",
  sectorSlug: "manufacturing",
  category: "cost",
  painStatement:
    "Quality budgets hide prevention and appraisal spend until failure costs spike.",

  inputs: [
    {
      id: "preventionCost",
      label: "Prevention cost",
      type: "number",
      unit: "USD/month",
      required: true,
      smartDefault: 4200,
      validation: { min: 0 },
      helper: "Training, process control and prevention activities.",
      expertMeaning: "PAF prevention bucket for the period.",
    },
    {
      id: "appraisalCost",
      label: "Appraisal cost",
      type: "number",
      unit: "USD/month",
      required: true,
      smartDefault: 3100,
      validation: { min: 0 },
      helper: "Inspection, testing and audit cost.",
      expertMeaning: "PAF appraisal bucket for the period.",
    },
    {
      id: "failureCost",
      label: "Failure cost",
      type: "number",
      unit: "USD/month",
      required: true,
      smartDefault: 9800,
      validation: { min: 0 },
      helper: "Scrap, rework, warranty and downtime from defects.",
      expertMeaning: "PAF failure bucket for the period.",
    },
    {
      id: "revenue",
      label: "Revenue",
      type: "number",
      unit: "USD/month",
      required: true,
      smartDefault: 420000,
      validation: { min: 1 },
      helper: "Monthly revenue for ratio context.",
      expertMeaning: "Denominator for quality cost percent.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "cost.sum3",
      inputMap: {
        a: "preventionCost",
        b: "appraisalCost",
        c: "failureCost",
      },
      outputId: "totalQualityCost",
    },
    {
      formulaId: "cost.ratio_percent",
      inputMap: { numerator: "totalQualityCost", denominator: "revenue" },
      outputId: "qualityCostPercent",
    },
  ],

  outputs: [
    {
      id: "totalQualityCost",
      label: "Total quality cost",
      unit: "$",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "qualityCostPercent",
      label: "Quality cost % of revenue",
      unit: "%",
      format: "percentage",
    },
  ],

  thresholds: [
    {
      fieldId: "qualityCostPercent",
      warning: 4,
      critical: 8,
      direction: "higher_is_bad",
      warningMessage: "Quality cost ratio is elevated — review failure drivers.",
      criticalMessage: "Quality cost ratio is critical — prioritize failure reduction projects.",
    },
  ],

  reportTemplate: {
    title: "Quality Cost PAF Decision Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 5,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Total quality cost = prevention + appraisal + failure.",
      "Quality cost % = total quality cost ÷ revenue × 100.",
      "PAF classification is informational — align buckets with your finance policy.",
    ],
  },
};
