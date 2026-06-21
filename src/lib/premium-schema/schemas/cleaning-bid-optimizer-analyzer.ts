/**
 * Tool #26 — Temizlik Teklif
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CLEANING_BID_OPTIMIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "cleaning-bid-optimizer-analyzer", legacyPaidSlug: "cleaning-bid-optimizer-analyzer",
  name: "Temizlik Teklif Optimizasyonu", name_i18n: {"en":"Temizlik Teklif Optimizasyonu","tr":"Temizlik Teklif Optimizasyonu"}, sectorSlug: "financial-planning", category: "cost",
  painStatement: "Temizlik hizmeti tekliflerinde işçilik, malzeme ve kar marjı net ayrıştırılmazsa fiyatlama hatalı olur.", painStatement_i18n: {"en":"Temizlik hizmeti tekliflerinde işçilik, malzeme ve kar marjı net ayrıştırılmazsa fiyatlama hatalı olur.","tr":"Temizlik hizmeti tekliflerinde işçilik, malzeme ve kar marjı net ayrıştırılmazsa fiyatlama hatalı olur."},
  inputs: [
    { id: "totalSquareMeters", label: "Toplam Metrekare", label_i18n: {"en":"Toplam Metrekare","tr":"Toplam Metrekare"}, type: "number", unit: "m²", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Total cleaning area in sqm", expertMeaning_i18n: {"en":"Total cleaning area in sqm","tr":"Total cleaning area in sqm"} },
    { id: "cleaningFrequency", label: "Temizlik Sıklığı", label_i18n: {"en":"Temizlik Sıklığı","tr":"Temizlik Sıklığı"}, type: "select", unit: "", required: true, smartDefault: "weekly", validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Cleaning frequency", expertMeaning_i18n: {"en":"Cleaning frequency","tr":"Cleaning frequency"}, enumValues: ["daily", "weekly", "biweekly", "monthly"] },
    { id: "laborRate", label: "İşçilik Saatlik Ücreti", label_i18n: {"en":"İşçilik Saatlik Ücreti","tr":"İşçilik Saatlik Ücreti"}, type: "number", unit: "USD/saat", required: true, smartDefault: 20, validation: { min: 1 }, helper: "", expertMeaning: "Hourly labor rate", expertMeaning_i18n: {"en":"Hourly labor rate","tr":"Hourly labor rate"} },
    { id: "hoursPerVisit", label: "Ziyaret Başına Saat", label_i18n: {"en":"Ziyaret Başına Saat","tr":"Ziyaret Başına Saat"}, type: "number", unit: "saat", required: true, smartDefault: 4, validation: { min: 0.5 }, helper: "", expertMeaning: "Hours per cleaning visit", expertMeaning_i18n: {"en":"Hours per cleaning visit","tr":"Hours per cleaning visit"} },
    { id: "materialCostPerVisit", label: "Ziyaret Başına Malzeme", label_i18n: {"en":"Ziyaret Başına Malzeme","tr":"Ziyaret Başına Malzeme"}, type: "number", unit: "USD", required: true, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Material cost per cleaning visit", expertMeaning_i18n: {"en":"Material cost per cleaning visit","tr":"Material cost per cleaning visit"} },
    { id: "desiredMargin", label: "Hedef Kar Marjı", label_i18n: {"en":"Hedef Kar Marjı","tr":"Hedef Kar Marjı"}, type: "number", unit: "%", required: false, smartDefault: 25, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Target profit margin", expertMeaning_i18n: {"en":"Target profit margin","tr":"Target profit margin"} },
    { id: "competitorBid", label: "Rakip Teklifi", label_i18n: {"en":"Rakip Teklifi","tr":"Rakip Teklifi"}, type: "number", unit: "USD/ay", required: false, smartDefault: 1200, validation: { min: 0 }, helper: "", expertMeaning: "Competitor monthly bid", expertMeaning_i18n: {"en":"Competitor monthly bid","tr":"Competitor monthly bid"} },
  ],
  outputs: [
    { id: "cleaningLaborCost", label: "İşçilik Maliyeti", label_i18n: {"en":"İşçilik Maliyeti","tr":"İşçilik Maliyeti"}, unit: "USD/ay", format: "currency" },
    { id: "cleaningBidPrice", label: "Önerilen Teklif Fiyatı", label_i18n: {"en":"Önerilen Teklif Fiyatı","tr":"Önerilen Teklif Fiyatı"}, unit: "USD/ay", format: "currency" },
  ],
  thresholds: [{ fieldId: "cleaningBidPrice", warning: 0, critical: 0, direction: "higher_is_bad", warningMessage: "Teklif > rakip — rekabetçilik düşebilir.", warningMessage_i18n: {"en":"Teklif > rakip — rekabetçilik düşebilir.","tr":"Teklif > rakip — rekabetçilik düşebilir."}, criticalMessage: "Teklif maliyetin altında — zarar riski var.", criticalMessage_i18n: {"en":"Teklif maliyetin altında — zarar riski var.","tr":"Teklif maliyetin altında — zarar riski var."} }],
  formulaPipeline: [
    { formulaId: "cost.cleaning_labor_cost", inputMap: { laborRate: "laborRate", hoursPerVisit: "hoursPerVisit", cleaningFrequency: "cleaningFrequency" }, outputId: "cleaningLaborCost" },
    { formulaId: "cost.cleaning_bid_price", inputMap: { cleaningLaborCost: "cleaningLaborCost", materialCostPerVisit: "materialCostPerVisit", desiredMargin: "desiredMargin" }, outputId: "cleaningBidPrice" },
  ],
  reportTemplate: { title: "Cleaning Bid Optimization Report", title_i18n: {"en":"Cleaning Bid Optimization Report","tr":"Cleaning Bid Optimization Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 5, targetMarginPercent: 25, assumptionNotes: ["Labor cost = Rate × Hours × Visits/month.", "Bid price = (Labor + Material) / (1 − Margin%).", "Competitor benchmark adjusts strategy."],assumptionNotes_i18n:[{"en":"Labor cost = Rate × Hours × Visits/month.","tr":"Labor cost = Rate × Hours × Visits/month."},{"en":"Bid price = (Labor + Material) / (1 − Margin%).","tr":"Bid price = (Labor + Material) / (1 − Margin%)."},{"en":"Competitor benchmark adjusts strategy.","tr":"Competitor benchmark adjusts strategy."}] },
};
