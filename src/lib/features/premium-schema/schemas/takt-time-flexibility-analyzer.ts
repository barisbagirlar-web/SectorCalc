
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const TAKT_TIME_FLEXIBILITY_SCHEMA: PremiumCalculatorSchema = {
  id: "takt-time-flexibility-analyzer", legacyPaidSlug: "takt-time-flexibility-analyzer",
  name: "Takt Time Flexibility Analysis", name_i18n: {"en":"Takt Time Flexibility Analysis"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Mismatch between Takt time and cycle time causes hidden capacity loss and excess labor.", painStatement_i18n: {"en":"Mismatch between Takt time and cycle time causes hidden capacity loss and excess labor."},
  inputs: [
    { id: "availableTime", label: "Available Time (Daily)", label_i18n: {"en":"Available Time (Daily)"}, type: "number", unit: "dk/gun", required: true, smartDefault: 480, validation: { min: 1 }, helper: "", expertMeaning: "Daily available production time", expertMeaning_i18n: {"en":"Daily available production time"} },
    { id: "customerDemand", label: "Customer Demand (Daily)", label_i18n: {"en":"Customer Demand (Daily)"}, type: "number", unit: "units/day", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Daily customer demand", expertMeaning_i18n: {"en":"Daily customer demand"} },
    { id: "cycleTime", label: "Cycle Time", label_i18n: {"en":"Cycle Time"}, type: "number", unit: "min/unit", required: true, smartDefault: 1.2, validation: { min: 0.01 }, helper: "", expertMeaning: "Current cycle time per unit", expertMeaning_i18n: {"en":"Current cycle time per unit"} },
    { id: "numOperators", label: "Number of Operators", label_i18n: {"en":"Number of Operators"}, type: "number", unit: "people", required: true, smartDefault: 3, validation: { min: 1 }, helper: "", expertMeaning: "Number of operators pre line", expertMeaning_i18n: {"en":"Number of operators pre line"} },
    { id: "targetEfficiency", label: "Target Efficiency", label_i18n: {"en":"Target Efficiency"}, type: "number", unit: "%", required: false, smartDefault: 85, validation: { min: 1, max: 100 }, helper: "", expertMeaning: "Target line efficiency", expertMeaning_i18n: {"en":"Target line efficiency"} },
  ],
  outputs: [
    { id: "taktTime", label: "Takt Time", label_i18n: {"en":"Takt Time"}, unit: "min/unit", format: "number" },
    { id: "cycleFlexibility", label: "Cycle Flexibility Rate", label_i18n: {"en":"Cycle Flexibility Rate"}, unit: "%", format: "percentage" },
    { id: "balanceLoss", label: "Balance Loss", label_i18n: {"en":"Balance Loss"}, unit: "USD/day", format: "currency" },
    { id: "flexibilityPremium", label: "Flexibility Premium", label_i18n: {"en":"Flexibility Premium"}, unit: "USD/day", format: "currency" },
  ],
  thresholds: [{ fieldId: "cycleFlexibility", warning: 15, critical: 30, direction: "higher_is_bad", warningMessage: "Flexibility gap > 15% — line balancing recommended.", warningMessage_i18n: {"en":"Flexibility gap > 15% — line balancing recommended."}, criticalMessage: "Flexibility gap > 30% — revise Takt time.", criticalMessage_i18n: {"en":"Flexibility gap > 30% — revise Takt time."} }],
  formulaPipeline: [
    { formulaId: "measurement.takt_time", inputMap: { availableTime: "availableTime", customerDemand: "customerDemand" }, outputId: "taktTime" },
    { formulaId: "measurement.cycle_flexibility", inputMap: { cycleTime: "cycleTime", taktTime: "taktTime" ,
        actualCycleTime: "actualCycleTime"}, outputId: "cycleFlexibility" },
    { formulaId: "cost.balance_loss", inputMap: {
        balanceDelay: "cycleTime",
        laborRate: "taktTime",
        numOperators: "numOperators"
      }, outputId: "balanceLoss" },
    { formulaId: "cost.flexibility_premium", inputMap: {
        flexibilityHours: "cycleFlexibility",
        premiumRate: "targetEfficiency",
        balanceLoss: "balanceLoss"
      }, outputId: "flexibilityPremium" },
  ],
  reportTemplate: { title: "Takt Time Flexibility Report", title_i18n: {"en":"Takt Time Flexibility Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 5, targetMarginPercent: 15, assumptionNotes: ["Takt = Available / Demand.", "Flexibility = |Cycle − Takt| / Takt × 100.", "Balance loss = operator × cost variance."],assumptionNotes_i18n:[{"en":"Takt = Available / Demand."},{"en":"Flexibility = |Cycle − Takt| / Takt × 100."},{"en":"Balance loss = operator × cost variance."}] },
};
