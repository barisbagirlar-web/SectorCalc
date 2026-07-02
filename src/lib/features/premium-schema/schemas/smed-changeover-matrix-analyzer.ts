
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SMED_CHANGEOVER_SCHEMA: PremiumCalculatorSchema = {
  id: "smed-changeover-matrix-analyzer", legacyPaidSlug: "smed-changeover-matrix-analyzer",
  name: "SMED Changeover Matrix & EBQ Analyzer", name_i18n: {"en":"SMED Changeover Matrix & EBQ Analyzer"}, sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "If mold change times are not optimized with SMED principles, capacity loss reaches large annual figures.", painStatement_i18n: {"en":"If mold change times are not optimized with SMED principles, capacity loss reaches large annual figures."}, inputs: [
    { id: "internalSetup", label: "Internal (machine stopped) setup", label_i18n: {"en":"Internal (machine stopped) setup"}, type: "number", unit: "dak", required: true, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Internal (machine stopped) setup", expertMeaning_i18n: {"en":"Internal (machine stopped) setup"} },
    { id: "externalSetup", label: "External (machine running) setup", label_i18n: {"en":"External (machine running) setup"}, type: "number", unit: "dak", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "External (machine running) setup", expertMeaning_i18n: {"en":"External (machine running) setup"} },
    { id: "conversionRate", label: "Internal to external conversion rate", label_i18n: {"en":"Internal to external conversion rate"}, type: "number", unit: "%", required: false, smartDefault: 50, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Internal to external conversion rate", expertMeaning_i18n: {"en":"Internal to external conversion rate"} },
    { id: "changeoverFreq", label: "Monthly changeover count", label_i18n: {"en":"Monthly changeover count"}, type: "number", unit: "units/month", required: true, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Monthly changeover count", expertMeaning_i18n: {"en":"Monthly changeover count"} },
    { id: "annualDemand", label: "Annual demand", label_i18n: {"en":"Annual demand"}, type: "number", unit: "units", required: false, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Annual demand", expertMeaning_i18n: {"en":"Annual demand"} },
    { id: "setupCost", label: "Setup Cost", label_i18n: {"en":"Setup Cost"}, type: "number", unit: "USD", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Cost per setup", expertMeaning_i18n: {"en":"Cost per setup"} },
    { id: "holdingCost", label: "Holding cost per unit", label_i18n: {"en":"Holding cost per unit"}, type: "number", unit: "USD/unit/year", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Holding cost per unit", expertMeaning_i18n: {"en":"Holding cost per unit"} },
    { id: "machineRate", label: "Machine hourly rate", label_i18n: {"en":"Machine hourly rate"}, type: "number", unit: "USD/hour", required: false, smartDefault: 85, validation: { min: 0 }, helper: "", expertMeaning: "Machine hourly rate", expertMeaning_i18n: {"en":"Machine hourly rate"} },
    { id: "targetSetup", label: "Target setup time after SMED", label_i18n: {"en":"Target setup time after SMED"}, type: "number", unit: "dak", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Target setup time after SMED", expertMeaning_i18n: {"en":"Target setup time after SMED"} },
    { id: "availableTime", label: "Available monthly minutes", label_i18n: {"en":"Available monthly minutes"}, type: "number", unit: "dak", required: false, smartDefault: 19200, validation: { min: 0 }, helper: "", expertMeaning: "Available monthly minutes", expertMeaning_i18n: {"en":"Available monthly minutes"} },
  ],
  outputs: [
    { id: "totalSetup", label: "Total Setup Duration", label_i18n: {"en":"Total Setup Duration"}, unit: "dak", format: "number" },
    { id: "ebq", label: "EBQ (economical Parti)", label_i18n: {"en":"EBQ (economical Parti)"}, unit: "units", format: "number" },
    { id: "annualSavings", label: "Annual Tasarruf", label_i18n: {"en":"Annual Tasarruf"}, unit: "USD/year", format: "currency" },
    { id: "capacityGain", label: "Capacity Kazanm", label_i18n: {"en":"Capacity Kazanm"}, unit: "%", format: "percentage", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "annualSavings", warning: 10000, critical: 50000, direction: "higher_is_bad", warningMessage: "Savings > $10K - SMED project should be initiated.", warningMessage_i18n: {"en":"Savings > $10K - SMED project should be initiated."}, criticalMessage: "Savings > $50K - urgent SMED implementation required.", criticalMessage_i18n: {"en":"Savings > $50K - urgent SMED implementation required."} }],
  formulaPipeline: [
    { formulaId: "measurement.smed_target_time", inputMap: { internalSetup: "internalSetup", conversionRate: "conversionRate", externalSetup: "externalSetup" }, outputId: "measurement_smed_target_time_out" },
    { formulaId: "measurement.smed_setup_total", inputMap: { internalSetup: "internalSetup", externalSetup: "externalSetup" }, outputId: "totalSetup" },
    { formulaId: "measurement.smed_ebq", inputMap: { annualDemand: "annualDemand", setupCost: "setupCost", holdingCost: "holdingCost" ,
        demand: "demand"}, outputId: "ebq" },
    { formulaId: "cost.smed_annual_savings", inputMap: { totalSetup: "totalSetup", targetSetup: "targetSetup", changeoverFreq: "changeoverFreq", machineRate: "machineRate" ,
        targetTime: "targetTime"}, outputId: "annualSavings" },
    { formulaId: "measurement.smed_capacity_gain", inputMap: { totalSetup: "totalSetup", targetSetup: "targetSetup", changeoverFreq: "changeoverFreq", availableTime: "availableTime" ,
        targetTime: "targetTime"}, outputId: "capacityGain" },
  ],
  reportTemplate: { title: "SMED Changeover Matrix Report", title_i18n: {"en":"SMED Changeover Matrix Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Total = Internal + External. EBQ = √(2×Demand×Setup/Holding).", "Annual savings = (T_total-T_target)×Freq×Rate×12/60."],assumptionNotes_i18n:[{"en":"Total = Internal + External. EBQ = √(2×Demand×Setup/Holding)."},{"en":"Annual savings = (T_total-T_target)×Freq×Rate×12/60."}] },
};
