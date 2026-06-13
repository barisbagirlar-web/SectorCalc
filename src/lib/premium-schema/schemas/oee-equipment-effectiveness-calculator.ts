import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const OEE_EQUIPMENT_EFFECTIVENESS_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "oee-equipment-effectiveness-calculator",
  name: "OEE Calculator",
  sectorSlug: "manufacturing",
  category: "oee",
  painStatement:
    "Without OEE tracking, chronic downtime and quality loss stay invisible.",

  inputs: [
    {
      id: "availability",
      label: "Availability",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 88,
      validation: { min: 0, max: 100 },
      helper: "Running time vs planned production time.",
      expertMeaning: "OEE availability pillar.",
    },
    {
      id: "performance",
      label: "Performance",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 92,
      validation: { min: 0, max: 100 },
      helper: "Actual vs ideal cycle speed.",
      expertMeaning: "OEE performance pillar.",
    },
    {
      id: "quality",
      label: "Quality",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 97,
      validation: { min: 0, max: 100 },
      helper: "Good units vs total units produced.",
      expertMeaning: "OEE quality pillar.",
    },
    {
      id: "machineRate",
      label: "Machine rate",
      type: "number",
      unit: "USD/h",
      required: true,
      smartDefault: 75,
      validation: { min: 0 },
      helper: "Loaded hourly machine cost for loss estimate.",
      expertMeaning: "Rate applied to availability loss hours.",
    },
    {
      id: "plannedHours",
      label: "Planned hours",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 160,
      validation: { min: 0.1 },
      helper: "Planned production hours in the period.",
      expertMeaning: "Scheduled run time base.",
    },
    {
      id: "downtimeHours",
      label: "Downtime hours",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 18,
      validation: { min: 0 },
      helper: "Unplanned or visible downtime in the period.",
      expertMeaning: "Hours lost to stops and changeovers.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "oee.basic",
      inputMap: { availability: "availability", performance: "performance", quality: "quality" },
      outputId: "oeeScore",
    },
    {
      formulaId: "oee.availability_loss_cost",
      inputMap: {
        machineRate: "machineRate",
        downtimeHours: "downtimeHours",
        plannedHours: "plannedHours",
      },
      outputId: "availabilityLossCost",
    },
  ],

  outputs: [
    {
      id: "oeeScore",
      label: "OEE score",
      unit: "%",
      format: "percentage",
      isBigNumber: true,
    },
    {
      id: "availabilityLossCost",
      label: "Availability loss cost",
      unit: "USD",
      format: "currency",
    },
  ],

  thresholds: [
    {
      fieldId: "oeeScore",
      warning: 65,
      critical: 50,
      direction: "lower_is_bad",
      warningMessage: "OEE is below world-class band — investigate downtime and quality losses.",
      criticalMessage: "OEE is critically low — margin may be lost before quotes are repriced.",
    },
  ],

  reportTemplate: {
    title: "OEE Equipment Effectiveness Decision Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.05,
    volatilityPercent: 8,
    targetMarginPercent: 15,
    assumptionNotes: [
      "OEE = availability × performance × quality.",
      "Availability loss cost uses machine rate and downtime hours.",
    ],
  },
};
