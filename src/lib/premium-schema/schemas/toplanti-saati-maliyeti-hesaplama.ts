import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const ToplantiSaatiMaliyetiHesaplama_SCHEMA: PremiumCalculatorSchema = {
  id: "toplanti-saati-maliyeti-hesaplama",
  name: "Toplantı Saati Maliyeti Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering cost accounting",

  inputs: [
    {
      id: "totalAttendees",
      label: "Total attendees",
      type: "number",
      unit: "persons",
      required: true,
      smartDefault: 10,
      validation: { min: 1, max: 1000 },
      helper: "Must be positive integer",
      expertMeaning: "Total attendees",
    },
    {
      id: "hourlyRate",
      label: "Average hourly rate per attendee",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 50,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative currency",
      expertMeaning: "Average hourly rate per attendee",
    },
    {
      id: "meetingDurationHours",
      label: "Meeting duration (hours)",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 1,
      validation: { min: 0.25, max: 24 },
      helper: "Duration between 0.25 and 24 hours",
      expertMeaning: "Meeting duration (hours)",
    },
    {
      id: "overheadRatePercent",
      label: "Overhead rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 20,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Overhead rate",
    },
    {
      id: "opportunityFactor",
      label: "Opportunity cost factor",
      type: "number",
      unit: "ratio",
      required: true,
      smartDefault: 0.5,
      validation: { min: 0, max: 2 },
      helper: "Factor between 0 and 2",
      expertMeaning: "Opportunity cost factor",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "totalAttendees",
        "b": "hourlyRate",
        "c": "meetingDurationHours"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "totalAttendees",
        "target": "hourlyRate"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total meeting cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Cost per attendee",
      unit: "%",
      format: "percentage",
      isBigNumber: false,
    }
  ],

  thresholds: [
    {
      fieldId: "totalExposure",
      warning: 1,
      critical: 3,
      direction: "higher_is_bad",
      warningMessage: "Exposure is entering warning band — review drivers.",
      criticalMessage: "Exposure is critical — immediate operational review required.",
    },
  ],

  reportTemplate: {
    title: "[object Object] Decision Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.05,
    volatilityPercent: 8,
    targetMarginPercent: 15,
    assumptionNotes: [
      "All attendees have the same hourly rate",
      "Overhead rate is applied uniformly",
      "Opportunity cost factor is a proxy for lost productivity",
    ],
  },
};
