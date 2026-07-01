/**
 * Tool #18 — Malzeme Replacement Maliyet
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const MATERIAL_REPLACEMENT_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "material-replacement-cost-analyzer", legacyPaidSlug: "material-replacement-cost-analyzer",
  name: "Material Replacement Cost Analyzer", name_i18n: {"en":"Material Replacement Cost Analyzer"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Alternatif malzeme geçişlerinde TCO, ağırlık tasarrufu ve net fayda hesaplanmazsa yanlış karar maliyet artırır.", painStatement_i18n: {"en":"Alternatif material geçişlerinde TCO, Weight tasarrufu ve Net fayda if not calculated incorrect decision Cost artırır."},
  inputs: [
    { id: "currentMaterialCost", label: "Mevcut Malzeme Birim Maliyeti", label_i18n: {"en":"Current material Unit Cost"}, type: "number", unit: "USD/kg", required: true, smartDefault: 5, validation: { min: 0.01 }, helper: "", expertMeaning: "Current material cost per kg", expertMeaning_i18n: {"en":"Current material cost per kg"} },
    { id: "currentMaterialWeight", label: "Current material weight", label_i18n: {"en":"Current material weight"}, type: "number", unit: "kg", required: true, smartDefault: 100, validation: { min: 0.1 }, helper: "", expertMeaning: "Current material weight", expertMeaning_i18n: {"en":"Current material weight"} },
    { id: "alternativeMaterialCost", label: "Alternatif Malzeme Birim Maliyeti", label_i18n: {"en":"Alternatif material Unit Cost"}, type: "number", unit: "USD/kg", required: true, smartDefault: 7, validation: { min: 0.01 }, helper: "", expertMeaning: "Alternative material cost per kg", expertMeaning_i18n: {"en":"Alternative material cost per kg"} },
    { id: "alternativeWeight", label: "Alternative material weight", label_i18n: {"en":"Alternative material weight"}, type: "number", unit: "kg", required: true, smartDefault: 60, validation: { min: 0.1 }, helper: "", expertMeaning: "Alternative material weight", expertMeaning_i18n: {"en":"Alternative material weight"} },
    { id: "productionVolume", label: "Annual production volume", label_i18n: {"en":"Annual production volume"}, type: "number", unit: "adet", required: true, smartDefault: 50000, validation: { min: 1 }, helper: "", expertMeaning: "Annual production volume", expertMeaning_i18n: {"en":"Annual production volume"} },
    { id: "toolingCost", label: "Tooling or transition cost", label_i18n: {"en":"Tooling or transition cost"}, type: "number", unit: "USD", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Tooling or transition cost", expertMeaning_i18n: {"en":"Tooling or transition cost"} },
  ],
  outputs: [
    { id: "currentTco", label: "Mevcut Malzeme TCO", label_i18n: {"en":"Current material TCO"}, unit: "USD/yıl", format: "currency" },
    { id: "alternativeTco", label: "Alternatif Malzeme TCO", label_i18n: {"en":"Alternatif material TCO"}, unit: "USD/yıl", format: "currency" },
    { id: "weightSavings", label: "Agrlk Tasarrufu", label_i18n: {"en":"Weight Tasarrufu"}, unit: "kg/yıl", format: "number" },
    { id: "netBenefit", label: "Net Yllk Fayda", label_i18n: {"en":"Net Annual Fayda"}, unit: "USD/yıl", format: "currency" },
    { id: "paybackYears", label: "Geri Ödeme Süresi", label_i18n: {"en":"Payback Period"}, unit: "yıl", format: "number" },
  ],
  thresholds: [{ fieldId: "netBenefit", warning: 5000, critical: -5000, direction: "lower_is_bad", warningMessage: "Net fayda < $5K — geçiş kararı riskli.", warningMessage_i18n: {"en":"Net fayda < $5K — geçiş kararı riskli."}, criticalMessage: "Net fayda negatif — alternatif malzeme daha pahalı.", criticalMessage_i18n: {"en":"Net fayda negatif — alternatif material daha pahalı."} }],
  formulaPipeline: [
    { formulaId: "cost.tco_current", inputMap: { currentMaterialCost: "currentMaterialCost", currentMaterialWeight: "currentMaterialWeight", productionVolume: "productionVolume" ,
        currentPurchase: "currentPurchase",
        currentOperating: "currentOperating",
        currentMaintenance: "currentMaintenance",
        currentDisposal: "currentDisposal"}, outputId: "currentTco" },
    { formulaId: "cost.tco_alternative", inputMap: { alternativeMaterialCost: "alternativeMaterialCost", alternativeWeight: "alternativeWeight", productionVolume: "productionVolume" ,
        altPurchase: "altPurchase",
        altOperating: "altOperating",
        altMaintenance: "altMaintenance",
        altDisposal: "altDisposal"}, outputId: "alternativeTco" },
    { formulaId: "cost.tco_weight_savings", inputMap: { currentMaterialWeight: "currentMaterialWeight", alternativeWeight: "alternativeWeight", productionVolume: "productionVolume" ,
        tcoCurrent: "tcoCurrent",
        tcoAlternative: "tcoAlternative",
        unitQuantity: "unitQuantity"}, outputId: "weightSavings" },
    { formulaId: "cost.tco_net_benefit", inputMap: { currentTco: "currentTco", alternativeTco: "alternativeTco", toolingCost: "toolingCost" ,
        tcoCurrent: "tcoCurrent",
        tcoAlternative: "tcoAlternative"}, outputId: "netBenefit" },
    { formulaId: "measurement.tco_payback", inputMap: { toolingCost: "toolingCost", netBenefit: "netBenefit" ,
        altPremium: "altPremium",
        tcoNetBenefit: "tcoNetBenefit"}, outputId: "paybackYears" },
  ],
  reportTemplate: { title: "Material Replacement Cost Report", title_i18n: {"en":"Material Replacement Cost Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["TCO = birim maliyet × ağırlık × hacim.", "Net fayda = mevcut TCO − alternatif TCO − takım maliyeti.", "Ağırlık tasarrufu = (mevcut − alternatif) × hacim."],assumptionNotes_i18n:[{"en":"TCO = birim maliyet × ağırlık × hacim."},{"en":"Net fayda = mevcut TCO − alternatif TCO − takım maliyeti."},{"en":"Ağırlık tasarrufu = (mevcut − alternatif) × hacim."}] },
};
