/**
 * Tool — Takım Aşınma
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const TOOL_WEAR_COST_ANALYZER: PremiumCalculatorSchema = {
  id: "tool-wear-cost-analyzer", legacyPaidSlug: "tool-wear-cost-analyzer",
  name: "Takım Aşınma Maliyet Analizi", sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Kesici takım aşınması takip edilmezse parça başı takım maliyeti artar, erken kırılmalar plansız duruşlara ve yüksek hurda oranına yol açar.",
  inputs: [
    { id: "toolCost", label: "Takım Birim Maliyeti", type: "number", unit: "USD/takım", required: true, smartDefault: 50, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per tool" },
    { id: "toolLifeParts", label: "Takım Ömrü", type: "number", unit: "parça", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Parts produced per tool life" },
    { id: "annualPartVolume", label: "Yıllık Parça Hacmi", type: "number", unit: "adet", required: true, smartDefault: 50000, validation: { min: 1 }, helper: "", expertMeaning: "Annual part production volume" },
    { id: "toolChangeTime", label: "Takım Değişim Süresi", type: "number", unit: "dakika", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Tool change time in minutes" },
    { id: "machineRate", label: "Makine Saatlik Maliyeti", type: "number", unit: "USD/saat", required: false, smartDefault: 85, validation: { min: 1 }, helper: "", expertMeaning: "Machine hourly cost" },
    { id: "prematureFailureRate", label: "Erken Kırılma Oranı", type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Premature tool failure rate" },
    { id: "scrapCostPerFail", label: "Kırılma Başına Hurda Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Scrap cost per tool failure" },
    { id: "numToolsPerYear", label: "Yıllık Kullanılan Takım Sayısı", type: "number", unit: "adet/yıl", required: false, smartDefault: 100, validation: { min: 1 }, helper: "", expertMeaning: "Number of tools used per year" },
  ],
  outputs: [
    { id: "toolingCostPerPart", label: "Parça Başı Takım Maliyeti", unit: "USD/parça", format: "currency" },
    { id: "toolingTotal", label: "Toplam Takım Maliyeti", unit: "USD/yıl", format: "currency", isBigNumber: true },
    { id: "prematureFailureCost", label: "Erken Kırılma Maliyeti", unit: "USD/yıl", format: "currency" },
  ],
  thresholds: [{ fieldId: "toolingCostPerPart", warning: 0.15, critical: 0.3, direction: "higher_is_bad", warningMessage: "Parça başı takım maliyeti >$0.15 — takım ömrü iyileştirilmeli.", criticalMessage: "Parça başı takım maliyeti >$0.30 — takım seçimi veya kesme parametreleri gözden geçirilmeli." }],
  formulaPipeline: [
    { formulaId: "cost.tooling_cost_per_part", inputMap: { toolCost: "toolCost", toolLifeParts: "toolLifeParts" }, outputId: "toolingCostPerPart" },
    { formulaId: "cost.tooling_total", inputMap: { toolingCostPerPart: "toolingCostPerPart", annualPartVolume: "annualPartVolume", toolChangeTime: "toolChangeTime", machineRate: "machineRate" }, outputId: "toolingTotal" },
    { formulaId: "cost.premature_failure_cost", inputMap: { prematureFailureRate: "prematureFailureRate", numToolsPerYear: "numToolsPerYear", toolCost: "toolCost", scrapCostPerFail: "scrapCostPerFail" }, outputId: "prematureFailureCost" },
  ],
  reportTemplate: { title: "Takım Aşınma Maliyet Raporu", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Parça başı takım maliyeti = takım fiyatı / takım ömrü.", "Toplam maliyet = parça başı × yıllık hacim + değişim maliyeti.", "Erken kırılma maliyeti = kırılma oranı × (takım + hurda) × yıllık takım.", "Takız ömrü Taylor takım ömrü denklemine göre belirlenir."] },
};
