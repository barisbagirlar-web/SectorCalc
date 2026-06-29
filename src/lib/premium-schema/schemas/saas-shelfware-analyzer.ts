/**
 * Tool — SaaS Shelfware
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const SAAS_SHELFWARE_ANALYZER: PremiumCalculatorSchema = {
  id: "saas-shelfware-analyzer", legacyPaidSlug: "saas-shelfware-analyzer",
  name: "SaaS Shelfware Analizi", name_i18n: {"en":"SaaS Shelfware Analysis","tr":"SaaS Shelfware Analizi"}, sectorSlug: "financial-planning", category: "cost",
  painStatement: "Kullanılmayan veya eksik kullanılan SaaS lisansları bütçede görünmeyen büyük bir kayıp oluşturur ve şirketler yıllık lisans maliyetinin %30'una kadarını boşa harcar.", painStatement_i18n: {"en":"Unused or underused SaaS licenses create a large hidden loss in the budget, with companies wasting up to 30% of annual license costs.","tr":"Kullanılmayan veya eksik kullanılan SaaS lisansları bütçede görünmeyen büyük bir kayıp oluşturur ve şirketler yıllık lisans maliyetinin %30'una kadarını boşa harcar."},
  inputs: [
    { id: "totalLicenses", label: "Toplam Lisans Sayısı", label_i18n: {"en":"Toplam Lisans Sayısı","tr":"Toplam Lisans Sayısı"}, type: "number", unit: "adet", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Total active licenses", expertMeaning_i18n: {"en":"Total active licenses","tr":"Total active licenses"} },
    { id: "activeUsers", label: "Aktif Kullanıcı Sayısı", label_i18n: {"en":"Aktif Kullanıcı Sayısı","tr":"Aktif Kullanıcı Sayısı"}, type: "number", unit: "adet", required: true, smartDefault: 320, validation: { min: 0 }, helper: "", expertMeaning: "Monthly active users", expertMeaning_i18n: {"en":"Monthly active users","tr":"Monthly active users"} },
    { id: "licenseCostPerSeat", label: "Koltuk Başına Lisans Maliyeti", label_i18n: {"en":"Koltuk Başına Lisans Maliyeti","tr":"Koltuk Başına Lisans Maliyeti"}, type: "number", unit: "USD/ay", required: true, smartDefault: 25, validation: { min: 0.01 }, helper: "", expertMeaning: "Monthly cost per license", expertMeaning_i18n: {"en":"Monthly cost per license","tr":"Monthly cost per license"} },
    { id: "lowUsageThreshold", label: "Düşük Kullanım Eşiği", label_i18n: {"en":"Düşük Kullanım Eşiği","tr":"Düşük Kullanım Eşiği"}, type: "number", unit: "saat/ay", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Hours per month threshold for low usage", expertMeaning_i18n: {"en":"Hours per month threshold for low usage","tr":"Hours per month threshold for low usage"} },
    { id: "annualBudget", label: "Yıllık SaaS Bütçesi", label_i18n: {"en":"Yıllık SaaS Bütçesi","tr":"Yıllık SaaS Bütçesi"}, type: "number", unit: "USD/yıl", required: false, smartDefault: 150000, validation: { min: 1 }, helper: "", expertMeaning: "Total annual SaaS spend", expertMeaning_i18n: {"en":"Total annual SaaS spend","tr":"Total annual SaaS spend"} },
  ],
  outputs: [
    { id: "shelfwarePct", label: "Shelfware Oranı", label_i18n: {"en":"Shelfware Rate","tr":"Shelfware Oranı"}, unit: "%", format: "percentage" },
    { id: "shelfwareCost", label: "Shelfware Maliyeti", label_i18n: {"en":"Shelfware Maliyeti","tr":"Shelfware Maliyeti"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "shelfwarePct", warning: 20, critical: 40, direction: "higher_is_bad", warningMessage: "Shelfware oranı >%20 — lisans optimizasyonu önerilir.", warningMessage_i18n: {"en":"Shelfware rate > 20% — license optimization recommended.","tr":"Shelfware oranı >%20 — lisans optimizasyonu önerilir."}, criticalMessage: "Shelfware oranı >%40 — acil lisans denetimi ve iptal gerekli.", criticalMessage_i18n: {"en":"Shelfware rate > 40% — urgent license audit and cancellation needed.","tr":"Shelfware oranı >%40 — acil lisans denetimi ve iptal gerekli."} }],
  formulaPipeline: [
    { formulaId: "measurement.saas_shelfware_pct", inputMap: { totalLicenses: "totalLicenses", activeUsers: "activeUsers" }, outputId: "shelfwarePct" },
    { formulaId: "cost.saas_shelfware_cost", inputMap: { totalLicenses: "totalLicenses", activeUsers: "activeUsers", licenseCostPerSeat: "licenseCostPerSeat" }, outputId: "shelfwareCost" },
  ],
  reportTemplate: { title: "SaaS Shelfware Raporu", title_i18n: {"en":"SaaS Shelfware Report","tr":"SaaS Shelfware Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Shelfware % = (lisans − aktif) / lisans × 100.", "Maliyet = (lisans − aktif) × koltuk maliyeti × 12.", "Düşük kullanım eşiği altındaki kullanıcılar shelfware kabul edilir."],assumptionNotes_i18n:[{"en":"Shelfware % = (lisans − aktif) / lisans × 100.","tr":"Shelfware % = (lisans − aktif) / lisans × 100."},{"en":"Maliyet = (lisans − aktif) × koltuk maliyeti × 12.","tr":"Maliyet = (lisans − aktif) × koltuk maliyeti × 12."},{"en":"Users below low usage threshold are considered shelfware.","tr":"Düşük kullanım eşiği altındaki kullanıcılar shelfware kabul edilir."}] },
};
