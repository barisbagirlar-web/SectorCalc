import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const FIVE_S_AUDIT_EFFICIENCY_LOSS_SCHEMA: PremiumCalculatorSchema = {
  id: "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator",
  legacyPaidSlug: "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator",
  name: "5S Audit Score Efficiency Loss Cost Converter", name_i18n: {"en":"5S Audit Score Efficiency Loss Cost Converter","tr":"5S Audit Score Efficiency Loss Cost Converter"},
  sectorSlug: "lean-production",
  category: "cost",
  painStatement:
    "Converts 5S audit scores into actual dollar losses from workplace disorganization, search time, and inefficient workflows, making the financial case for workplace organization visible to management.\n\nMost factories track 5S scores but cannot answer: \"How much money are we losing because of a low 5S score?\" This tool models the efficiency loss percentage based on the gap between current and target 5S score, then multiplies it by total labor capacity cost to reveal the monthly financial drain of poor workplace organization.\n\nExample: A department with 50 employees, a 38/100 current 5S score, 87/100 target, and $35/hour labor cost discovers $34,496 monthly efficiency loss. Improving to the target score recovers $25,168 monthly — a $302,000 annual opportunity.\n\nLean managers, production supervisors, and continuous improvement teams use this converter to prove the ROI of 5S initiatives, set data-driven improvement targets, and communicate workplace organization value in financial terms that leadership understands.", painStatement_i18n: {"en":"Converts 5S audit scores into actual dollar losses from workplace disorganization, search time, and inefficient workflows, making the financial case for workplace organization visible to management.\\n\\nMost factories track 5S scores but cannot answer: \\\"How much money are we losing because of a low 5S score?\\\" This tool models the efficiency loss percentage based on the gap between current and target 5S score, then multiplies it by total labor capacity cost to reveal the monthly financial drain of poor workplace organization.\\n\\nExample: A department with 50 employees, a 38/100 current 5S score, 87/100 target, and $35/hour labor cost discovers $34,496 monthly efficiency loss. Improving to the target score recovers $25,168 monthly — a $302,000 annual opportunity.\\n\\nLean managers, production supervisors, and continuous improvement teams use this converter to prove the ROI of 5S initiatives, set data-driven improvement targets, and communicate workplace organization value in financial terms that leadership understands.","tr":"Converts 5S audit scores into actual dollar losses from workplace disorganization, search time, and inefficient workflows, making the financial case for workplace organization visible to management.\\n\\nMost factories track 5S scores but cannot answer: \\\"How much money are we losing because of a low 5S score?\\\" This tool models the efficiency loss percentage based on the gap between current and target 5S score, then multiplies it by total labor capacity cost to reveal the monthly financial drain of poor workplace organization.\\n\\nExample: A department with 50 employees, a 38/100 current 5S score, 87/100 target, and $35/hour labor cost discovers $34,496 monthly efficiency loss. Improving to the target score recovers $25,168 monthly — a $302,000 annual opportunity.\\n\\nLean managers, production supervisors, and continuous improvement teams use this converter to prove the ROI of 5S initiatives, set data-driven improvement targets, and communicate workplace organization value in financial terms that leadership understands."},

  inputs: [
    {
      id: "current5sScore",
      label: "Current 5S score", label_i18n: {"en":"Current 5S score","tr":"Current 5S score"},
      type: "number",
      unit: "/100",
      required: true,
      smartDefault: 38,
      validation: { min: 0, max: 100 },
      helper: "Latest audit score on a 0–100 scale.", helper_i18n: {"en":"Latest audit score on a 0–100 scale.","tr":"Latest audit score on a 0–100 scale."},
      expertMeaning: "Lower scores increase modeled efficiency loss percent.", expertMeaning_i18n: {"en":"Lower scores increase modeled efficiency loss percent.","tr":"Lower scores increase modeled efficiency loss percent."},
    },
    {
      id: "target5sScore",
      label: "Target 5S score", label_i18n: {"en":"Target 5S score","tr":"Target 5S score"},
      type: "number",
      unit: "/100",
      required: true,
      smartDefault: 87,
      validation: { min: 0, max: 100 },
      helper: "Target score after improvement program.", helper_i18n: {"en":"Target score after improvement program.","tr":"Target score after improvement program."},
      expertMeaning: "Used to estimate recoverable monthly cost potential.", expertMeaning_i18n: {"en":"Used to estimate recoverable monthly cost potential.","tr":"Used to estimate recoverable monthly cost potential."},
    },
    {
      id: "totalEmployees",
      label: "Affected employees", label_i18n: {"en":"Affected employees","tr":"Affected employees"},
      type: "number",
      unit: "people",
      required: true,
      smartDefault: 50,
      validation: { min: 1 },
      helper: "Operators and staff impacted by workplace organization losses.", helper_i18n: {"en":"Operators and staff impacted by workplace organization losses.","tr":"Operators and staff impacted by workplace organization losses."},
      expertMeaning: "Multiplied by monthly hours and hourly cost.", expertMeaning_i18n: {"en":"Multiplied by monthly hours and hourly cost.","tr":"Multiplied by monthly hours and hourly cost."},
    },
    {
      id: "avgHourlyCost",
      label: "Average hourly cost", label_i18n: {"en":"Average hourly cost","tr":"Average hourly cost"},
      type: "number",
      unit: "currency/hour",
      required: true,
      smartDefault: 35,
      validation: { min: 0 },
      helper: "Fully loaded labor cost per hour.", helper_i18n: {"en":"Fully loaded labor cost per hour.","tr":"Fully loaded labor cost per hour."},
      expertMeaning: "Applied to lost productive hours.", expertMeaning_i18n: {"en":"Applied to lost productive hours.","tr":"Applied to lost productive hours."},
    },
    {
      id: "monthlyWorkingHours",
      label: "Monthly working hours", label_i18n: {"en":"Monthly working hours","tr":"Monthly working hours"},
      type: "number",
      unit: "hours/person",
      required: true,
      smartDefault: 176,
      validation: { min: 1 },
      helper: "Paid productive hours per person per month.", helper_i18n: {"en":"Paid productive hours per person per month.","tr":"Paid productive hours per person per month."},
      expertMeaning: "Capacity base before efficiency loss factor.", expertMeaning_i18n: {"en":"Capacity base before efficiency loss factor.","tr":"Capacity base before efficiency loss factor."},
    },
  ],

  formulaPipeline: [
    {
      formulaId: "lean.efficiency_gap_percent",
      inputMap: { currentScore: "current5sScore" },
      outputId: "efficiencyLossPct",
    },
    {
      formulaId: "cost.labor_capacity_cost",
      inputMap: {
        headcount: "totalEmployees",
        hours: "monthlyWorkingHours",
        hourlyCost: "avgHourlyCost",
        lossFactor: "efficiencyLossPct",
      },
      outputId: "monthlyLossCost",
    },
    {
      formulaId: "lean.score_gap_percent",
      inputMap: { currentScore: "current5sScore", targetScore: "target5sScore" },
      outputId: "improvementGapPct",
    },
    {
      formulaId: "cost.labor_capacity_cost",
      inputMap: {
        headcount: "totalEmployees",
        hours: "monthlyWorkingHours",
        hourlyCost: "avgHourlyCost",
        lossFactor: "improvementGapPct",
      },
      outputId: "improvementPotentialCost",
    },
  ],

  outputs: [
    {
      id: "monthlyLossCost",
      label: "Monthly efficiency loss cost", label_i18n: {"en":"Monthly efficiency loss cost","tr":"Monthly efficiency loss cost"},
      unit: "currency",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "efficiencyLossPct",
      label: "Efficiency loss percent", label_i18n: {"en":"Efficiency loss percent","tr":"Efficiency loss percent"},
      unit: "%",
      format: "percentage",
    },
    {
      id: "improvementPotentialCost",
      label: "Improvement potential cost", label_i18n: {"en":"Improvement potential cost","tr":"Improvement potential cost"},
      unit: "currency",
      format: "currency",
    },
    {
      id: "improvementGapPct",
      label: "Score gap percent", label_i18n: {"en":"Score gap percent","tr":"Score gap percent"},
      unit: "%",
      format: "percentage",
    },
  ],

  thresholds: [
    {
      fieldId: "monthlyLossCost",
      warning: 10000,
      critical: 50000,
      direction: "higher_is_bad",
      warningMessage: "Monthly 5S-related loss is material — prioritize workplace organization.", warningMessage_i18n: {"en":"Monthly 5S-related loss is material — prioritize workplace organization.","tr":"Monthly 5S-related loss is material — prioritize workplace organization."},
      criticalMessage: "Monthly loss is severe — launch a focused 5S recovery sprint.", criticalMessage_i18n: {"en":"Monthly loss is severe — launch a focused 5S recovery sprint.","tr":"Monthly loss is severe — launch a focused 5S recovery sprint."},
    },
  ],

  reportTemplate: {
    title: "5S Efficiency Loss Cost Report", title_i18n: {"en":"5S Efficiency Loss Cost Report","tr":"5S Efficiency Loss Cost Report"},
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 10,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Efficiency loss is modeled as (100 − current score) / 100 of paid capacity.",
      "Improvement potential uses the gap between current and target score.",
      "This is an operational estimate — not payroll, accounting, or audited financial advice.",
    ],assumptionNotes_i18n:[{"en":"Efficiency loss is modeled as (100 − current score) / 100 of paid capacity.","tr":"Efficiency loss is modeled as (100 − current score) / 100 of paid capacity."},{"en":"Improvement potential uses the gap between current and target score.","tr":"Improvement potential uses the gap between current and target score."},{"en":"This is an operational estimate — not payroll, accounting, or audited financial advice.","tr":"This is an operational estimate — not payroll, accounting, or audited financial advice."}],
  },
};
