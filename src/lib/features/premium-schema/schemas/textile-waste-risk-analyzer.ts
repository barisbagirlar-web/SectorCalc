/**
 * Tool #25 — Tekstil Atığı
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const TEXTILE_WASTE_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "textile-waste-risk-analyzer", legacyPaidSlug: "textile-waste-risk-analyzer",
  name: "Textile Waste Risk Analyzer", name_i18n: {"en":"Textile Waste Risk Analyzer"}, sectorSlug: "textile", category: "cost",
  painStatement: "Tekstil üretiminde kumaş atığı ve fire oranı kontrol edilmezse hammadde maliyeti ve çevresel kayıp artar.", painStatement_i18n: {"en":"Tekstil üretiminde Fabric atığı ve waste rate control edilmezse raw material Cost ve çevresel kayıp artar."},
  inputs: [
    { id: "fabricUsed", label: "Total fabric used per batch", label_i18n: {"en":"Total fabric used per batch"}, type: "number", unit: "m²/parti", required: true, smartDefault: 5000, validation: { min: 1 }, helper: "", expertMeaning: "Total fabric used per batch", expertMeaning_i18n: {"en":"Total fabric used per batch"} },
    { id: "fabricWaste", label: "Fabric waste per batch", label_i18n: {"en":"Fabric waste per batch"}, type: "number", unit: "m²/parti", required: true, smartDefault: 750, validation: { min: 0 }, helper: "", expertMeaning: "Fabric waste per batch", expertMeaning_i18n: {"en":"Fabric waste per batch"} },
    { id: "fabricUnitCost", label: "Fabric cost per sqm", label_i18n: {"en":"Fabric cost per sqm"}, type: "number", unit: "USD/m²", required: true, smartDefault: 8, validation: { min: 0.01 }, helper: "", expertMeaning: "Fabric cost per sqm", expertMeaning_i18n: {"en":"Fabric cost per sqm"} },
    { id: "annualBatches", label: "Annual batch count", label_i18n: {"en":"Annual batch count"}, type: "number", unit: "parti/yıl", required: true, smartDefault: 100, validation: { min: 1 }, helper: "", expertMeaning: "Annual batch count", expertMeaning_i18n: {"en":"Annual batch count"} },
    { id: "recycleRevenue", label: "Revenue from waste recycling", label_i18n: {"en":"Revenue from waste recycling"}, type: "number", unit: "USD/m²", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Revenue from waste recycling", expertMeaning_i18n: {"en":"Revenue from waste recycling"} },
    { id: "wasteDisposalCost", label: "Waste disposal cost per sqm", label_i18n: {"en":"Waste disposal cost per sqm"}, type: "number", unit: "USD/m²", required: false, smartDefault: 0.25, validation: { min: 0 }, helper: "", expertMeaning: "Waste disposal cost per sqm", expertMeaning_i18n: {"en":"Waste disposal cost per sqm"} },
  ],
  outputs: [
    { id: "textileWasteRate", label: "Fabric Waste Rate", label_i18n: {"en":"Fabric Waste Rate"}, unit: "%", format: "percentage" },
    { id: "preConsumerWaste", label: "Pre-Consumption Waste Cost", label_i18n: {"en":"Pre-Consumption Waste Cost"}, unit: "USD/yıl", format: "currency" },
    { id: "netWasteCost", label: "Net Waste Cost", label_i18n: {"en":"Net Waste Cost"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
    { id: "wasteRiskScore", label: "Atk Risk Skoru", label_i18n: {"en":"Waste Risk Skoru"}, unit: "", format: "score" },
  ],
  thresholds: [{ fieldId: "textileWasteRate", warning: 10, critical: 20, direction: "higher_is_bad", warningMessage: "Atık oranı > %10 — kesim optimizasyonu önerilir.", warningMessage_i18n: {"en":"Waste rate > %10 — kesim optimizasyonu önerilir."}, criticalMessage: "Atık oranı > %20 — kalıp ve kesim süreci yenilenmeli.", criticalMessage_i18n: {"en":"Waste rate > %20 — kalıp ve kesim process yenilenmeli."} }],
  formulaPipeline: [
    { formulaId: "measurement.textile_waste_rate", inputMap: { fabricWaste: "fabricWaste", fabricUsed: "fabricUsed" ,
        wasteKg: "wasteKg",
        totalKg: "totalKg"}, outputId: "textileWasteRate" },
    { formulaId: "cost.pre_consumer_waste", inputMap: { fabricWaste: "fabricWaste", fabricUnitCost: "fabricUnitCost", annualBatches: "annualBatches" ,
        preConsumerKg: "preConsumerKg",
        materialCostPerKg: "materialCostPerKg"}, outputId: "preConsumerWaste" },
    { formulaId: "cost.net_waste_cost", inputMap: { preConsumerWaste: "preConsumerWaste", recycleRevenue: "recycleRevenue", wasteDisposalCost: "wasteDisposalCost", fabricWaste: "fabricWaste", annualBatches: "annualBatches" ,
        postConsumerWaste: "postConsumerWaste",
        recyclingRevenue: "recyclingRevenue"}, outputId: "netWasteCost" },
    { formulaId: "measurement.waste_risk_score", inputMap: { textileWasteRate: "textileWasteRate", netWasteCost: "netWasteCost" ,
        industryBenchmark: "industryBenchmark"}, outputId: "wasteRiskScore" },
  ],
  reportTemplate: { title: "Textile Waste Risk Report", title_i18n: {"en":"Textile Waste Risk Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 8, targetMarginPercent: 18, assumptionNotes: ["Waste rate = Waste / Used × 100.", "Waste cost = Waste × UnitCost × Batches.", "Net cost adjusts for recycling revenue."],assumptionNotes_i18n:[{"en":"Waste rate = Waste / Used × 100."},{"en":"Waste cost = Waste × UnitCost × Batches."},{"en":"Net cost adjusts for recycling revenue."}] },
};
