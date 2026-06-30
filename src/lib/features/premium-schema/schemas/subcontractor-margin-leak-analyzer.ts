/**
 * Tool #19 — Taşeron Marj
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SUBCONTRACTOR_MARGIN_LEAK_SCHEMA: PremiumCalculatorSchema = {
  id: "subcontractor-margin-leak-analyzer", legacyPaidSlug: "subcontractor-margin-leak-analyzer",
  name: "Taşeron Marj Kaçağı Analizi", name_i18n: {"en":"Subcontractor Margin Leak Analysis","tr":"Taşeron Marj Kaçağı Analizi"}, sectorSlug: "construction", category: "cost",
  painStatement: "Taşeron teklif marjı ile gerçekleşen marj arasındaki fark kontrol edilmezse proje kârlılığı sessizce erir.", painStatement_i18n: {"en":"If the difference between quoted subcontractor margin and actual margin is not monitored, project profitability silently erodes.","tr":"Taşeron teklif marjı ile gerçekleşen marj arasındaki fark kontrol edilmezse proje kârlılığı sessizce erir."},
  inputs: [
    { id: "quotedAmount", label: "Teklif Edilen Tutar", label_i18n: {"en":"Quoted Amount","tr":"Teklif Edilen Tutar"}, type: "number", unit: "USD", required: true, smartDefault: 50000, validation: { min: 1 }, helper: "", expertMeaning: "Quoted subcontractor amount", expertMeaning_i18n: {"en":"Quoted subcontractor amount","tr":"Teklif edilen taşeron tutarı"} },
    { id: "actualCost", label: "Gerçekleşen Maliyet", label_i18n: {"en":"Actual subcontractor cost","tr":"Gerçekleşen Maliyet"}, type: "number", unit: "USD", required: true, smartDefault: 55000, validation: { min: 1 }, helper: "", expertMeaning: "Actual subcontractor cost", expertMeaning_i18n: {"en":"Actual subcontractor cost","tr":"gerçekleşen maliyet"} },
    { id: "contractMargin", label: "Sözleşme Marjı", label_i18n: {"en":"Contractual margin percentage","tr":"Sözleşme Marjı"}, type: "number", unit: "%", required: true, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Contractual margin percentage", expertMeaning_i18n: {"en":"Contractual margin percentage","tr":"sözleşme marjı"} },
    { id: "totalSubBudgets", label: "Toplam Taşeron Bütçesi", label_i18n: {"en":"Total subcontractor budget","tr":"Toplam Taşeron Bütçesi"}, type: "number", unit: "USD", required: false, smartDefault: 500000, validation: { min: 0 }, helper: "", expertMeaning: "Total subcontractor budget", expertMeaning_i18n: {"en":"Total subcontractor budget","tr":"toplam taşeron bütçesi"} },
  ],
  outputs: [
    { id: "quotedMargin", label: "Teklif Marjı", label_i18n: {"en":"Teklif Marj","tr":"Teklif Marjı"}, unit: "%", format: "percentage" },
    { id: "actualMargin", label: "Gerçekleşen Marj", label_i18n: {"en":"Gerceklesen Marj","tr":"Gerçekleşen Marj"}, unit: "%", format: "percentage" },
    { id: "marginLeakSub", label: "Marj Kaçağı", label_i18n: {"en":"Marj Kacag","tr":"Marj Kaçağı"}, unit: "USD", format: "currency" },
    { id: "leakagePct", label: "Kaçak Oranı", label_i18n: {"en":"Kacak Oran","tr":"Kaçak Oranı"}, unit: "%", format: "percentage" },
  ],
  thresholds: [{ fieldId: "leakagePct", warning: 5, critical: 15, direction: "higher_is_bad", warningMessage: "Marj kaçağı > %5 — taşeron takibi artırılmalı.", warningMessage_i18n: {"en":"Marj kaçağı > %5 — taşeron takibi artırılmalı.","tr":"Marj kaçağı > %5 — taşeron takibi artırılmalı."}, criticalMessage: "Marj kaçağı > %15 — taşeron sözleşmeleri yenilenmeli.", criticalMessage_i18n: {"en":"Marj kaçağı > %15 — taşeron sözleşmeleri yenilenmeli.","tr":"Marj kaçağı > %15 — taşeron sözleşmeleri yenilenmeli."} }],
  formulaPipeline: [
    { formulaId: "measurement.quoted_margin", inputMap: { quotedAmount: "quotedAmount", actualCost: "actualCost" }, outputId: "quotedMargin" },
    { formulaId: "measurement.actual_margin", inputMap: { actualCost: "actualCost", contractMargin: "contractMargin" }, outputId: "actualMargin" },
    { formulaId: "cost.margin_leak_sub", inputMap: { quotedMargin: "quotedMargin", actualMargin: "actualMargin", totalSubBudgets: "totalSubBudgets" }, outputId: "marginLeakSub" },
    { formulaId: "cost.leakage_pct", inputMap: { quotedMargin: "quotedMargin", actualMargin: "actualMargin" }, outputId: "leakagePct" },
  ],
  reportTemplate: { title: "Subcontractor Margin Leak Report", title_i18n: {"en":"Subcontractor Margin Leak Report","tr":"Taşeron Marj Kaçağı Raporu"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 10, targetMarginPercent: 18, assumptionNotes: ["Quoted margin % = (Quoted − Cost) / Quoted.", "Actual margin reflects true cost.", "Leakage extrapolated to total budget."],assumptionNotes_i18n:[{"en":"Quoted margin % = (Quoted − Cost) / Quoted.","tr":"Quoted margin % = (Quoted − Cost) / Quoted."},{"en":"Actual margin reflects true cost.","tr":"Actual margin reflects true cost."},{"en":"Leakage extrapolated to total budget.","tr":"Leakage extrapolated to total budget."}] },
};
