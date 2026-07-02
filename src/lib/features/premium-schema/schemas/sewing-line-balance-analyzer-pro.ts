
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SEWING_LINE_BALANCE_SCHEMA: PremiumCalculatorSchema = {
  id: "sewing-line-balance-analyzer-pro", legacyPaidSlug: "sewing-line-balance-analyzer-pro",
  name: "Sewing Line Balancer (Pro)", name_i18n: {"en":"Sewing Line Balancer (Pro)"}, sectorSlug: "textile", category: "measurement",
  painStatement: "If SMV distribution is not balanced pre the sewing line, line efficiency drops, WIP accumulates, and delivery is delayed.", painStatement_i18n: {"en":"If SMV distribution is not balanced pre the sewing line, line efficiency drops, WIP accumulates, and delivery is delayed."},
  inputs: [
    { id: "smvTimes", label: "Array of SMV times per operation", label_i18n: {"en":"Array of SMV times per operation"}, type: "number", unit: "dak", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Array of SMV times per operation", expertMeaning_i18n: {"en":"Array of SMV times per operation"} },
    { id: "availableTime", label: "Shift Duration", label_i18n: {"en":"Shift Duration"}, type: "number", unit: "dak", required: true, smartDefault: 450, validation: { min: 1 }, helper: "", expertMeaning: "Available shift minutes", expertMeaning_i18n: {"en":"Available shift minutes"} },
    { id: "downtime", label: "Planned breaks & meetings", label_i18n: {"en":"Planned breaks & meetings"}, type: "number", unit: "dak", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Planned breaks & meetings", expertMeaning_i18n: {"en":"Planned breaks & meetings"} },
    { id: "demand", label: "Daily production target", label_i18n: {"en":"Daily production target"}, type: "number", unit: "units/day", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Daily production target", expertMeaning_i18n: {"en":"Daily production target"} },
    { id: "operatorCount", label: "Number of Operators", label_i18n: {"en":"Number of Operators"}, type: "number", unit: "scalar", required: false, smartDefault: 5, validation: { min: 1 }, helper: "", expertMeaning: "Number of operators", expertMeaning_i18n: {"en":"Number of operators"} },
    { id: "targetEfficiency", label: "Target Efficiency", label_i18n: {"en":"Target Efficiency"}, type: "number", unit: "%", required: false, smartDefault: 85, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Target line efficiency", expertMeaning_i18n: {"en":"Target line efficiency"} },
    { id: "defectRate", label: "Defect Rate", label_i18n: {"en":"Defect Rate"}, type: "number", unit: "%", required: false, smartDefault: 3, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Defect rate", expertMeaning_i18n: {"en":"Defect rate"} },
    { id: "cycleTotal", label: "Sum of all SMV times", label_i18n: {"en":"Sum of all SMV times"}, type: "number", unit: "dak", required: true, smartDefault: 6.5, validation: { min: 0.01 }, helper: "", expertMeaning: "Sum of all SMV times", expertMeaning_i18n: {"en":"Sum of all SMV times"} },
  ],
  outputs: [
    { id: "taktTime", label: "Takt Time", label_i18n: {"en":"Takt Time"}, unit: "dak", format: "number" },
    { id: "cycleTotal", label: "Total SMV", label_i18n: {"en":"Total SMV"}, unit: "dak", format: "number" },
    { id: "theoreticalOps", label: "Teorik Operator", label_i18n: {"en":"Teorik Operator"}, unit: "people", format: "number" },
    { id: "actualOperators", label: "Actual Operator", label_i18n: {"en":"Actual Operator"}, unit: "people", format: "number" },
    { id: "lineEfficiency", label: "Line Verimliligi", label_i18n: {"en":"Line Verimliligi"}, unit: "%", format: "percentage" },
    { id: "balanceDelay", label: "Balance Loss", label_i18n: {"en":"Balance Loss"}, unit: "%", format: "percentage", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "lineEfficiency", warning: 80, critical: 70, direction: "lower_is_bad", warningMessage: "Efficiency < 80% - SMV distribution should be improved.", warningMessage_i18n: {"en":"Efficiency < 80% - SMV distribution should be improved."}, criticalMessage: "Efficiency < %70 - Line re dengelenmeli.", criticalMessage_i18n: {"en":"Efficiency < %70 - Line re dengelenmeli."} }],
  formulaPipeline: [
    { formulaId: "measurement.sewing_takt_time", inputMap: { availableTime: "availableTime", demand: "demand" }, outputId: "taktTime" },
    { formulaId: "measurement.sewing_line_efficiency", inputMap: { cycleTotal: "cycleTotal", actualOperators: "operatorCount", taktTime: "taktTime" ,
        actOperators: "actOperators"}, outputId: "lineEfficiency" },
  ],
  reportTemplate: { title: "Sewing Line Balance Report", title_i18n: {"en":"Sewing Line Balance Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Takt = AvailableTime/Demand. ΣSMV = sum of all SMVs.", "LineEff = ΣSMV/(Operators×Takt)×100.", "Balance delay = 100 - LineEff."],assumptionNotes_i18n:[{"en":"Takt = AvailableTime/Demand. ΣSMV = sum of all SMVs."},{"en":"LineEff = ΣSMV/(Operators×Takt)×100."},{"en":"Balance delay = 100 - LineEff."}] },
};
