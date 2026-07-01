/**
 * Tool #33 — Vardiya Maliyet
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SHIFT_COST_EFFICIENCY_SCHEMA: PremiumCalculatorSchema = {
  id: "shift-cost-efficiency-analyzer", legacyPaidSlug: "shift-cost-efficiency-analyzer",
  name: "Vardiya Maliyet ve Verimlilik", name_i18n: {"en":"Shift Cost and Efficiency"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Vardiyalar arası maliyet ve verimlilik farkı ölçülmezse düşük performanslı vardiyalar tüm operasyon kârlılığını düşürür. Her vardiyanın gerçek birim maliyeti bilinmelidir.", painStatement_i18n: {"en":"If cost and efficiency differences between shifts are not measured, low-performing shifts drag down overall operational profitability. Each shift's true unit cost must be known."},
  inputs: [
    { id: "shiftCount", label: "Vardiya Sayısı", label_i18n: {"en":"Number of Shifts"}, type: "number", unit: "vardiya/gün", required: true, smartDefault: 3, validation: { min: 1, max: 3 }, helper: "", expertMeaning: "Number of daily shifts", expertMeaning_i18n: {"en":"Number of daily shifts"} },
    { id: "workersPerShift", label: "İşçi Sayısı / Vardiya", label_i18n: {"en":"Workers per Shift"}, type: "number", unit: "kişi", required: true, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Workers per shift", expertMeaning_i18n: {"en":"Workers per shift"} },
    { id: "hourlyWage", label: "Saatlik Ücret", label_i18n: {"en":"Hourly Wage"}, type: "number", unit: "USD/saat", required: true, smartDefault: 20, validation: { min: 1 }, helper: "", expertMeaning: "Average hourly wage", expertMeaning_i18n: {"en":"Average hourly wage"} },
    { id: "shiftHours", label: "Vardiya Süresi", label_i18n: {"en":"Shift Duration"}, type: "number", unit: "saat", required: true, smartDefault: 8, validation: { min: 1 }, helper: "", expertMeaning: "Shift duration in hours", expertMeaning_i18n: {"en":"Shift duration in hours"} },
    { id: "shiftPremium", label: "Vardiya Zammı (2. ve 3. vardiya)", label_i18n: {"en":"Shift Premium (2nd and 3rd)"}, type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Shift premium percentage", expertMeaning_i18n: {"en":"Shift premium percentage"} },
    { id: "dailyOutput", label: "Günlük Üretim Miktarı", label_i18n: {"en":"Daily Production Quantity"}, type: "number", unit: "adet", required: true, smartDefault: 1000, validation: { min: 1 }, helper: "", expertMeaning: "Total daily output across all shifts", expertMeaning_i18n: {"en":"Total daily output across all shifts"} },
    { id: "overtimeHours", label: "Fazla Mesai / Vardiya", label_i18n: {"en":"Overtime per Shift"}, type: "number", unit: "saat", required: false, smartDefault: 1, validation: { min: 0 }, helper: "", expertMeaning: "Overtime hours per shift", expertMeaning_i18n: {"en":"Overtime hours per shift"} },
  ],
  outputs: [
    { id: "shiftTotalCost", label: "Toplam Vardiya Maliyeti", label_i18n: {"en":"Total Shift Cost"}, unit: "USD/gün", format: "currency" },
    { id: "shiftEfficiency", label: "Vardiya Verimliliği", label_i18n: {"en":"Shift Efficiency"}, unit: "%", format: "percentage" },
    { id: "shiftCostPerUnit", label: "Birim Başına Vardiya Maliyeti", label_i18n: {"en":"Shift Cost per Unit"}, unit: "USD/adet", format: "currency" },
    { id: "annualShiftCost", label: "Yıllık Vardiya Maliyeti", label_i18n: {"en":"Annual Shift Cost"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "shiftCostPerUnit", warning: 5, critical: 10, direction: "higher_is_bad", warningMessage: "Birim maliyet > $5 — vardiya verimliliği iyileştirilmeli.", warningMessage_i18n: {"en":"Unit cost > $5 — improve shift efficiency."}, criticalMessage: "Birim maliyet > $10 — vardiya yapısı yeniden planlanmalı.", criticalMessage_i18n: {"en":"Unit cost > $10 — restructure shift plan."} },
    { fieldId: "shiftEfficiency", warning: 75, critical: 60, direction: "lower_is_bad", warningMessage: "Verimlilik < %75 — iş yükü dengelemesi önerilir.", warningMessage_i18n: {"en":"Efficiency < 75% — workload balancing recommended."}, criticalMessage: "Verimlilik < %60 — acil iyileştirme programı gerekli.", criticalMessage_i18n: {"en":"Efficiency < 60% — urgent improvement program needed."} },
  ],
  formulaPipeline: [
    { formulaId: "cost.shift_total_cost", inputMap: { shiftCount: "shiftCount", workersPerShift: "workersPerShift", hourlyWage: "hourlyWage", shiftHours: "shiftHours", shiftPremium: "shiftPremium", overtimeHours: "overtimeHours" ,
        shiftWorkers: "shiftWorkers",
        shiftRate: "shiftRate"}, outputId: "shiftTotalCost" },
    { formulaId: "measurement.shift_efficiency", inputMap: { dailyOutput: "dailyOutput", shiftCount: "shiftCount", workersPerShift: "workersPerShift", shiftHours: "shiftHours" ,
        shiftOutput: "shiftOutput",
        shiftMaxOutput: "shiftMaxOutput"}, outputId: "shiftEfficiency" },
    { formulaId: "cost.shift_cost_per_unit", inputMap: { shiftTotalCost: "shiftTotalCost", dailyOutput: "dailyOutput" ,
        shiftOutput: "shiftOutput"}, outputId: "shiftCostPerUnit" },
    { formulaId: "cost.annual_shift_cost", inputMap: { shiftTotalCost: "shiftTotalCost" ,
        shiftWorkers: "shiftWorkers",
        shiftHours: "shiftHours",
        shiftRate: "shiftRate",
        shiftDays: "shiftDays"}, outputId: "annualShiftCost" },
  ],
  reportTemplate: { title: "Vardiya Maliyet ve Verimlilik Raporu", title_i18n: {"en":"Shift Cost and Efficiency Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 8, targetMarginPercent: 15, assumptionNotes: ["Vardiya zammı ikinci ve üçüncü vardiya için ortalama uygulanır.", "Verimlilik = çıktı / (işçi × saat) oranı üzerinden hesaplanır.", "Yıllık maliyet 240 iş günü baz alınarak hesaplanır."],assumptionNotes_i18n:[{"en":"Shift premium is applied on average for second and third shifts."},{"en":"Efficiency is calculated based on output / (worker × hours) ratio."},{"en":"Annual cost is calculated based on 240 working days."}] },
};
