import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const HVAC_CALLBACK_MARGIN_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "hvac-501",
  name: "HVAC Callback Margin Risk Calculator",
  sectorSlug: "hvac",
  category: "cost",
  legacyPaidSlug: "hvac-project-margin-guard",
  painStatement:
    "HVAC projects lose margin when ductwork drift, commissioning time and call-back risk are not priced.",

  inputs: [
    {
      id: "projectRevenue",
      label: "Project revenue",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 64000,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "ductworkVariance",
      label: "Ductwork variance",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 4200,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "commissioningHours",
      label: "Commissioning hours",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 28,
      validation: { min: 0 },
      helper: "Start-up, balance and commissioning labor.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "laborRate",
      label: "Labor rate",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 55,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "callbackRiskPercent",
      label: "Callback risk",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 4,
      validation: { min: 0, max: 100 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "time.rework_cost",
      inputMap: { reworkHours: "commissioningHours", laborRate: "laborRate" },
      outputId: "commissioningCost",
    },
    {
      formulaId: "cost.percent_of_amount",
      inputMap: { amount: "projectRevenue", percent: "callbackRiskPercent" },
      outputId: "callbackRiskCost",
    },
    {
      formulaId: "cost.total_exposure",
      inputMap: { a: "ductworkVariance", b: "commissioningCost", c: "callbackRiskCost" },
      outputId: "totalExposure",
    },
    {
      formulaId: "cost.margin_pressure",
      inputMap: { excessCost: "totalExposure", monthlyRevenue: "projectRevenue" },
      outputId: "marginPressure",
    },
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total callback exposure",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    { id: "commissioningCost", label: "Commissioning cost", unit: "USD", format: "currency" },
    { id: "callbackRiskCost", label: "Callback risk cost", unit: "USD", format: "currency" },
    { id: "marginPressure", label: "Margin pressure", unit: "%", format: "percentage" },
  ],

  thresholds: [
    {
      fieldId: "callbackRiskPercent",
      warning: 3,
      critical: 7,
      direction: "higher_is_bad",
      warningMessage: "Callback risk is elevated — verify commissioning and duct assumptions.",
      criticalMessage: "Critical callback exposure — reprice before accepting similar HVAC work.",
    },
    {
      fieldId: "marginPressure",
      warning: 5,
      critical: 10,
      direction: "higher_is_bad",
      warningMessage: "Margin pressure is building on this project envelope.",
      criticalMessage: "Critical margin pressure — hidden callback cost may erase profit.",
    },
  ],

  reportTemplate: {
    title: "HVAC Callback Margin Risk Decision Report",
    sections: [
      "executive_summary",
      "loss_breakdown",
      "thresholds",
      "sensitivity",
      "action_plan",
      "assumptions",
    ],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.11,
    volatilityPercent: 17,
    targetMarginPercent: 18,
    assumptionNotes: [
      "Commissioning cost = commissioning hours × labor rate.",
      "Callback risk = project revenue × callback risk percent.",
      "Margin pressure = total exposure ÷ project revenue.",
    ],
  },
};
