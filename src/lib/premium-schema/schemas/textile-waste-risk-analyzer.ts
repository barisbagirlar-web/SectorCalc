/**
 * Tool #25 — Tekstil Atığı
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const TEXTILE_WASTE_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "textile-waste-risk-analyzer", legacyPaidSlug: "textile-waste-risk-analyzer",
  name: "Tekstil Atığı Risk Analizi", sectorSlug: "textile", category: "cost",
  painStatement: "Tekstil üretiminde kumaş atığı ve fire oranı kontrol edilmezse hammadde maliyeti ve çevresel kayıp artar.",
  inputs: [
    { id: "fabricUsed", label: "Kullanılan Kumaş", type: "number", unit: "m²/parti", required: true, smartDefault: 5000, validation: { min: 1 }, helper: "", expertMeaning: "Total fabric used per batch" },
    { id: "fabricWaste", label: "Kumaş Atığı", type: "number", unit: "m²/parti", required: true, smartDefault: 750, validation: { min: 0 }, helper: "", expertMeaning: "Fabric waste per batch" },
    { id: "fabricUnitCost", label: "Kumaş Birim Maliyeti", type: "number", unit: "USD/m²", required: true, smartDefault: 8, validation: { min: 0.01 }, helper: "", expertMeaning: "Fabric cost per sqm" },
    { id: "annualBatches", label: "Yıllık Parti Sayısı", type: "number", unit: "parti/yıl", required: true, smartDefault: 100, validation: { min: 1 }, helper: "", expertMeaning: "Annual batch count" },
    { id: "recycleRevenue", label: "Geri Dönüşüm Geliri", type: "number", unit: "USD/m²", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Revenue from waste recycling" },
    { id: "wasteDisposalCost", label: "Atık Bertaraf Maliyeti", type: "number", unit: "USD/m²", required: false, smartDefault: 0.25, validation: { min: 0 }, helper: "", expertMeaning: "Waste disposal cost per sqm" },
  ],
  outputs: [
    { id: "textileWasteRate", label: "Kumaş Atık Oranı", unit: "%", format: "percentage" },
    { id: "preConsumerWaste", label: "Tüketim Öncesi Atık Maliyeti", unit: "USD/yıl", format: "currency" },
    { id: "netWasteCost", label: "Net Atık Maliyeti", unit: "USD/yıl", format: "currency", isBigNumber: true },
    { id: "wasteRiskScore", label: "Atık Risk Skoru", unit: "", format: "score" },
  ],
  thresholds: [{ fieldId: "textileWasteRate", warning: 10, critical: 20, direction: "higher_is_bad", warningMessage: "Atık oranı > %10 — kesim optimizasyonu önerilir.", criticalMessage: "Atık oranı > %20 — kalıp ve kesim süreci yenilenmeli." }],
  formulaPipeline: [
    { formulaId: "measurement.textile_waste_rate", inputMap: { fabricWaste: "fabricWaste", fabricUsed: "fabricUsed" }, outputId: "textileWasteRate" },
    { formulaId: "cost.pre_consumer_waste", inputMap: { fabricWaste: "fabricWaste", fabricUnitCost: "fabricUnitCost", annualBatches: "annualBatches" }, outputId: "preConsumerWaste" },
    { formulaId: "cost.net_waste_cost", inputMap: { preConsumerWaste: "preConsumerWaste", recycleRevenue: "recycleRevenue", wasteDisposalCost: "wasteDisposalCost", fabricWaste: "fabricWaste", annualBatches: "annualBatches" }, outputId: "netWasteCost" },
    { formulaId: "measurement.waste_risk_score", inputMap: { textileWasteRate: "textileWasteRate", netWasteCost: "netWasteCost" }, outputId: "wasteRiskScore" },
  ],
  reportTemplate: { title: "Textile Waste Risk Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 8, targetMarginPercent: 18, assumptionNotes: ["Waste rate = Waste / Used × 100.", "Waste cost = Waste × UnitCost × Batches.", "Net cost adjusts for recycling revenue."] },
};
