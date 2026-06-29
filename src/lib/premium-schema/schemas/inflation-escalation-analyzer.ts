/**
 * Tool #35 — Enflasyon Eskalasyon
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const INFLATION_ESCALATION_SCHEMA: PremiumCalculatorSchema = {
  id: "inflation-escalation-analyzer", legacyPaidSlug: "inflation-escalation-analyzer",
  name: "Enflasyon Eskalasyon & NPV Analizi", name_i18n: {"en":"Inflation Escalation & NPV Analysis","tr":"Enflasyon Eskalasyon & NPV Analizi"}, sectorSlug: "construction", category: "cost",
  painStatement: "Uzun vadeli projelerde enflasyon eskalasyonu doğru hesaplanmazsa bütçe sapmaları ve nakit akışı sorunları kaçınılmazdır.", painStatement_i18n: {"en":"Without accurate inflation escalation calculation in long-term projects, budget variances and cash flow issues become inevitable.","tr":"Uzun vadeli projelerde enflasyon eskalasyonu doğru hesaplanmazsa bütçe sapmaları ve nakit akışı sorunları kaçınılmazdır."},
  inputs: [
    { id: "baseMaterial", label: "Baz Malzeme Maliyeti", label_i18n: {"en":"Base material cost","tr":"Baz Malzeme Maliyeti"}, type: "number", unit: "USD", required: true, smartDefault: 500000, validation: { min: 0 }, helper: "", expertMeaning: "Base material cost", expertMeaning_i18n: {"en":"Base material cost","tr":"Baz Malzeme Maliyeti"} },
    { id: "inflMaterial", label: "Malzeme Enflasyonu", label_i18n: {"en":"Material inflation rate","tr":"Malzeme Enflasyonu"}, type: "number", unit: "%/yıl", required: true, smartDefault: 8, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Material inflation rate", expertMeaning_i18n: {"en":"Material inflation rate","tr":"Malzeme Enflasyonu"} },
    { id: "baseLabor", label: "Baz İşçilik Maliyeti", label_i18n: {"en":"Base labor cost","tr":"Baz İşçilik Maliyeti"}, type: "number", unit: "USD", required: true, smartDefault: 300000, validation: { min: 0 }, helper: "", expertMeaning: "Base labor cost", expertMeaning_i18n: {"en":"Base labor cost","tr":"Baz İşçilik Maliyeti"} },
    { id: "inflLabor", label: "İşçilik Enflasyonu", label_i18n: {"en":"Labor inflation rate","tr":"İşçilik Enflasyonu"}, type: "number", unit: "%/yıl", required: true, smartDefault: 6, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Labor inflation rate", expertMeaning_i18n: {"en":"Labor inflation rate","tr":"İşçilik Enflasyonu"} },
    { id: "projectYears", label: "Proje Süresi", label_i18n: {"en":"Project duration in years","tr":"Proje Süresi"}, type: "number", unit: "yıl", required: true, smartDefault: 3, validation: { min: 1 }, helper: "", expertMeaning: "Project duration in years", expertMeaning_i18n: {"en":"Project duration in years","tr":"Proje Süresi"} },
    { id: "nominalRate", label: "Nominal İskonto Oranı", label_i18n: {"en":"Nominal discount rate","tr":"Nominal İskonto Oranı"}, type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Nominal discount rate", expertMeaning_i18n: {"en":"Nominal discount rate","tr":"Nominal İskonto Oranı"} },
    { id: "generalInflation", label: "Genel Enflasyon", label_i18n: {"en":"General inflation","tr":"Genel Enflasyon"}, type: "number", unit: "%", required: false, smartDefault: 7, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "General inflation", expertMeaning_i18n: {"en":"General inflation","tr":"Genel Enflasyon"} },
    { id: "confidenceFactor", label: "Güven Faktörü", label_i18n: {"en":"Contingency confidence factor","tr":"Güven Faktörü"}, type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Contingency confidence factor", expertMeaning_i18n: {"en":"Contingency confidence factor","tr":"Güven Faktörü"} },
    { id: "riskLevel", label: "Risk Seviyesi", label_i18n: {"en":"Project risk level","tr":"Risk Seviyesi"}, type: "select", unit: "", enumValues: ["düşük", "orta", "yüksek"], required: false, smartDefault: "orta", helper: "", expertMeaning: "Project risk level", expertMeaning_i18n: {"en":"Project risk level","tr":"Risk Seviyesi"} },
  ],
  outputs:  [
    { id: "escalatedMaterial", label: "Eskale Malzeme", label_i18n: {"en":"Escalated Material","tr":"Eskale Malzeme"}, unit: "USD", format: "currency" },
    { id: "escalatedLabor", label: "Eskale İşçilik", label_i18n: {"en":"Escalated Labor","tr":"Eskale İşçilik"}, unit: "USD", format: "currency" },
    { id: "realDiscount", label: "Reel İskonto Oranı", label_i18n: {"en":"Real Discount Rate","tr":"Reel İskonto Oranı"}, unit: "%", format: "percentage" },
    { id: "contingency", label: "Karşılık (Contingency)", label_i18n: {"en":"Contingency Reserve","tr":"Karşılık (Contingency)"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "contingency", warning: 100000, critical: 250000, direction: "higher_is_bad", warningMessage: "Karşılık > $100K — risk yönetimi planı gözden geçirilmeli.", warningMessage_i18n: {"en":"Contingency > $100K — risk management plan should be reviewed.","tr":"Karşılık > $100K — risk yönetimi planı gözden geçirilmeli."}, criticalMessage: "Karşılık > $250K — proje fizibilitesi risk altında.", criticalMessage_i18n: {"en":"Contingency > $250K — project feasibility at risk.","tr":"Karşılık > $250K — proje fizibilitesi risk altında."} }],
  formulaPipeline: [
    { formulaId: "cost.escalation_material", inputMap: { baseMaterial: "baseMaterial", inflMaterial: "inflMaterial", projectYears: "projectYears" }, outputId: "escalatedMaterial" },
    { formulaId: "cost.escalation_labor", inputMap: { baseLabor: "baseLabor", inflLabor: "inflLabor", projectYears: "projectYears" }, outputId: "escalatedLabor" },
    { formulaId: "cost.escalation_real_discount", inputMap: { nominalRate: "nominalRate", generalInflation: "generalInflation" }, outputId: "realDiscount" },
    { formulaId: "cost.escalation_contingency", inputMap: { baseAdjusted: "baseMaterial", confidenceFactor: "confidenceFactor" }, outputId: "contingency" },
  ],
  reportTemplate: { title: "Inflation Escalation Report", title_i18n: {"en":"Inflation Escalation Report","tr":"Inflation Escalation Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 20, targetMarginPercent: 25, assumptionNotes: ["Escalated = Base×(1+Infl)^Years.", "Real discount = (1+Nom)/(1+Infl)-1.", "Contingency = Adjusted×ConfFactor."],assumptionNotes_i18n:[{"en":"Escalated = Base×(1+Infl)^Years.","tr":"Escalated = Base×(1+Infl)^Years."},{"en":"Real discount = (1+Nom)/(1+Infl)-1.","tr":"Real discount = (1+Nom)/(1+Infl)-1."},{"en":"Contingency = Adjusted×ConfFactor.","tr":"Contingency = Adjusted×ConfFactor."}] },
};
