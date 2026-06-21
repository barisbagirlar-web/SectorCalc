/**
 * Tool — Sözleşme Teşvik
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CONTRACT_INCENTIVE_ANALYZER: PremiumCalculatorSchema = {
  id: "contract-incentive-analyzer", legacyPaidSlug: "contract-incentive-analyzer",
  name: "Sözleşme Teşvik Analizi", name_i18n: {"en":"Sözleşme Teşvik Analizi","tr":"Sözleşme Teşvik Analizi"}, sectorSlug: "construction", category: "cost",
  painStatement: "İnşaat sözleşmelerinde teşvik mekanizmaları doğru yapılandırılmazsa yüklenici ve işveren arasında maliyet sapmaları ve anlaşmazlıklar kaçınılmaz olur.", painStatement_i18n: {"en":"İnşaat sözleşmelerinde teşvik mekanizmaları doğru yapılandırılmazsa yüklenici ve işveren arasında maliyet sapmaları ve anlaşmazlıklar kaçınılmaz olur.","tr":"İnşaat sözleşmelerinde teşvik mekanizmaları doğru yapılandırılmazsa yüklenici ve işveren arasında maliyet sapmaları ve anlaşmazlıklar kaçınılmaz olur."},
  inputs: [
    { id: "targetCost", label: "Hedef Maliyet", label_i18n: {"en":"Hedef Maliyet","tr":"Hedef Maliyet"}, type: "number", unit: "USD", required: true, smartDefault: 5000000, validation: { min: 1 }, helper: "", expertMeaning: "Target cost for the project", expertMeaning_i18n: {"en":"Target cost for the project","tr":"Target cost for the project"} },
    { id: "actualCost", label: "Gerçekleşen Maliyet", label_i18n: {"en":"Gerçekleşen Maliyet","tr":"Gerçekleşen Maliyet"}, type: "number", unit: "USD", required: true, smartDefault: 4800000, validation: { min: 1 }, helper: "", expertMeaning: "Actual cost incurred", expertMeaning_i18n: {"en":"Actual cost incurred","tr":"Actual cost incurred"} },
    { id: "targetFee", label: "Hedef Ücret", label_i18n: {"en":"Hedef Ücret","tr":"Hedef Ücret"}, type: "number", unit: "USD", required: true, smartDefault: 500000, validation: { min: 1 }, helper: "", expertMeaning: "Target fee amount", expertMeaning_i18n: {"en":"Target fee amount","tr":"Target fee amount"} },
    { id: "shareRatio", label: "Pay Oranı (Yüklenici)", label_i18n: {"en":"Pay Oranı (Yüklenici)","tr":"Pay Oranı (Yüklenici)"}, type: "number", unit: "%", required: true, smartDefault: 50, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Contractor share of savings/overrun", expertMeaning_i18n: {"en":"Contractor share of savings/overrun","tr":"Contractor share of savings/overrun"} },
    { id: "minFee", label: "Minimum Ücret", label_i18n: {"en":"Minimum Ücret","tr":"Minimum Ücret"}, type: "number", unit: "USD", required: false, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Minimum guaranteed fee", expertMeaning_i18n: {"en":"Minimum guaranteed fee","tr":"Minimum guaranteed fee"} },
    { id: "maxFee", label: "Maksimum Ücret", label_i18n: {"en":"Maksimum Ücret","tr":"Maksimum Ücret"}, type: "number", unit: "USD", required: false, smartDefault: 800000, validation: { min: 0 }, helper: "", expertMeaning: "Maximum fee cap", expertMeaning_i18n: {"en":"Maximum fee cap","tr":"Maximum fee cap"} },
  ],
  outputs: [
    { id: "incentiveTargetFee", label: "Hedef Teşvik Ücreti", label_i18n: {"en":"Hedef Teşvik Ücreti","tr":"Hedef Teşvik Ücreti"}, unit: "USD", format: "currency" },
    { id: "incentiveActualFee", label: "Gerçekleşen Teşvik Ücreti", label_i18n: {"en":"Gerçekleşen Teşvik Ücreti","tr":"Gerçekleşen Teşvik Ücreti"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "incentiveActualFee", warning: 600000, critical: 300000, direction: "lower_is_bad", warningMessage: "Teşvik ücreti <$600K — yüklenici motivasyonu düşebilir.", warningMessage_i18n: {"en":"Teşvik ücreti <$600K — yüklenici motivasyonu düşebilir.","tr":"Teşvik ücreti <$600K — yüklenici motivasyonu düşebilir."}, criticalMessage: "Teşvik ücreti <$300K — sözleşme yapısı gözden geçirilmeli.", criticalMessage_i18n: {"en":"Teşvik ücreti <$300K — sözleşme yapısı gözden geçirilmeli.","tr":"Teşvik ücreti <$300K — sözleşme yapısı gözden geçirilmeli."} }],
  formulaPipeline: [
    { formulaId: "cost.incentive_target_fee", inputMap: { targetFee: "targetFee", targetCost: "targetCost" }, outputId: "incentiveTargetFee" },
    { formulaId: "cost.incentive_actual_fee", inputMap: { targetCost: "targetCost", actualCost: "actualCost", targetFee: "targetFee", shareRatio: "shareRatio", minFee: "minFee", maxFee: "maxFee" }, outputId: "incentiveActualFee" },
  ],
  reportTemplate: { title: "Sözleşme Teşvik Analiz Raporu", title_i18n: {"en":"Sözleşme Teşvik Analiz Raporu","tr":"Sözleşme Teşvik Analiz Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Fiili ücret = hedef ücret + (hedef − fiili) × yüklenici payı.", "Min ve max ücret sınırlamaları uygulanır.", "Sözleşme FPIF (Fixed Price Incentive Fee) modelidir."],assumptionNotes_i18n:[{"en":"Fiili ücret = hedef ücret + (hedef − fiili) × yüklenici payı.","tr":"Fiili ücret = hedef ücret + (hedef − fiili) × yüklenici payı."},{"en":"Min ve max ücret sınırlamaları uygulanır.","tr":"Min ve max ücret sınırlamaları uygulanır."},{"en":"Sözleşme FPIF (Fixed Price Incentive Fee) modelidir.","tr":"Sözleşme FPIF (Fixed Price Incentive Fee) modelidir."}] },
};
