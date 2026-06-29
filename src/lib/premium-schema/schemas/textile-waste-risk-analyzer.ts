/**
 * Tool #25 — Tekstil Atığı
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const TEXTILE_WASTE_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "textile-waste-risk-analyzer", legacyPaidSlug: "textile-waste-risk-analyzer",
  name: "Tekstil Atığı Risk Analizi", name_i18n: {"en":"Textile Waste Risk Analysis","tr":"Tekstil Atığı Risk Analizi"}, sectorSlug: "textile", category: "cost",
  painStatement: "Tekstil üretiminde kumaş atığı ve fire oranı kontrol edilmezse hammadde maliyeti ve çevresel kayıp artar.", painStatement_i18n: {"en":"If fabric waste and scrap rate are not controlled in textile production, raw material costs and environmental losses increase.","tr":"Tekstil üretiminde kumaş atığı ve fire oranı kontrol edilmezse hammadde maliyeti ve çevresel kayıp artar."},
  inputs: [
    { id: "fabricUsed", label: "Kullanılan Kumaş", label_i18n: {"en":"Fabric Used","tr":"Kullanılan Kumaş"}, type: "number", unit: "m²/parti", required: true, smartDefault: 5000, validation: { min: 1 }, helper: "", expertMeaning: "Total fabric used per batch", expertMeaning_i18n: {"en":"Total fabric used per batch","tr":"Parti başına toplam kullanılan kumaş"} },
    { id: "fabricWaste", label: "Kumaş Atığı", label_i18n: {"en":"Fabric Waste","tr":"Kumaş Atığı"}, type: "number", unit: "m²/parti", required: true, smartDefault: 750, validation: { min: 0 }, helper: "", expertMeaning: "Fabric waste per batch", expertMeaning_i18n: {"en":"Fabric waste per batch","tr":"Parti başına kumaş atığı"} },
    { id: "fabricUnitCost", label: "Kumaş Birim Maliyeti", label_i18n: {"en":"Fabric Unit Cost","tr":"Kumaş Birim Maliyeti"}, type: "number", unit: "USD/m²", required: true, smartDefault: 8, validation: { min: 0.01 }, helper: "", expertMeaning: "Fabric cost per sqm", expertMeaning_i18n: {"en":"Fabric cost per sqm","tr":"Metrekare başına kumaş maliyeti"} },
    { id: "annualBatches", label: "Yıllık Parti Sayısı", label_i18n: {"en":"Annual Batch Count","tr":"Yıllık Parti Sayısı"}, type: "number", unit: "parti/yıl", required: true, smartDefault: 100, validation: { min: 1 }, helper: "", expertMeaning: "Annual batch count", expertMeaning_i18n: {"en":"Annual batch count","tr":"Yıllık parti sayısı"} },
    { id: "recycleRevenue", label: "Geri Dönüşüm Geliri", label_i18n: {"en":"Recycling Revenue","tr":"Geri Dönüşüm Geliri"}, type: "number", unit: "USD/m²", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Revenue from waste recycling", expertMeaning_i18n: {"en":"Revenue from waste recycling","tr":"Atık geri dönüşümünden elde edilen gelir"} },
    { id: "wasteDisposalCost", label: "Atık Bertaraf Maliyeti", label_i18n: {"en":"Waste Disposal Cost","tr":"Atık Bertaraf Maliyeti"}, type: "number", unit: "USD/m²", required: false, smartDefault: 0.25, validation: { min: 0 }, helper: "", expertMeaning: "Waste disposal cost per sqm", expertMeaning_i18n: {"en":"Waste disposal cost per sqm","tr":"Metrekare başına atık bertaraf maliyeti"} },
  ],
  outputs: [
    { id: "textileWasteRate", label: "Kumaş Atık Oranı", label_i18n: {"en":"Fabric Waste Rate","tr":"Kumaş Atık Oranı"}, unit: "%", format: "percentage" },
    { id: "preConsumerWaste", label: "Tüketim Öncesi Atık Maliyeti", label_i18n: {"en":"Pre-Consumer Waste Cost","tr":"Tüketim Öncesi Atık Maliyeti"}, unit: "USD/yıl", format: "currency" },
    { id: "netWasteCost", label: "Net Atık Maliyeti", label_i18n: {"en":"Net Waste Cost","tr":"Net Atık Maliyeti"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
    { id: "wasteRiskScore", label: "Atık Risk Skoru", label_i18n: {"en":"Waste Risk Score","tr":"Atık Risk Skoru"}, unit: "", format: "score" },
  ],
  thresholds: [{ fieldId: "textileWasteRate", warning: 10, critical: 20, direction: "higher_is_bad", warningMessage: "Atık oranı > %10 — kesim optimizasyonu önerilir.", warningMessage_i18n: {"en":"Waste rate > 10% — cutting optimization recommended.","tr":"Atık oranı > %10 — kesim optimizasyonu önerilir."}, criticalMessage: "Atık oranı > %20 — kalıp ve kesim süreci yenilenmeli.", criticalMessage_i18n: {"en":"Waste rate > 20% — pattern and cutting process should be renewed.","tr":"Atık oranı > %20 — kalıp ve kesim süreci yenilenmeli."} }],
  formulaPipeline: [
    { formulaId: "measurement.textile_waste_rate", inputMap: { fabricWaste: "fabricWaste", fabricUsed: "fabricUsed" }, outputId: "textileWasteRate" },
    { formulaId: "cost.pre_consumer_waste", inputMap: { fabricWaste: "fabricWaste", fabricUnitCost: "fabricUnitCost", annualBatches: "annualBatches" }, outputId: "preConsumerWaste" },
    { formulaId: "cost.net_waste_cost", inputMap: { preConsumerWaste: "preConsumerWaste", recycleRevenue: "recycleRevenue", wasteDisposalCost: "wasteDisposalCost", fabricWaste: "fabricWaste", annualBatches: "annualBatches" }, outputId: "netWasteCost" },
    { formulaId: "measurement.waste_risk_score", inputMap: { textileWasteRate: "textileWasteRate", netWasteCost: "netWasteCost" }, outputId: "wasteRiskScore" },
  ],
  reportTemplate: { title: "Textile Waste Risk Report", title_i18n: {"en":"Textile Waste Risk Report","tr":"Tekstil Atığı Risk Raporu"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 8, targetMarginPercent: 18, assumptionNotes: ["Waste rate = Waste / Used × 100.", "Waste cost = Waste × UnitCost × Batches.", "Net cost adjusts for recycling revenue."],assumptionNotes_i18n:[{"en":"Waste rate = Waste / Used × 100.","tr":"Atık oranı = Atık / Kullanılan × 100."},{"en":"Waste cost = Waste × UnitCost × Batches.","tr":"Atık maliyeti = Atık × BirimMaliyet × Parti."},{"en":"Net cost adjusts for recycling revenue.","tr":"Net maliyet, geri dönüşüm gelirine göre düzeltilir."}] },
};
