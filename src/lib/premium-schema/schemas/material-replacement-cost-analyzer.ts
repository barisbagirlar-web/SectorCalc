/**
 * Tool #18 — Malzeme Replacement Maliyet
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const MATERIAL_REPLACEMENT_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "material-replacement-cost-analyzer", legacyPaidSlug: "material-replacement-cost-analyzer",
  name: "Malzeme Replacement Maliyet Analizi", name_i18n: {"en":"Material Replacement Cost Analysis","tr":"Malzeme Replacement Maliyet Analizi"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Alternatif malzeme geçişlerinde TCO, ağırlık tasarrufu ve net fayda hesaplanmazsa yanlış karar maliyet artırır.", painStatement_i18n: {"en":"Without TCO, weight savings, and net benefit calculations for alternative material transitions, wrong decisions increase costs.","tr":"Alternatif malzeme geçişlerinde TCO, ağırlık tasarrufu ve net fayda hesaplanmazsa yanlış karar maliyet artırır."},
  inputs: [
    { id: "currentMaterialCost", label: "Mevcut Malzeme Birim Maliyeti", label_i18n: {"en":"Current material cost per kg","tr":"Mevcut Malzeme Birim Maliyeti"}, type: "number", unit: "USD/kg", required: true, smartDefault: 5, validation: { min: 0.01 }, helper: "", expertMeaning: "Current material cost per kg", expertMeaning_i18n: {"en":"Current material cost per kg","tr":"Mevcut Malzeme Birim Maliyeti"} },
    { id: "currentMaterialWeight", label: "Mevcut Malzeme Ağırlık", label_i18n: {"en":"Current material weight","tr":"Mevcut Malzeme Ağırlık"}, type: "number", unit: "kg", required: true, smartDefault: 100, validation: { min: 0.1 }, helper: "", expertMeaning: "Current material weight", expertMeaning_i18n: {"en":"Current material weight","tr":"Mevcut Malzeme Ağırlık"} },
    { id: "alternativeMaterialCost", label: "Alternatif Malzeme Birim Maliyeti", label_i18n: {"en":"Alternative material cost per kg","tr":"Alternatif Malzeme Birim Maliyeti"}, type: "number", unit: "USD/kg", required: true, smartDefault: 7, validation: { min: 0.01 }, helper: "", expertMeaning: "Alternative material cost per kg", expertMeaning_i18n: {"en":"Alternative material cost per kg","tr":"Alternatif Malzeme Birim Maliyeti"} },
    { id: "alternativeWeight", label: "Alternatif Malzeme Ağırlık", label_i18n: {"en":"Alternative material weight","tr":"Alternatif Malzeme Ağırlık"}, type: "number", unit: "kg", required: true, smartDefault: 60, validation: { min: 0.1 }, helper: "", expertMeaning: "Alternative material weight", expertMeaning_i18n: {"en":"Alternative material weight","tr":"Alternatif Malzeme Ağırlık"} },
    { id: "productionVolume", label: "Yıllık Üretim Hacmi", label_i18n: {"en":"Annual production volume","tr":"Yıllık Üretim Hacmi"}, type: "number", unit: "adet", required: true, smartDefault: 50000, validation: { min: 1 }, helper: "", expertMeaning: "Annual production volume", expertMeaning_i18n: {"en":"Annual production volume","tr":"Yıllık Üretim Hacmi"} },
    { id: "toolingCost", label: "Takım/Geçiş Maliyeti", label_i18n: {"en":"Tooling or transition cost","tr":"Takım/Geçiş Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Tooling or transition cost", expertMeaning_i18n: {"en":"Tooling or transition cost","tr":"Takım/Geçiş Maliyeti"} },
  ],
  outputs:  [
    { id: "currentTco", label: "Mevcut Malzeme TCO", label_i18n: {"en":"Current Material TCO","tr":"Mevcut Malzeme TCO"}, unit: "USD/yıl", format: "currency" },
    { id: "alternativeTco", label: "Alternatif Malzeme TCO", label_i18n: {"en":"Alternative Material TCO","tr":"Alternatif Malzeme TCO"}, unit: "USD/yıl", format: "currency" },
    { id: "weightSavings", label: "Ağırlık Tasarrufu", label_i18n: {"en":"Weight Savings","tr":"Ağırlık Tasarrufu"}, unit: "kg/yıl", format: "number" },
    { id: "netBenefit", label: "Net Yıllık Fayda", label_i18n: {"en":"Net Annual Benefit","tr":"Net Yıllık Fayda"}, unit: "USD/yıl", format: "currency" },
    { id: "paybackYears", label: "Geri Ödeme Süresi", label_i18n: {"en":"Payback Period","tr":"Geri Ödeme Süresi"}, unit: "yıl", format: "number" },
  ],
  thresholds: [{ fieldId: "netBenefit", warning: 5000, critical: -5000, direction: "lower_is_bad", warningMessage: "Net fayda < $5K — geçiş kararı riskli.", warningMessage_i18n: {"en":"Net benefit < $5K — transition decision is risky.","tr":"Net fayda < $5K — geçiş kararı riskli."}, criticalMessage: "Net fayda negatif — alternatif malzeme daha pahalı.", criticalMessage_i18n: {"en":"Net benefit negative — alternative material is more expensive.","tr":"Net fayda negatif — alternatif malzeme daha pahalı."} }],
  formulaPipeline: [
    { formulaId: "cost.tco_current", inputMap: { currentMaterialCost: "currentMaterialCost", currentMaterialWeight: "currentMaterialWeight", productionVolume: "productionVolume" }, outputId: "currentTco" },
    { formulaId: "cost.tco_alternative", inputMap: { alternativeMaterialCost: "alternativeMaterialCost", alternativeWeight: "alternativeWeight", productionVolume: "productionVolume" }, outputId: "alternativeTco" },
    { formulaId: "cost.tco_weight_savings", inputMap: { currentMaterialWeight: "currentMaterialWeight", alternativeWeight: "alternativeWeight", productionVolume: "productionVolume" }, outputId: "weightSavings" },
    { formulaId: "cost.tco_net_benefit", inputMap: { currentTco: "currentTco", alternativeTco: "alternativeTco", toolingCost: "toolingCost" }, outputId: "netBenefit" },
    { formulaId: "measurement.tco_payback", inputMap: { toolingCost: "toolingCost", netBenefit: "netBenefit" }, outputId: "paybackYears" },
  ],
  reportTemplate: { title: "Material Replacement Cost Report", title_i18n: {"en":"Material Replacement Cost Report","tr":"Material Replacement Cost Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["TCO = birim maliyet × ağırlık × hacim.", "Net fayda = mevcut TCO − alternatif TCO − takım maliyeti.", "Ağırlık tasarrufu = (mevcut − alternatif) × hacim."],assumptionNotes_i18n:[{"en":"TCO = unit cost × weight × volume.","tr":"TCO = birim maliyet × ağırlık × hacim."},{"en":"Net benefit = current TCO − alternative TCO − tooling cost.","tr":"Net fayda = mevcut TCO − alternatif TCO − takım maliyeti."},{"en":"Weight savings = (current − alternative) × volume.","tr":"Ağırlık tasarrufu = (mevcut − alternatif) × hacim."}] },
};
