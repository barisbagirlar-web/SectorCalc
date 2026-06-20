/**
 * Tool — Sözleşme Teşvik
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CONTRACT_INCENTIVE_ANALYZER: PremiumCalculatorSchema = {
  id: "contract-incentive-analyzer", legacyPaidSlug: "contract-incentive-analyzer",
  name: "Sözleşme Teşvik Analizi", sectorSlug: "construction", category: "cost",
  painStatement: "İnşaat sözleşmelerinde teşvik mekanizmaları doğru yapılandırılmazsa yüklenici ve işveren arasında maliyet sapmaları ve anlaşmazlıklar kaçınılmaz olur.",
  inputs: [
    { id: "targetCost", label: "Hedef Maliyet", type: "number", unit: "USD", required: true, smartDefault: 5000000, validation: { min: 1 }, helper: "", expertMeaning: "Target cost for the project" },
    { id: "actualCost", label: "Gerçekleşen Maliyet", type: "number", unit: "USD", required: true, smartDefault: 4800000, validation: { min: 1 }, helper: "", expertMeaning: "Actual cost incurred" },
    { id: "targetFee", label: "Hedef Ücret", type: "number", unit: "USD", required: true, smartDefault: 500000, validation: { min: 1 }, helper: "", expertMeaning: "Target fee amount" },
    { id: "shareRatio", label: "Pay Oranı (Yüklenici)", type: "number", unit: "%", required: true, smartDefault: 50, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Contractor share of savings/overrun" },
    { id: "minFee", label: "Minimum Ücret", type: "number", unit: "USD", required: false, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Minimum guaranteed fee" },
    { id: "maxFee", label: "Maksimum Ücret", type: "number", unit: "USD", required: false, smartDefault: 800000, validation: { min: 0 }, helper: "", expertMeaning: "Maximum fee cap" },
  ],
  outputs: [
    { id: "incentiveTargetFee", label: "Hedef Teşvik Ücreti", unit: "USD", format: "currency" },
    { id: "incentiveActualFee", label: "Gerçekleşen Teşvik Ücreti", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "incentiveActualFee", warning: 600000, critical: 300000, direction: "lower_is_bad", warningMessage: "Teşvik ücreti <$600K — yüklenici motivasyonu düşebilir.", criticalMessage: "Teşvik ücreti <$300K — sözleşme yapısı gözden geçirilmeli." }],
  formulaPipeline: [
    { formulaId: "cost.incentive_target_fee", inputMap: { targetFee: "targetFee", targetCost: "targetCost" }, outputId: "incentiveTargetFee" },
    { formulaId: "cost.incentive_actual_fee", inputMap: { targetCost: "targetCost", actualCost: "actualCost", targetFee: "targetFee", shareRatio: "shareRatio", minFee: "minFee", maxFee: "maxFee" }, outputId: "incentiveActualFee" },
  ],
  reportTemplate: { title: "Sözleşme Teşvik Analiz Raporu", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Fiili ücret = hedef ücret + (hedef − fiili) × yüklenici payı.", "Min ve max ücret sınırlamaları uygulanır.", "Sözleşme FPIF (Fixed Price Incentive Fee) modelidir."] },
};
