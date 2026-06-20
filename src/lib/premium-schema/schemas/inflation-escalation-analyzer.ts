/**
 * Tool #35 — Enflasyon Eskalasyon
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const INFLATION_ESCALATION_SCHEMA: PremiumCalculatorSchema = {
  id: "inflation-escalation-analyzer", legacyPaidSlug: "inflation-escalation-analyzer",
  name: "Enflasyon Eskalasyon & NPV Analizi", sectorSlug: "construction", category: "cost",
  painStatement: "Uzun vadeli projelerde enflasyon eskalasyonu doğru hesaplanmazsa bütçe sapmaları ve nakit akışı sorunları kaçınılmazdır.",
  inputs: [
    { id: "baseMaterial", label: "Baz Malzeme Maliyeti", type: "number", unit: "USD", required: true, smartDefault: 500000, validation: { min: 0 }, helper: "", expertMeaning: "Base material cost" },
    { id: "inflMaterial", label: "Malzeme Enflasyonu", type: "number", unit: "%/yıl", required: true, smartDefault: 8, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Material inflation rate" },
    { id: "baseLabor", label: "Baz İşçilik Maliyeti", type: "number", unit: "USD", required: true, smartDefault: 300000, validation: { min: 0 }, helper: "", expertMeaning: "Base labor cost" },
    { id: "inflLabor", label: "İşçilik Enflasyonu", type: "number", unit: "%/yıl", required: true, smartDefault: 6, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Labor inflation rate" },
    { id: "projectYears", label: "Proje Süresi", type: "number", unit: "yıl", required: true, smartDefault: 3, validation: { min: 1 }, helper: "", expertMeaning: "Project duration in years" },
    { id: "nominalRate", label: "Nominal İskonto Oranı", type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Nominal discount rate" },
    { id: "generalInflation", label: "Genel Enflasyon", type: "number", unit: "%", required: false, smartDefault: 7, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "General inflation" },
    { id: "confidenceFactor", label: "Güven Faktörü", type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Contingency confidence factor" },
    { id: "riskLevel", label: "Risk Seviyesi", type: "select", unit: "", enumValues: ["düşük", "orta", "yüksek"], required: false, smartDefault: "orta", helper: "", expertMeaning: "Project risk level" },
  ],
  outputs: [
    { id: "escalatedMaterial", label: "Eskale Malzeme", unit: "USD", format: "currency" },
    { id: "escalatedLabor", label: "Eskale İşçilik", unit: "USD", format: "currency" },
    { id: "realDiscount", label: "Reel İskonto Oranı", unit: "%", format: "percentage" },
    { id: "contingency", label: "Karşılık (Contingency)", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "contingency", warning: 100000, critical: 250000, direction: "higher_is_bad", warningMessage: "Karşılık > $100K — risk yönetimi planı gözden geçirilmeli.", criticalMessage: "Karşılık > $250K — proje fizibilitesi risk altında." }],
  formulaPipeline: [
    { formulaId: "cost.escalation_material", inputMap: { baseMaterial: "baseMaterial", inflMaterial: "inflMaterial", projectYears: "projectYears" }, outputId: "escalatedMaterial" },
    { formulaId: "cost.escalation_labor", inputMap: { baseLabor: "baseLabor", inflLabor: "inflLabor", projectYears: "projectYears" }, outputId: "escalatedLabor" },
    { formulaId: "cost.escalation_real_discount", inputMap: { nominalRate: "nominalRate", generalInflation: "generalInflation" }, outputId: "realDiscount" },
    { formulaId: "cost.escalation_contingency", inputMap: { baseAdjusted: "baseMaterial", confidenceFactor: "confidenceFactor" }, outputId: "contingency" },
  ],
  reportTemplate: { title: "Inflation Escalation Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 20, targetMarginPercent: 25, assumptionNotes: ["Escalated = Base×(1+Infl)^Years.", "Real discount = (1+Nom)/(1+Infl)-1.", "Contingency = Adjusted×ConfFactor."] },
};
