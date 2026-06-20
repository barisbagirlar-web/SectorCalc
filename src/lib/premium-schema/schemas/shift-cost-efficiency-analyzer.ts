/**
 * Tool #33 — Vardiya Maliyet
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const SHIFT_COST_EFFICIENCY_SCHEMA: PremiumCalculatorSchema = {
  id: "shift-cost-efficiency-analyzer", legacyPaidSlug: "shift-cost-efficiency-analyzer",
  name: "Vardiya Maliyet ve Verimlilik", sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Vardiyalar arası maliyet ve verimlilik farkı ölçülmezse düşük performanslı vardiyalar tüm operasyon kârlılığını düşürür. Her vardiyanın gerçek birim maliyeti bilinmelidir.",
  inputs: [
    { id: "shiftCount", label: "Vardiya Sayısı", type: "number", unit: "vardiya/gün", required: true, smartDefault: 3, validation: { min: 1, max: 3 }, helper: "", expertMeaning: "Number of daily shifts" },
    { id: "workersPerShift", label: "İşçi Sayısı / Vardiya", type: "number", unit: "kişi", required: true, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Workers per shift" },
    { id: "hourlyWage", label: "Saatlik Ücret", type: "number", unit: "USD/saat", required: true, smartDefault: 20, validation: { min: 1 }, helper: "", expertMeaning: "Average hourly wage" },
    { id: "shiftHours", label: "Vardiya Süresi", type: "number", unit: "saat", required: true, smartDefault: 8, validation: { min: 1 }, helper: "", expertMeaning: "Shift duration in hours" },
    { id: "shiftPremium", label: "Vardiya Zammı (2. ve 3. vardiya)", type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Shift premium percentage" },
    { id: "dailyOutput", label: "Günlük Üretim Miktarı", type: "number", unit: "adet", required: true, smartDefault: 1000, validation: { min: 1 }, helper: "", expertMeaning: "Total daily output across all shifts" },
    { id: "overtimeHours", label: "Fazla Mesai / Vardiya", type: "number", unit: "saat", required: false, smartDefault: 1, validation: { min: 0 }, helper: "", expertMeaning: "Overtime hours per shift" },
  ],
  outputs: [
    { id: "shiftTotalCost", label: "Toplam Vardiya Maliyeti", unit: "USD/gün", format: "currency" },
    { id: "shiftEfficiency", label: "Vardiya Verimliliği", unit: "%", format: "percentage" },
    { id: "shiftCostPerUnit", label: "Birim Başına Vardiya Maliyeti", unit: "USD/adet", format: "currency" },
    { id: "annualShiftCost", label: "Yıllık Vardiya Maliyeti", unit: "USD/yıl", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "shiftCostPerUnit", warning: 5, critical: 10, direction: "higher_is_bad", warningMessage: "Birim maliyet > $5 — vardiya verimliliği iyileştirilmeli.", criticalMessage: "Birim maliyet > $10 — vardiya yapısı yeniden planlanmalı." },
    { fieldId: "shiftEfficiency", warning: 75, critical: 60, direction: "lower_is_bad", warningMessage: "Verimlilik < %75 — iş yükü dengelemesi önerilir.", criticalMessage: "Verimlilik < %60 — acil iyileştirme programı gerekli." },
  ],
  formulaPipeline: [
    { formulaId: "cost.shift_total_cost", inputMap: { shiftCount: "shiftCount", workersPerShift: "workersPerShift", hourlyWage: "hourlyWage", shiftHours: "shiftHours", shiftPremium: "shiftPremium", overtimeHours: "overtimeHours" }, outputId: "shiftTotalCost" },
    { formulaId: "measurement.shift_efficiency", inputMap: { dailyOutput: "dailyOutput", shiftCount: "shiftCount", workersPerShift: "workersPerShift", shiftHours: "shiftHours" }, outputId: "shiftEfficiency" },
    { formulaId: "cost.shift_cost_per_unit", inputMap: { shiftTotalCost: "shiftTotalCost", dailyOutput: "dailyOutput" }, outputId: "shiftCostPerUnit" },
    { formulaId: "cost.annual_shift_cost", inputMap: { shiftTotalCost: "shiftTotalCost" }, outputId: "annualShiftCost" },
  ],
  reportTemplate: { title: "Vardiya Maliyet ve Verimlilik Raporu", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 8, targetMarginPercent: 15, assumptionNotes: ["Vardiya zammı ikinci ve üçüncü vardiya için ortalama uygulanır.", "Verimlilik = çıktı / (işçi × saat) oranı üzerinden hesaplanır.", "Yıllık maliyet 240 iş günü baz alınarak hesaplanır."] },
};
