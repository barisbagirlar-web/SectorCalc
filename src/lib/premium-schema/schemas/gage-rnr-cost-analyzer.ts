/**
 * Tool #44 — Gage R&R Maliyet
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const GAGE_RNR_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "gage-rnr-cost-analyzer", legacyPaidSlug: "gage-rnr-cost-analyzer",
  name: "Gage R&R & Ölçüm Hata Maliyet Analizi", name_i18n: {"en":"Gage R&R & Measurement Error Cost Analysis","tr":"Gage R&R & Ölçüm Hata Maliyet Analizi"}, sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "Ölçüm sistemi R&R değeri yüksekse yanlış kabul/red kararları ciddi maliyet kayıplarına yol açar.", painStatement_i18n: {"en":"If the measurement system R&R value is high, incorrect accept/reject decisions can lead to significant cost losses.","tr":"Ölçüm sistemi R&R değeri yüksekse yanlış kabul/red kararları ciddi maliyet kayıplarına yol açar."},
  inputs: [
    { id: "ev", label: "EV (Ekipman Varyansı)", label_i18n: {"en":"Equipment variation","tr":"EV (Ekipman Varyansı)"}, type: "number", unit: "", required: true, smartDefault: 0.005, validation: { min: 0 }, helper: "", expertMeaning: "Equipment variation", expertMeaning_i18n: {"en":"Equipment variation","tr":"EV (Ekipman Varyansı)"} },
    { id: "av", label: "AV (Operatör Varyansı)", label_i18n: {"en":"Appraiser variation","tr":"AV (Operatör Varyansı)"}, type: "number", unit: "", required: true, smartDefault: 0.004, validation: { min: 0 }, helper: "", expertMeaning: "Appraiser variation", expertMeaning_i18n: {"en":"Appraiser variation","tr":"AV (Operatör Varyansı)"} },
    { id: "tv", label: "TV (Toplam Varyans)", label_i18n: {"en":"Total variation","tr":"TV (Toplam Varyans)"}, type: "number", unit: "", required: true, smartDefault: 0.015, validation: { min: 0.001 }, helper: "", expertMeaning: "Total variation", expertMeaning_i18n: {"en":"Total variation","tr":"TV (Toplam Varyans)"} },
    { id: "falseAccept", label: "Yanlış Kabul (Hatalı parça)", label_i18n: {"en":"False acceptance count","tr":"Yanlış Kabul (Hatalı parça)"}, type: "number", unit: "adet/yıl", required: false, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "False acceptance count", expertMeaning_i18n: {"en":"False acceptance count","tr":"Yanlış Kabul (Hatalı parça)"} },
    { id: "escapeCost", label: "Sızma Maliyeti/Adet", label_i18n: {"en":"Cost per escaped defect","tr":"Sızma Maliyeti/Adet"}, type: "number", unit: "USD", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Cost per escaped defect", expertMeaning_i18n: {"en":"Cost per escaped defect","tr":"Sızma Maliyeti/Adet"} },
    { id: "falseReject", label: "Yanlış Red (İyi parça)", label_i18n: {"en":"False rejection count","tr":"Yanlış Red (İyi parça)"}, type: "number", unit: "adet/yıl", required: false, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "False rejection count", expertMeaning_i18n: {"en":"False rejection count","tr":"Yanlış Red (İyi parça)"} },
    { id: "scrapCost", label: "Hurda Maliyeti/Adet", label_i18n: {"en":"Scrap cost per rejected good part","tr":"Hurda Maliyeti/Adet"}, type: "number", unit: "USD", required: false, smartDefault: 25, validation: { min: 0 }, helper: "", expertMeaning: "Scrap cost per rejected good part", expertMeaning_i18n: {"en":"Scrap cost per rejected good part","tr":"Hurda Maliyeti/Adet"} },
  ],
  outputs:  [
    { id: "grr", label: "GRR (Birleşik)", label_i18n: {"en":"GRR (Combined)","tr":"GRR (Birleşik)"}, unit: "", format: "number" },
    { id: "pctGrr", label: "%GRR", label_i18n: {"en":"%GRR","tr":"%GRR"}, unit: "%", format: "percentage" },
    { id: "costError", label: "Ölçüm Hata Maliyeti", label_i18n: {"en":"Measurement Error Cost","tr":"Ölçüm Hata Maliyeti"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "pctGrr", warning: 20, critical: 30, direction: "higher_is_bad", warningMessage: "%GRR > %20 — ölçüm sistemi iyileştirilmeli.", warningMessage_i18n: {"en":"%GRR > 20% — measurement system should be improved.","tr":"%GRR > %20 — ölçüm sistemi iyileştirilmeli."}, criticalMessage: "%GRR > %30 — ölçüm sistemi yetersiz.", criticalMessage_i18n: {"en":"%GRR > 30% — measurement system is inadequate.","tr":"%GRR > %30 — ölçüm sistemi yetersiz."} }],
  formulaPipeline: [
    { formulaId: "measurement.grr_combined", inputMap: { ev: "ev", av: "av" }, outputId: "grr" },
    { formulaId: "measurement.grr_pct", inputMap: { grr: "grr", tv: "tv" }, outputId: "pctGrr" },
    { formulaId: "cost.grr_cost_error", inputMap: { falseAccept: "falseAccept", escapeCost: "escapeCost", falseReject: "falseReject", scrapCost: "scrapCost" }, outputId: "costError" },
  ],
  reportTemplate: { title: "Gage R&R Cost Report", title_i18n: {"en":"Gage R&R Cost Report","tr":"Gage R&R Cost Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["GRR = √(EV²+AV²). %GRR = (GRR/TV)×100.", "If %GRR < 10%: acceptable. 10-30%: marginal. >30%: unacceptable.", "Cost = FalseAcc×EscapeCost + FalseRej×ScrapCost."],assumptionNotes_i18n:[{"en":"GRR = √(EV²+AV²). %GRR = (GRR/TV)×100.","tr":"GRR = √(EV²+AV²). %GRR = (GRR/TV)×100."},{"en":"If %GRR < 10%: acceptable. 10-30%: marginal. >30%: unacceptable.","tr":"If %GRR < 10%: acceptable. 10-30%: marginal. >30%: unacceptable."},{"en":"Cost = FalseAcc×EscapeCost + FalseRej×ScrapCost.","tr":"Cost = FalseAcc×EscapeCost + FalseRej×ScrapCost."}] },
};
