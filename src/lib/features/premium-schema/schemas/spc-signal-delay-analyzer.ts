/**
 * Tool — SPC Signal Delay
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SPC_SIGNAL_DELAY_ANALYZER: PremiumCalculatorSchema = {
  id: "spc-signal-delay-analyzer", legacyPaidSlug: "spc-signal-delay-analyzer",
  name: "SPC Sinyal Gecikme Analizi", name_i18n: {"en":"SPC Signal Delay Analysis"}, sectorSlug: "quality", category: "cost",
  painStatement: "Without calculating signal delay (ARL) in SPC control charts, process deviations are detected late and scrap costs compound.", painStatement_i18n: {"en":"Without calculating signal delay (ARL) in SPC control charts, process deviations are detected late and scrap costs compound."},
  inputs: [
    { id: "shiftSize", label: "Shift Amount (Sigma)", label_i18n: {"en":"Shift Amount (Sigma)"}, type: "number", unit: "σ", required: true, smartDefault: 1, validation: { min: 0.1, max: 5 }, helper: "", expertMeaning: "Process shift in sigma units", expertMeaning_i18n: {"en":"Process shift in sigma units"} },
    { id: "controlLimit", label: "Control Limit Coefficient", label_i18n: {"en":"Control Limit Coefficient"}, type: "number", unit: "", required: false, smartDefault: 3, validation: { min: 1, max: 5 }, helper: "", expertMeaning: "Control limit width in sigma", expertMeaning_i18n: {"en":"Control limit width in sigma"} },
    { id: "sampleSize", label: "Subgroup Size", label_i18n: {"en":"Subgroup Size"}, type: "number", unit: "adet", required: false, smartDefault: 5, validation: { min: 1 }, helper: "", expertMeaning: "Subgroup sample size", expertMeaning_i18n: {"en":"Subgroup sample size"} },
    { id: "productionRate", label: "Hourly Production Rate", label_i18n: {"en":"Hourly Production Rate"}, type: "number", unit: "adet/saat", required: true, smartDefault: 100, validation: { min: 1 }, helper: "", expertMeaning: "Units produced per hour", expertMeaning_i18n: {"en":"Units produced per hour"} },
    { id: "costPerDefect", label: "Defective Product Cost", label_i18n: {"en":"Defective Product Cost"}, type: "number", unit: "USD/adet", required: true, smartDefault: 15, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per defective unit", expertMeaning_i18n: {"en":"Cost per defective unit"} },
    { id: "operatingHoursPerYear", label: "Annual Operating Hours", label_i18n: {"en":"Annual Operating Hours"}, type: "number", unit: "saat/yıl", required: false, smartDefault: 4000, validation: { min: 1 }, helper: "", expertMeaning: "Operating hours per year", expertMeaning_i18n: {"en":"Operating hours per year"} },
  ],
  outputs: [
    { id: "arlInControl", label: "ARL In Control", label_i18n: {"en":"ARL In Control"}, unit: "örnek", format: "number" },
    { id: "arlOutOfControl", label: "ARL Out of Control", label_i18n: {"en":"ARL Out of Control"}, unit: "örnek", format: "number" },
    { id: "delayCost", label: "Sinyal Gecikme Maliyeti", label_i18n: {"en":"Signal Delay Cost"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "delayCost", warning: 50000, critical: 100000, direction: "higher_is_bad", warningMessage: "Delay cost >$50K — increase sampling frequency.", warningMessage_i18n: {"en":"Delay cost >$50K — increase sampling frequency."}, criticalMessage: "Delay cost >$100K — renew control chart parameters.", criticalMessage_i18n: {"en":"Delay cost >$100K — renew control chart parameters."} }],
  formulaPipeline: [
    { formulaId: "measurement.spc_arl_in_control", inputMap: { controlLimit: "controlLimit" ,
        alpha: "alpha"}, outputId: "arlInControl" },
    { formulaId: "measurement.spc_arl_out_of_control", inputMap: {
        beta: "shiftSize",
        controlLimit: "controlLimit",
        sampleSize: "sampleSize"
      }, outputId: "arlOutOfControl" },
    { formulaId: "cost.spc_delay_cost", inputMap: { arlOutOfControl: "arlOutOfControl", sampleSize: "sampleSize", productionRate: "productionRate", costPerDefect: "costPerDefect", operatingHoursPerYear: "operatingHoursPerYear" ,
        arlOOC: "arlOOC",
        samplingInterval: "samplingInterval",
        defectRateOOC: "defectRateOOC"}, outputId: "delayCost" },
  ],
  reportTemplate: { title: "SPC Sinyal Gecikme Raporu", title_i18n: {"en":"SPC Signal Delay Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["ARL₀ (in control) = 1/α using Shewhart chart with α = 2×Φ(−CL).", "ARL₁ (out of control) = 1/(1−β), where β depends on shift size.", "Delay cost = ARL₁ × n × h × defect rate × unit defect cost."],assumptionNotes_i18n:[{"en":"ARL₀ (in control) = 1/α using Shewhart chart with α = 2×Φ(−CL)."},{"en":"ARL₁ (out of control) = 1/(1−β), where β depends on shift size."},{"en":"Delay cost = ARL₁ × n × h × defect rate × unit defect cost."}] },
};
