/**
 * Tool — Takım Aşınma
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const TOOL_WEAR_COST_ANALYZER: PremiumCalculatorSchema = {
  id: "tool-wear-cost-analyzer", legacyPaidSlug: "tool-wear-cost-analyzer",
  name: "Takım Aşınma Maliyet Analizi", name_i18n: {"en":"Tool Wear Cost Analysis"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Kesici takım aşınması takip edilmezse parça başı takım maliyeti artar, erken kırılmalar plansız duruşlara ve yüksek hurda oranına yol açar.", painStatement_i18n: {"en":"If tool wear is not tracked, per-part tooling cost increases and premature failures lead to unplanned downtime and high scrap rates."},
  inputs: [
    { id: "toolCost", label: "Takım Birim Maliyeti", label_i18n: {"en":"Tool Unit Cost"}, type: "number", unit: "USD/takım", required: true, smartDefault: 50, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per tool", expertMeaning_i18n: {"en":"Cost per tool"} },
    { id: "toolLifeParts", label: "Takım Ömrü", label_i18n: {"en":"Tool Life"}, type: "number", unit: "parça", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Parts produced per tool life", expertMeaning_i18n: {"en":"Parts produced per tool life"} },
    { id: "annualPartVolume", label: "Yıllık Parça Hacmi", label_i18n: {"en":"Annual Part Volume"}, type: "number", unit: "adet", required: true, smartDefault: 50000, validation: { min: 1 }, helper: "", expertMeaning: "Annual part production volume", expertMeaning_i18n: {"en":"Annual part production volume"} },
    { id: "toolChangeTime", label: "Takım Değişim Süresi", label_i18n: {"en":"Tool Change Time"}, type: "number", unit: "dakika", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Tool change time in minutes", expertMeaning_i18n: {"en":"Tool change time in minutes"} },
    { id: "machineRate", label: "Makine Saatlik Maliyeti", label_i18n: {"en":"Machine Hourly Cost"}, type: "number", unit: "USD/saat", required: false, smartDefault: 85, validation: { min: 1 }, helper: "", expertMeaning: "Machine hourly cost", expertMeaning_i18n: {"en":"Machine hourly cost"} },
    { id: "prematureFailureRate", label: "Erken Kırılma Oranı", label_i18n: {"en":"Premature Failure Rate"}, type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Premature tool failure rate", expertMeaning_i18n: {"en":"Premature tool failure rate"} },
    { id: "scrapCostPerFail", label: "Kırılma Başına Hurda Maliyeti", label_i18n: {"en":"Scrap Cost Per Failure"}, type: "number", unit: "USD", required: false, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Scrap cost per tool failure", expertMeaning_i18n: {"en":"Scrap cost per tool failure"} },
    { id: "numToolsPerYear", label: "Yıllık Kullanılan Takım Sayısı", label_i18n: {"en":"Annual Tool Usage"}, type: "number", unit: "adet/yıl", required: false, smartDefault: 100, validation: { min: 1 }, helper: "", expertMeaning: "Number of tools used per year", expertMeaning_i18n: {"en":"Number of tools used per year"} },
  ],
  outputs: [
    { id: "toolingCostPerPart", label: "Parça Başı Takım Maliyeti", label_i18n: {"en":"Parca Bas Takm Maliyeti"}, unit: "USD/parça", format: "currency" },
    { id: "toolingTotal", label: "Toplam Takım Maliyeti", label_i18n: {"en":"Toplam Takm Maliyeti"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
    { id: "prematureFailureCost", label: "Erken Kırılma Maliyeti", label_i18n: {"en":"Erken Krlma Maliyeti"}, unit: "USD/yıl", format: "currency" },
  ],
  thresholds: [{ fieldId: "toolingCostPerPart", warning: 0.15, critical: 0.3, direction: "higher_is_bad", warningMessage: "Parça başı takım maliyeti >$0.15 — takım ömrü iyileştirilmeli.", warningMessage_i18n: {"en":"Per-part tooling cost >$0.15 — tool life should be improved."}, criticalMessage: "Parça başı takım maliyeti >$0.30 — takım seçimi veya kesme parametreleri gözden geçirilmeli.", criticalMessage_i18n: {"en":"Per-part tooling cost >$0.30 — review tool selection or cutting parameters."} }],
  formulaPipeline: [
    { formulaId: "cost.tooling_cost_per_part", inputMap: {
        toolingCost: "toolCost",
        partsProduced: "toolLifeParts"
      }, outputId: "toolingCostPerPart" },
    { formulaId: "cost.tooling_total", inputMap: {
        purchaseCost: "toolingCostPerPart",
        regrindCost: "annualPartVolume",
        inventoryCost: "toolChangeTime",
        machineRate: "machineRate"
      }, outputId: "toolingTotal" },
    { formulaId: "cost.premature_failure_cost", inputMap: {
        prematureFailures: "prematureFailureRate",
        toolingCost: "numToolsPerYear",
        toolCost: "toolCost",
        scrapCostPerFail: "scrapCostPerFail"
      }, outputId: "prematureFailureCost" },
  ],
  reportTemplate: { title: "Takım Aşınma Maliyet Raporu", title_i18n: {"en":"Tool Wear Cost Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Parça başı takım maliyeti = takım fiyatı / takım ömrü.", "Toplam maliyet = parça başı × yıllık hacim + değişim maliyeti.", "Erken kırılma maliyeti = kırılma oranı × (takım + hurda) × yıllık takım.", "Takız ömrü Taylor takım ömrü denklemine göre belirlenir."],assumptionNotes_i18n:[{"en":"Per-part tool cost = tool price / tool life."},{"en":"Total cost = per-part × annual volume + changeover cost."},{"en":"Premature failure cost = failure rate × (tool + scrap) × annual tools."},{"en":"Tool life is determined by the Taylor tool life equation."}]},
};
