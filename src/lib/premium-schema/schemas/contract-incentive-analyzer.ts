/**
 * Tool — Sözleşme Teşvik
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CONTRACT_INCENTIVE_ANALYZER: PremiumCalculatorSchema = {
  id: "contract-incentive-analyzer", legacyPaidSlug: "contract-incentive-analyzer",
  name: "Sözleşme Teşvik Analizi", name_i18n: {"en":"Contract Incentive Analysis","tr":"Sözleşme Teşvik Analizi"}, sectorSlug: "construction", category: "cost",
  painStatement: "İnşaat sözleşmelerinde teşvik mekanizmaları doğru yapılandırılmazsa yüklenici ve işveren arasında maliyet sapmaları ve anlaşmazlıklar kaçınılmaz olur.", painStatement_i18n: {"en":"If incentive mechanisms in construction contracts are not configured correctly, cost variance and disputes between contractor and employer become inevitable.","tr":"İnşaat sözleşmelerinde teşvik mekanizmaları doğru yapılandırılmazsa yüklenici ve işveren arasında maliyet sapmaları ve anlaşmazlıklar kaçınılmaz olur."},
  inputs: [
    { id: "targetCost", label: "Hedef Maliyet", label_i18n: {"en":"Target Cost","tr":"Hedef Maliyet"}, type: "number", unit: "USD", required: true, smartDefault: 5000000, validation: { min: 1 }, helper: "", expertMeaning: "Target cost for the project", expertMeaning_i18n: {"en":"Target cost for the project","tr":"Proje hedef maliyeti"} },
    { id: "actualCost", label: "Gerçekleşen Maliyet", label_i18n: {"en":"Actual Cost","tr":"Gerçekleşen Maliyet"}, type: "number", unit: "USD", required: true, smartDefault: 4800000, validation: { min: 1 }, helper: "", expertMeaning: "Actual cost incurred", expertMeaning_i18n: {"en":"Actual cost incurred","tr":"Gerçekleşen maliyet"} },
    { id: "targetFee", label: "Hedef Ücret", label_i18n: {"en":"Target Fee","tr":"Hedef Ücret"}, type: "number", unit: "USD", required: true, smartDefault: 500000, validation: { min: 1 }, helper: "", expertMeaning: "Target fee amount", expertMeaning_i18n: {"en":"Target fee amount","tr":"Hedef ücret tutarı"} },
    { id: "shareRatio", label: "Pay Oranı (Yüklenici)", label_i18n: {"en":"Share Ratio (Contractor)","tr":"Pay Oranı (Yüklenici)"}, type: "number", unit: "%", required: true, smartDefault: 50, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Contractor share of savings/overrun", expertMeaning_i18n: {"en":"Contractor share of savings/overrun","tr":"Yüklenici tasarruf/aşım payı"} },
    { id: "minFee", label: "Minimum Ücret", label_i18n: {"en":"Minimum Fee","tr":"Minimum Ücret"}, type: "number", unit: "USD", required: false, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Minimum guaranteed fee", expertMeaning_i18n: {"en":"Minimum guaranteed fee","tr":"Minimum garanti ücret"} },
    { id: "maxFee", label: "Maksimum Ücret", label_i18n: {"en":"Maximum Fee","tr":"Maksimum Ücret"}, type: "number", unit: "USD", required: false, smartDefault: 800000, validation: { min: 0 }, helper: "", expertMeaning: "Maximum fee cap", expertMeaning_i18n: {"en":"Maximum fee cap","tr":"Maksimum ücret tavanı"} },
  ],
  outputs: [
    { id: "incentiveTargetFee", label: "Hedef Teşvik Ücreti", label_i18n: {"en":"Hedef Teşvik Ücreti","tr":"Hedef Teşvik Ücreti"}, unit: "USD", format: "currency" },
    { id: "incentiveActualFee", label: "Gerçekleşen Teşvik Ücreti", label_i18n: {"en":"Gerçekleşen Teşvik Ücreti","tr":"Gerçekleşen Teşvik Ücreti"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "incentiveActualFee", warning: 600000, critical: 300000, direction: "lower_is_bad", warningMessage: "Teşvik ücreti <$600K — yüklenici motivasyonu düşebilir.", warningMessage_i18n: {"en":"Incentive fee <$600K — contractor motivation may decrease.","tr":"Teşvik ücreti <$600K — yüklenici motivasyonu düşebilir."}, criticalMessage: "Teşvik ücreti <$300K — sözleşme yapısı gözden geçirilmeli.", criticalMessage_i18n: {"en":"Incentive fee <$300K — review contract structure.","tr":"Teşvik ücreti <$300K — sözleşme yapısı gözden geçirilmeli."} }],
  formulaPipeline: [
    { formulaId: "cost.incentive_target_fee", inputMap: { targetFee: "targetFee", targetCost: "targetCost" }, outputId: "incentiveTargetFee" },
    { formulaId: "cost.incentive_actual_fee", inputMap: { targetCost: "targetCost", actualCost: "actualCost", targetFee: "targetFee", shareRatio: "shareRatio", minFee: "minFee", maxFee: "maxFee" }, outputId: "incentiveActualFee" },
  ],
  reportTemplate: { title: "Sözleşme Teşvik Analiz Raporu", title_i18n: {"en":"Contract Incentive Analysis Report","tr":"Sözleşme Teşvik Analiz Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Fiili ücret = hedef ücret + (hedef − fiili) × yüklenici payı.", "Min ve max ücret sınırlamaları uygulanır.", "Sözleşme FPIF (Fixed Price Incentive Fee) modelidir."],assumptionNotes_i18n:[{"en":"Actual fee = target fee + (target − actual) × contractor share.","tr":"Fiili ücret = hedef ücret + (hedef − fiili) × yüklenici payı."},{"en":"Min and max fee limits apply.","tr":"Min ve max ücret sınırlamaları uygulanır."},{"en":"Contract is FPIF (Fixed Price Incentive Fee) model.","tr":"Sözleşme FPIF (Fixed Price Incentive Fee) modelidir."}]},
};
