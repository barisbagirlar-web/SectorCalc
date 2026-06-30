/**
 * Tool #33 — Vardiya Maliyet
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const SHIFT_COST_EFFICIENCY_SCHEMA: PremiumCalculatorSchema = {
  id: "shift-cost-efficiency-analyzer", legacyPaidSlug: "shift-cost-efficiency-analyzer",
  name: "Vardiya Maliyet ve Verimlilik", name_i18n: {"en":"Shift Cost and Efficiency","tr":"Vardiya Maliyet ve Verimlilik"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Vardiyalar arası maliyet ve verimlilik farkı ölçülmezse düşük performanslı vardiyalar tüm operasyon kârlılığını düşürür. Her vardiyanın gerçek birim maliyeti bilinmelidir.", painStatement_i18n: {"en":"If cost and efficiency differences between shifts are not measured, low-performing shifts drag down overall operational profitability. Each shift's true unit cost must be known.","tr":"Vardiyalar arası maliyet ve verimlilik farkı ölçülmezse düşük performanslı vardiyalar tüm operasyon kârlılığını düşürür. Her vardiyanın gerçek birim maliyeti bilinmelidir."},
  inputs: [
    { id: "shiftCount", label: "Vardiya Sayısı", label_i18n: {"en":"Number of Shifts","tr":"Vardiya Sayısı"}, type: "number", unit: "vardiya/gün", required: true, smartDefault: 3, validation: { min: 1, max: 3 }, helper: "", expertMeaning: "Number of daily shifts", expertMeaning_i18n: {"en":"Number of daily shifts","tr":"Günlük vardiya sayısı"} },
    { id: "workersPerShift", label: "İşçi Sayısı / Vardiya", label_i18n: {"en":"Workers per Shift","tr":"İşçi Sayısı / Vardiya"}, type: "number", unit: "kişi", required: true, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Workers per shift", expertMeaning_i18n: {"en":"Workers per shift","tr":"Vardiya başına işçi"} },
    { id: "hourlyWage", label: "Saatlik Ücret", label_i18n: {"en":"Hourly Wage","tr":"Saatlik Ücret"}, type: "number", unit: "USD/saat", required: true, smartDefault: 20, validation: { min: 1 }, helper: "", expertMeaning: "Average hourly wage", expertMeaning_i18n: {"en":"Average hourly wage","tr":"Ortalama saatlik ücret"} },
    { id: "shiftHours", label: "Vardiya Süresi", label_i18n: {"en":"Shift Duration","tr":"Vardiya Süresi"}, type: "number", unit: "saat", required: true, smartDefault: 8, validation: { min: 1 }, helper: "", expertMeaning: "Shift duration in hours", expertMeaning_i18n: {"en":"Shift duration in hours","tr":"Saat cinsinden vardiya süresi"} },
    { id: "shiftPremium", label: "Vardiya Zammı (2. ve 3. vardiya)", label_i18n: {"en":"Shift Premium (2nd and 3rd)","tr":"Vardiya Zammı (2. ve 3. vardiya)"}, type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Shift premium percentage", expertMeaning_i18n: {"en":"Shift premium percentage","tr":"Vardiya zammı yüzdesi"} },
    { id: "dailyOutput", label: "Günlük Üretim Miktarı", label_i18n: {"en":"Daily Production Quantity","tr":"Günlük Üretim Miktarı"}, type: "number", unit: "adet", required: true, smartDefault: 1000, validation: { min: 1 }, helper: "", expertMeaning: "Total daily output across all shifts", expertMeaning_i18n: {"en":"Total daily output across all shifts","tr":"Tüm vardiyalarda toplam günlük çıktı"} },
    { id: "overtimeHours", label: "Fazla Mesai / Vardiya", label_i18n: {"en":"Overtime per Shift","tr":"Fazla Mesai / Vardiya"}, type: "number", unit: "saat", required: false, smartDefault: 1, validation: { min: 0 }, helper: "", expertMeaning: "Overtime hours per shift", expertMeaning_i18n: {"en":"Overtime hours per shift","tr":"Vardiya başına fazla mesai"} },
  ],
  outputs: [
    { id: "shiftTotalCost", label: "Toplam Vardiya Maliyeti", label_i18n: {"en":"Total Shift Cost","tr":"Toplam Vardiya Maliyeti"}, unit: "USD/gün", format: "currency" },
    { id: "shiftEfficiency", label: "Vardiya Verimliliği", label_i18n: {"en":"Shift Efficiency","tr":"Vardiya Verimliliği"}, unit: "%", format: "percentage" },
    { id: "shiftCostPerUnit", label: "Birim Başına Vardiya Maliyeti", label_i18n: {"en":"Shift Cost per Unit","tr":"Birim Başına Vardiya Maliyeti"}, unit: "USD/adet", format: "currency" },
    { id: "annualShiftCost", label: "Yıllık Vardiya Maliyeti", label_i18n: {"en":"Annual Shift Cost","tr":"Yıllık Vardiya Maliyeti"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "shiftCostPerUnit", warning: 5, critical: 10, direction: "higher_is_bad", warningMessage: "Birim maliyet > $5 — vardiya verimliliği iyileştirilmeli.", warningMessage_i18n: {"en":"Unit cost > $5 — improve shift efficiency.","tr":"Birim maliyet > $5 — vardiya verimliliği iyileştirilmeli."}, criticalMessage: "Birim maliyet > $10 — vardiya yapısı yeniden planlanmalı.", criticalMessage_i18n: {"en":"Unit cost > $10 — restructure shift plan.","tr":"Birim maliyet > $10 — vardiya yapısı yeniden planlanmalı."} },
    { fieldId: "shiftEfficiency", warning: 75, critical: 60, direction: "lower_is_bad", warningMessage: "Verimlilik < %75 — iş yükü dengelemesi önerilir.", warningMessage_i18n: {"en":"Efficiency < 75% — workload balancing recommended.","tr":"Verimlilik < %75 — iş yükü dengelemesi önerilir."}, criticalMessage: "Verimlilik < %60 — acil iyileştirme programı gerekli.", criticalMessage_i18n: {"en":"Efficiency < 60% — urgent improvement program needed.","tr":"Verimlilik < %60 — acil iyileştirme programı gerekli."} },
  ],
  formulaPipeline: [
    { formulaId: "cost.shift_total_cost", inputMap: { shiftCount: "shiftCount", workersPerShift: "workersPerShift", hourlyWage: "hourlyWage", shiftHours: "shiftHours", shiftPremium: "shiftPremium", overtimeHours: "overtimeHours" }, outputId: "shiftTotalCost" },
    { formulaId: "measurement.shift_efficiency", inputMap: { dailyOutput: "dailyOutput", shiftCount: "shiftCount", workersPerShift: "workersPerShift", shiftHours: "shiftHours" }, outputId: "shiftEfficiency" },
    { formulaId: "cost.shift_cost_per_unit", inputMap: { shiftTotalCost: "shiftTotalCost", dailyOutput: "dailyOutput" }, outputId: "shiftCostPerUnit" },
    { formulaId: "cost.annual_shift_cost", inputMap: { shiftTotalCost: "shiftTotalCost" }, outputId: "annualShiftCost" },
  ],
  reportTemplate: { title: "Vardiya Maliyet ve Verimlilik Raporu", title_i18n: {"en":"Shift Cost and Efficiency Report","tr":"Vardiya Maliyet ve Verimlilik Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 8, targetMarginPercent: 15, assumptionNotes: ["Vardiya zammı ikinci ve üçüncü vardiya için ortalama uygulanır.", "Verimlilik = çıktı / (işçi × saat) oranı üzerinden hesaplanır.", "Yıllık maliyet 240 iş günü baz alınarak hesaplanır."],assumptionNotes_i18n:[{"en":"Shift premium is applied on average for second and third shifts.","tr":"Vardiya zammı ikinci ve üçüncü vardiya için ortalama uygulanır."},{"en":"Efficiency is calculated based on output / (worker × hours) ratio.","tr":"Verimlilik = çıktı / (işçi × saat) oranı üzerinden hesaplanır."},{"en":"Annual cost is calculated based on 240 working days.","tr":"Yıllık maliyet 240 iş günü baz alınarak hesaplanır."}] },
};
