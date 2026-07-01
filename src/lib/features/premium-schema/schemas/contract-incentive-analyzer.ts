/**
 * Tool — Sözleşme Teşvik
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const CONTRACT_INCENTIVE_ANALYZER: PremiumCalculatorSchema = {
  id: "contract-incentive-analyzer", legacyPaidSlug: "contract-incentive-analyzer",
  name: "Contract Incentive Analysis", name_i18n: {"en":"Contract Incentive Analysis"}, sectorSlug: "construction", category: "cost",
  painStatement: "If incentive mechanisms in construction contracts are not configured correctly, cost variance and disputes between contractor and employer become inevitable.", painStatement_i18n: {"en":"If incentive mechanisms in construction contracts are not configured correctly, cost variance and disputes between contractor and employer become inevitable."},
  inputs: [
    { id: "targetCost", label: "Hedef Maliyet", label_i18n: {"en":"Target Cost"}, type: "number", unit: "USD", required: true, smartDefault: 5000000, validation: { min: 1 }, helper: "", expertMeaning: "Target cost for the project", expertMeaning_i18n: {"en":"Target cost for the project"} },
    { id: "actualCost", label: "Actual Cost", label_i18n: {"en":"Actual Cost"}, type: "number", unit: "USD", required: true, smartDefault: 4800000, validation: { min: 1 }, helper: "", expertMeaning: "Actual cost incurred", expertMeaning_i18n: {"en":"Actual cost incurred"} },
    { id: "targetFee", label: "Hedef Ücret", label_i18n: {"en":"Target Fee"}, type: "number", unit: "USD", required: true, smartDefault: 500000, validation: { min: 1 }, helper: "", expertMeaning: "Target fee amount", expertMeaning_i18n: {"en":"Target fee amount"} },
    { id: "shareRatio", label: "Share Ratio (Contractor)", label_i18n: {"en":"Share Ratio (Contractor)"}, type: "number", unit: "%", required: true, smartDefault: 50, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Contractor share of savings/overrun", expertMeaning_i18n: {"en":"Contractor share of savings/overrun"} },
    { id: "minFee", label: "Minimum Ücret", label_i18n: {"en":"Minimum Fee"}, type: "number", unit: "USD", required: false, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Minimum guaranteed fee", expertMeaning_i18n: {"en":"Minimum guaranteed fee"} },
    { id: "maxFee", label: "Maksimum Ücret", label_i18n: {"en":"Maximum Fee"}, type: "number", unit: "USD", required: false, smartDefault: 800000, validation: { min: 0 }, helper: "", expertMeaning: "Maximum fee cap", expertMeaning_i18n: {"en":"Maximum fee cap"} },
  ],
  outputs: [
    { id: "incentiveTargetFee", label: "Hedef Tesvik Ucreti", label_i18n: {"en":"Hedef Tesvik Rate"}, unit: "USD", format: "currency" },
    { id: "incentiveActualFee", label: "Gerceklesen Tesvik Ucreti", label_i18n: {"en":"Gerceklesen Tesvik Rate"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "incentiveActualFee", warning: 600000, critical: 300000, direction: "lower_is_bad", warningMessage: "Incentive fee <$600K — contractor motivation may decrease.", warningMessage_i18n: {"en":"Incentive fee <$600K — contractor motivation may decrease."}, criticalMessage: "Incentive fee <$300K — review contract structure.", criticalMessage_i18n: {"en":"Incentive fee <$300K — review contract structure."} }],
  formulaPipeline: [
    { formulaId: "cost.incentive_target_fee", inputMap: {
        targetCost: "targetCost",
        targetFeePct: "targetFee"
      }, outputId: "incentiveTargetFee" },
    { formulaId: "cost.incentive_actual_fee", inputMap: {
        targetFee: "targetFee",
        targetCost: "targetCost",
        actualCost: "actualCost",
        minFee: "minFee",
        maxFee: "maxFee",
        contractorSharePct: "shareRatio"
      }, outputId: "incentiveActualFee" },
  ],
  reportTemplate: { title: "Contract Incentive Analysis Report", title_i18n: {"en":"Contract Incentive Analysis Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Actual fee = target fee + (target − actual) × contractor share.", "Min and max fee limits apply.", "Contract is FPIF (Fixed Price Incentive Fee) model."],assumptionNotes_i18n:[{"en":"Actual fee = target fee + (target − actual) × contractor share."},{"en":"Min and max fee limits apply."},{"en":"Contract is FPIF (Fixed Price Incentive Fee) model."}]},
};
