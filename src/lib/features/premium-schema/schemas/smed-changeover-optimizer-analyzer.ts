/**
 * Tool — SMED Changeover Duration Optimizer
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SMED_CHANGEOVER_OPTIMIZER_ANALYZER: PremiumCalculatorSchema = {
  id: "smed-changeover-optimizer-analyzer", legacyPaidSlug: "smed-changeover-optimizer-analyzer",
  name: "SMED Changeover Duration Optimizer", name_i18n: {"en":"SMED Changeover Duration Optimizer"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Long mold changeover times increase machine downtime, cause capacity loss, and remain invisible if SMED is not applied.", painStatement_i18n: {"en":"Long mold changeover times increase machine downtime, cause capacity loss, and remain invisible if SMED is not applied."},
  inputs: [
    {
      id: "smedInvestment",
      label: "Smed Investment",
      label_i18n: { en: "Smed Investment" },
      type: "number",
      unit: "—",

      group: "General"
    },
    { id: "currentChangeoverTime", label: "Current changeover time in minutes", label_i18n: {"en":"Current changeover time in minutes"}, type: "number", unit: "minutes", required: true, smartDefault: 45, validation: { min: 1 }, helper: "", expertMeaning: "Current changeover time in minutes", expertMeaning_i18n: {"en":"Current changeover time in minutes"} },
    { id: "changeoversPerMonth", label: "Changeovers per month", label_i18n: {"en":"Changeovers per month"}, type: "number", unit: "units", required: true, smartDefault: 30, validation: { min: 1 }, helper: "", expertMeaning: "Changeovers per month", expertMeaning_i18n: {"en":"Changeovers per month"} },
    { id: "targetChangeoverTime", label: "Target changeover time after SMED", label_i18n: {"en":"Target changeover time after SMED"}, type: "number", unit: "minutes", required: false, smartDefault: 15, validation: { min: 1 }, helper: "", expertMeaning: "Target changeover time after SMED", expertMeaning_i18n: {"en":"Target changeover time after SMED"} },
    { id: "machineHourlyRate", label: "Makine Hourly Cost", label_i18n: {"en":"Makine Hourly Cost"}, type: "number", unit: "USD/hour", required: true, smartDefault: 85, validation: { min: 1 }, helper: "", expertMeaning: "Machine cost per hour", expertMeaning_i18n: {"en":"Machine cost per hour"} },
    { id: "operatorCount", label: "Operators during changeover", label_i18n: {"en":"Operators during changeover"}, type: "number", unit: "units", required: false, smartDefault: 2, validation: { min: 1 }, helper: "", expertMeaning: "Operators during changeover", expertMeaning_i18n: {"en":"Operators during changeover"} },
    { id: "smedImplementationCost", label: "SMED application Cost", label_i18n: {"en":"SMED application Cost"}, type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Cost to implement SMED", expertMeaning_i18n: {"en":"Cost to implement SMED"} },
  ],
  outputs: [
    { id: "capacityRecovered", label: "Kazanlan Capacity", label_i18n: {"en":"Kazanlan Capacity"}, unit: "saat/yil", format: "number", isBigNumber: true },
    { id: "financialGain", label: "Financial Gain", label_i18n: {"en":"Financial Gain"}, unit: "USD/year", format: "currency" },
    { id: "roi", label: "Yatrm Return (ROI)", label_i18n: {"en":"Yatrm Return (ROI)"}, unit: "%", format: "percentage" },
  ],
  thresholds: [{ fieldId: "roi", warning: 100, critical: 50, direction: "lower_is_bad", warningMessage: "ROI < 100% — SMED implementation should be questioned.", warningMessage_i18n: {"en":"ROI < 100% — SMED implementation should be questioned."}, criticalMessage: "ROI < 50% — SMED project should be re-evaluated.", criticalMessage_i18n: {"en":"ROI < 50% — SMED project should be re-evaluated."} }],
  formulaPipeline: [
    { formulaId: "measurement.smed_capacity_recovered", inputMap: { currentChangeoverTime: "currentChangeoverTime", targetChangeoverTime: "targetChangeoverTime", changeoversPerMonth: "changeoversPerMonth" ,
        currentSetup: "currentSetup",
        targetSetup: "targetSetup",
        changeoverFreq: "changeoverFreq"}, outputId: "capacityRecovered" },
    { formulaId: "cost.smed_financial_gain", inputMap: { capacityRecovered: "capacityRecovered", machineHourlyRate: "machineHourlyRate", operatorCount: "operatorCount" ,
        bottleneckThroughput: "bottleneckThroughput",
        unitMargin: "unitMargin"}, outputId: "financialGain" },
    { formulaId: "cost.smed_roi", inputMap: {
        financialGain: "financialGain",
        smedImplementationCost: "smedImplementationCost"
      ,
        smedInvestment: "smedInvestment"}, outputId: "roi" },
  ],
  reportTemplate: { title: "SMED Changeover Optimization Report", title_i18n: {"en":"SMED Changeover Optimization Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: [],assumptionNotes_i18n:[{"en":"Gained capacity = (current − target) × number of changeovers × 12 / 60 hours."},{"en":"Financial gain = capacity × (machine + operator) hourly cost."},{"en":"ROI = (gain − implementation) / implementation × 100."},{"en":"SMED is based on the principle of internal and external separation."}] },
};
