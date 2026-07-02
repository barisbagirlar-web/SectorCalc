/**
 * Tool — Taguchi Kalite
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const TAGUCHI_QUALITY_LOSS_ANALYZER: PremiumCalculatorSchema = {
  id: "taguchi-quality-loss-analyzer", legacyPaidSlug: "taguchi-quality-loss-analyzer",
  name: "Taguchi Quality Loss Analysis", name_i18n: {"en":"Taguchi Quality Loss Analysis"}, sectorSlug: "quality", category: "cost",
  painStatement: "If the cost of deviations from product tolerances is not measured with the Taguchi loss function, hidden quality losses go unnoticed and improvement cannot be prioritized.", painStatement_i18n: {"en":"If the cost of deviations from product tolerances is not measured with the Taguchi loss function, hidden quality losses go unnoticed and improvement cannot be prioritized."},
  inputs: [
    { id: "targetValue", label: "Target Value", label_i18n: {"en":"Target Value"}, type: "number", unit: "", required: true, smartDefault: 10, validation: { min: 0.01 }, helper: "", expertMeaning: "Nominal target value", expertMeaning_i18n: {"en":"Nominal target value"} },
    { id: "tolerance", label: "Tolerance", label_i18n: {"en":"Tolerance"}, type: "number", unit: "", required: true, smartDefault: 1, validation: { min: 0.01 }, helper: "", expertMeaning: "Specification tolerance (±)", expertMeaning_i18n: {"en":"Specification tolerance (±)"} },
    { id: "lossAtTolerance", label: "Loss at Tolerance Limit", label_i18n: {"en":"Loss at Tolerance Limit"}, type: "number", unit: "USD", required: true, smartDefault: 5, validation: { min: 0.01 }, helper: "", expertMeaning: "Loss at tolerance limit", expertMeaning_i18n: {"en":"Loss at tolerance limit"} },
    { id: "processMean", label: "Process Mean", label_i18n: {"en":"Process Mean"}, type: "number", unit: "", required: true, smartDefault: 10.3, validation: { min: 0.01 }, helper: "", expertMeaning: "Actual process mean", expertMeaning_i18n: {"en":"Actual process mean"} },
    { id: "processStdDev", label: "Process Standard Deviation", label_i18n: {"en":"Process Standard Deviation"}, type: "number", unit: "", required: true, smartDefault: 0.4, validation: { min: 0.001 }, helper: "", expertMeaning: "Process standard deviation", expertMeaning_i18n: {"en":"Process standard deviation"} },
    { id: "annualProductionVolume", label: "Annual Production Volume", label_i18n: {"en":"Annual Production Volume"}, type: "number", unit: "units", required: true, smartDefault: 100000, validation: { min: 1 }, helper: "", expertMeaning: "Annual production volume", expertMeaning_i18n: {"en":"Annual production volume"} },
    { id: "specLower", label: "Lower Specification Limit", label_i18n: {"en":"Lower Specification Limit"}, type: "number", unit: "", required: false, smartDefault: 9, validation: { min: 0.01 }, helper: "", expertMeaning: "Lower specification limit", expertMeaning_i18n: {"en":"Lower specification limit"} },
    { id: "specUpper", label: "Upper Specification Limit", label_i18n: {"en":"Upper Specification Limit"}, type: "number", unit: "", required: false, smartDefault: 11, validation: { min: 0.01 }, helper: "", expertMeaning: "Upper specification limit", expertMeaning_i18n: {"en":"Upper specification limit"} },
  ],
  outputs: [
    { id: "taguchiLossPerUnit", label: "Taguchi Loss per Unit", label_i18n: {"en":"Taguchi Loss per Unit"}, unit: "USD/unit", format: "currency" },
  ],
  thresholds: [{ fieldId: "taguchiLossPerUnit", warning: 0.5, critical: 1, direction: "higher_is_bad", warningMessage: "Unit loss >$0.50 — process improvement opportunity exists.", warningMessage_i18n: {"en":"Unit loss >$0.50 — process improvement opportunity exists."}, criticalMessage: "Unit loss >$1.00 — review tolerance or process parameters.", criticalMessage_i18n: {"en":"Unit loss >$1.00 — review tolerance or process parameters."} }],
  formulaPipeline: [
    { formulaId: "cost.taguchi_loss_per_unit", inputMap: {
        targetValue: "targetValue",
        toleranceCost: "tolerance",
        toleranceLimit: "lossAtTolerance",
        actualValue: "processMean",
        processStdDev: "processStdDev",
        annualProductionVolume: "annualProductionVolume"
      }, outputId: "taguchiLossPerUnit" },
  ],
  reportTemplate: { title: "Taguchi Quality Loss Report", title_i18n: {"en":"Taguchi Quality Loss Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Taguchi loss = k × (MSD), MSD = σ² + (μ − T)².", "k = loss_tolerance / tolerance² — quality loss coefficient.", "Nominal-the-best (NTB) type Taguchi function is used.", "Process is calculated under normal distribution assumption."],assumptionNotes_i18n:[{"en":"Taguchi loss = k × (MSD), MSD = σ² + (μ − T)²."},{"en":"k = loss_tolerance / tolerance² — quality loss coefficient."},{"en":"Nominal-the-best (NTB) type Taguchi function is used."},{"en":"Process is calculated under normal distribution assumption."}] },
};
