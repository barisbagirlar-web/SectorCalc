/**
 * Tool #29 — Overtime vs Hiring Başabaş
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const OVERTIME_HIRING_BREAKEVEN_SCHEMA: PremiumCalculatorSchema = {
  id: "overtime-hiring-breakeven-analyzer", legacyPaidSlug: "overtime-hiring-breakeven-analyzer",
  name: "Fazla Mesai vs İşe Alma Başabaş", name_i18n: {"en":"Overtime vs Hiring Breakeven Analysis","tr":"Fazla Mesai vs İşe Alma Başabaş"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Fazla mesai mi yoksa yeni işçi mi daha avantajlı? Yanlış karar üretim maliyetini şişirir ve kârlılığı düşürür.", painStatement_i18n: {"en":"Is overtime or a new hire more advantageous? The wrong decision inflates production costs and reduces profitability.","tr":"Fazla mesai mi yoksa yeni işçi mi daha avantajlı? Yanlış karar üretim maliyetini şişirir ve kârlılığı düşürür."},
  inputs: [
    { id: "overtimeRate", label: "Fazla Mesai Saat Ücreti", label_i18n: {"en":"Hourly overtime premium rate","tr":"Fazla Mesai Saat Ücreti"}, type: "number", unit: "USD/saat", required: true, smartDefault: 30, validation: { min: 1 }, helper: "", expertMeaning: "Hourly overtime premium rate", expertMeaning_i18n: {"en":"Hourly overtime premium rate","tr":"Fazla Mesai Saat Ücreti"} },
    { id: "hiringCost", label: "İşe Alma Maliyeti", label_i18n: {"en":"Total hiring cost per worker","tr":"İşe Alma Maliyeti"}, type: "number", unit: "USD", required: true, smartDefault: 3500, validation: { min: 1 }, helper: "", expertMeaning: "Total hiring cost per worker", expertMeaning_i18n: {"en":"Total hiring cost per worker","tr":"İşe Alma Maliyeti"} },
    { id: "annualSalary", label: "Yıllık Brüt Maaş", label_i18n: {"en":"Annual gross salary per hire","tr":"Yıllık Brüt Maaş"}, type: "number", unit: "USD/yıl", required: true, smartDefault: 42000, validation: { min: 1 }, helper: "", expertMeaning: "Annual gross salary per hire", expertMeaning_i18n: {"en":"Annual gross salary per hire","tr":"Yıllık Brüt Maaş"} },
    { id: "overtimeHoursPerMonth", label: "Aylık Fazla Mesai Saati", label_i18n: {"en":"Monthly overtime hours per worker","tr":"Aylık Fazla Mesai Saati"}, type: "number", unit: "saat/ay", required: true, smartDefault: 40, validation: { min: 1 }, helper: "", expertMeaning: "Monthly overtime hours per worker", expertMeaning_i18n: {"en":"Monthly overtime hours per worker","tr":"Aylık Fazla Mesai Saati"} },
    { id: "qualityDefectRate", label: "Kalite Hata Oranı Farkı", label_i18n: {"en":"Additional defect rate from overtime","tr":"Kalite Hata Oranı Farkı"}, type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Additional defect rate from overtime", expertMeaning_i18n: {"en":"Additional defect rate from overtime","tr":"Kalite Hata Oranı Farkı"} },
  ],
  outputs:  [
    { id: "otCostHour", label: "Fazla Mesai Birim Maliyeti", label_i18n: {"en":"Overtime Unit Cost","tr":"Fazla Mesai Birim Maliyeti"}, unit: "USD/saat", format: "currency" },
    { id: "hiringTotalCost", label: "Toplam İşe Alma Maliyeti", label_i18n: {"en":"Total Hiring Cost","tr":"Toplam İşe Alma Maliyeti"}, unit: "USD", format: "currency" },
    { id: "annualNewHireCost", label: "Yıllık Yeni İşçi Maliyeti", label_i18n: {"en":"Annual New Hire Cost","tr":"Yıllık Yeni İşçi Maliyeti"}, unit: "USD/yıl", format: "currency" },
    { id: "breakevenHours", label: "Başabaş Eşik Saati", label_i18n: {"en":"Breakeven Threshold Hours","tr":"Başabaş Eşik Saati"}, unit: "saat/ay", format: "number", isBigNumber: true },
    { id: "otHireDecision", label: "Karar", label_i18n: {"en":"Decision","tr":"Karar"}, unit: "", format: "score" },
  ],
  thresholds: [{ fieldId: "breakevenHours", warning: 40, critical: 80, direction: "higher_is_bad", warningMessage: "Eşik > 40 saat — yeni işçi değerlendirilmeli.", warningMessage_i18n: {"en":"Threshold > 40 hours — new hire should be evaluated.","tr":"Eşik > 40 saat — yeni işçi değerlendirilmeli."}, criticalMessage: "Eşik > 80 saat — yeni işçi kaçınılmaz.", criticalMessage_i18n: {"en":"Threshold > 80 hours — new hire is inevitable.","tr":"Eşik > 80 saat — yeni işçi kaçınılmaz."} }],
  formulaPipeline: [
    { formulaId: "cost.ot_cost_hour", inputMap: { overtimeRate: "overtimeRate", qualityDefectRate: "qualityDefectRate" }, outputId: "otCostHour" },
    { formulaId: "cost.hiring_total_cost", inputMap: { hiringCost: "hiringCost" }, outputId: "hiringTotalCost" },
    { formulaId: "cost.annual_new_hire_cost", inputMap: { annualSalary: "annualSalary", hiringTotalCost: "hiringTotalCost" }, outputId: "annualNewHireCost" },
    { formulaId: "measurement.breakeven_hours_base", inputMap: { annualNewHireCost: "annualNewHireCost", otCostHour: "otCostHour" }, outputId: "breakevenHours" },
    { formulaId: "measurement.ot_hire_decision", inputMap: { overtimeHoursPerMonth: "overtimeHoursPerMonth", breakevenHours: "breakevenHours" }, outputId: "otHireDecision" },
  ],
  reportTemplate: { title: "Overtime vs Hiring Report", title_i18n: {"en":"Overtime vs Hiring Report","tr":"Overtime vs Hiring Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["OT maliyeti = saat ücreti × 1.5 + kalite etkisi.", "İşe alma maliyeti: ilan, mülakat, eğitim, kayıp verim.", "Yıllık maliyet = maaş + işe alma amortismanı.", "Başabaş = yıllık maliyet / OT birim maliyet / 12."],assumptionNotes_i18n:[{"en":"OT cost = hourly rate × 1.5 + quality effect.","tr":"OT maliyeti = saat ücreti × 1.5 + kalite etkisi."},{"en":"Hiring cost: posting, interview, training, lost productivity.","tr":"İşe alma maliyeti: ilan, mülakat, eğitim, kayıp verim."},{"en":"Annual cost = salary + hiring amortization.","tr":"Yıllık maliyet = maaş + işe alma amortismanı."},{"en":"Breakeven = annual cost / OT unit cost / 12.","tr":"Başabaş = yıllık maliyet / OT birim maliyet / 12."}] },
};
