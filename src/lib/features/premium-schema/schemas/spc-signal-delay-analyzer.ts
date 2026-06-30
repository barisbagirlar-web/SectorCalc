/**
 * Tool — SPC Signal Delay
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SPC_SIGNAL_DELAY_ANALYZER: PremiumCalculatorSchema = {
  id: "spc-signal-delay-analyzer", legacyPaidSlug: "spc-signal-delay-analyzer",
  name: "SPC Sinyal Gecikme Analizi", name_i18n: {"en":"SPC Signal Delay Analysis","tr":"SPC Sinyal Gecikme Analizi"}, sectorSlug: "quality", category: "cost",
  painStatement: "SPC kontrol kartlarında sinyal gecikmesi (ARL) hesaplanmazsa süreç sapmaları geç fark edilir ve hurda maliyeti katlanır.", painStatement_i18n: {"en":"Without calculating signal delay (ARL) in SPC control charts, process deviations are detected late and scrap costs compound.","tr":"SPC kontrol kartlarında sinyal gecikmesi (ARL) hesaplanmazsa süreç sapmaları geç fark edilir ve hurda maliyeti katlanır."},
  inputs: [
    { id: "shiftSize", label: "Kayma Miktarı (Sigma)", label_i18n: {"en":"Shift Amount (Sigma)","tr":"Kayma Miktarı (Sigma)"}, type: "number", unit: "σ", required: true, smartDefault: 1, validation: { min: 0.1, max: 5 }, helper: "", expertMeaning: "Process shift in sigma units", expertMeaning_i18n: {"en":"Process shift in sigma units","tr":"Sigma biriminde süreç kayması"} },
    { id: "controlLimit", label: "Kontrol Limiti Katsayısı", label_i18n: {"en":"Control Limit Coefficient","tr":"Kontrol Limiti Katsayısı"}, type: "number", unit: "", required: false, smartDefault: 3, validation: { min: 1, max: 5 }, helper: "", expertMeaning: "Control limit width in sigma", expertMeaning_i18n: {"en":"Control limit width in sigma","tr":"Sigma cinsinden kontrol limiti genişliği"} },
    { id: "sampleSize", label: "Alt Grup Büyüklüğü", label_i18n: {"en":"Subgroup Size","tr":"Alt Grup Büyüklüğü"}, type: "number", unit: "adet", required: false, smartDefault: 5, validation: { min: 1 }, helper: "", expertMeaning: "Subgroup sample size", expertMeaning_i18n: {"en":"Subgroup sample size","tr":"Alt grup örneklem büyüklüğü"} },
    { id: "productionRate", label: "Saatlik Üretim Hızı", label_i18n: {"en":"Hourly Production Rate","tr":"Saatlik Üretim Hızı"}, type: "number", unit: "adet/saat", required: true, smartDefault: 100, validation: { min: 1 }, helper: "", expertMeaning: "Units produced per hour", expertMeaning_i18n: {"en":"Units produced per hour","tr":"Saatte üretilen birim"} },
    { id: "costPerDefect", label: "Hatalı Ürün Maliyeti", label_i18n: {"en":"Defective Product Cost","tr":"Hatalı Ürün Maliyeti"}, type: "number", unit: "USD/adet", required: true, smartDefault: 15, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per defective unit", expertMeaning_i18n: {"en":"Cost per defective unit","tr":"Hatalı birim başına maliyet"} },
    { id: "operatingHoursPerYear", label: "Yıllık Çalışma Saati", label_i18n: {"en":"Annual Operating Hours","tr":"Yıllık Çalışma Saati"}, type: "number", unit: "saat/yıl", required: false, smartDefault: 4000, validation: { min: 1 }, helper: "", expertMeaning: "Operating hours per year", expertMeaning_i18n: {"en":"Operating hours per year","tr":"Yıllık çalışma saati"} },
  ],
  outputs: [
    { id: "arlInControl", label: "Kontrol Altında ARL", label_i18n: {"en":"ARL In Control","tr":"Kontrol Altında ARL"}, unit: "örnek", format: "number" },
    { id: "arlOutOfControl", label: "Kontrol Dışı ARL", label_i18n: {"en":"ARL Out of Control","tr":"Kontrol Dışı ARL"}, unit: "örnek", format: "number" },
    { id: "delayCost", label: "Sinyal Gecikme Maliyeti", label_i18n: {"en":"Signal Delay Cost","tr":"Sinyal Gecikme Maliyeti"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "delayCost", warning: 50000, critical: 100000, direction: "higher_is_bad", warningMessage: "Gecikme maliyeti >$50K — örnekleme sıklığı artırılmalı.", warningMessage_i18n: {"en":"Delay cost >$50K — increase sampling frequency.","tr":"Gecikme maliyeti >$50K — örnekleme sıklığı artırılmalı."}, criticalMessage: "Gecikme maliyeti >$100K — kontrol kartı parametreleri yenilenmeli.", criticalMessage_i18n: {"en":"Delay cost >$100K — renew control chart parameters.","tr":"Gecikme maliyeti >$100K — kontrol kartı parametreleri yenilenmeli."} }],
  formulaPipeline: [
    { formulaId: "measurement.spc_arl_in_control", inputMap: { controlLimit: "controlLimit" }, outputId: "arlInControl" },
    { formulaId: "measurement.spc_arl_out_of_control", inputMap: {
        beta: "shiftSize",
        controlLimit: "controlLimit",
        sampleSize: "sampleSize"
      }, outputId: "arlOutOfControl" },
    { formulaId: "cost.spc_delay_cost", inputMap: { arlOutOfControl: "arlOutOfControl", sampleSize: "sampleSize", productionRate: "productionRate", costPerDefect: "costPerDefect", operatingHoursPerYear: "operatingHoursPerYear" }, outputId: "delayCost" },
  ],
  reportTemplate: { title: "SPC Sinyal Gecikme Raporu", title_i18n: {"en":"SPC Signal Delay Report","tr":"SPC Sinyal Gecikme Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["ARL₀ (kontrol altında) = 1/α, α = 2×Φ(−CL) kullanan Shewhart kartı.", "ARL₁ (kontrol dışı) = 1/(1−β), β kayma miktarına göre hesaplanır.", "Gecikme maliyeti = ARL₁ × n × h × hata oranı × birim hata maliyeti."],assumptionNotes_i18n:[{"en":"ARL₀ (in control) = 1/α using Shewhart chart with α = 2×Φ(−CL).","tr":"ARL₀ (kontrol altında) = 1/α, α = 2×Φ(−CL) kullanan Shewhart kartı."},{"en":"ARL₁ (out of control) = 1/(1−β), where β depends on shift size.","tr":"ARL₁ (kontrol dışı) = 1/(1−β), β kayma miktarına göre hesaplanır."},{"en":"Delay cost = ARL₁ × n × h × defect rate × unit defect cost.","tr":"Gecikme maliyeti = ARL₁ × n × h × hata oranı × birim hata maliyeti."}] },
};
