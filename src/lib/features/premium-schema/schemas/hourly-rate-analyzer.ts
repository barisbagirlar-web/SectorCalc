/**
 * Tool — Saatlik Ücret
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const HOURLY_RATE_ANALYZER: PremiumCalculatorSchema = {
  id: "hourly-rate-analyzer", legacyPaidSlug: "hourly-rate-analyzer",
  name: "Hourly Rate Analyzer", name_i18n: {"en":"Hourly Rate Analyzer"}, sectorSlug: "financial-planning", category: "cost",
  painStatement: "Çalışanın gerçek saatlik maliyeti brüt maaşın çok üzerindedir; yan haklar, vergiler ve dolaylı giderler hesaba katılmazsa fiyatlama zarar eder.", painStatement_i18n: {"en":"The employee's actual hourly cost is well above gross salary; if benefits, taxes, and indirect expenses are not accounted for, pricing incurs losses."},
  inputs: [
    { id: "grossSalary", label: "Gross monthly salary", label_i18n: {"en":"Gross monthly salary"}, type: "number", unit: "USD", required: true, smartDefault: 4000, validation: { min: 1 }, helper: "", expertMeaning: "Gross monthly salary", expertMeaning_i18n: {"en":"Gross monthly salary"} },
    { id: "employerTaxRate", label: "Employer tax & social security rate", label_i18n: {"en":"Employer tax & social security rate"}, type: "number", unit: "%", required: true, smartDefault: 22.5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Employer tax & social security rate", expertMeaning_i18n: {"en":"Employer tax & social security rate"} },
    { id: "benefitsCost", label: "Yan Hak Maliyeti", label_i18n: {"en":"Yan Hak Cost"}, type: "number", unit: "USD/ay", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Monthly benefits cost", expertMeaning_i18n: {"en":"Monthly benefits cost"} },
    { id: "overheadPct", label: "Indirect overhead allocation rate", label_i18n: {"en":"Indirect overhead allocation rate"}, type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Indirect overhead allocation rate", expertMeaning_i18n: {"en":"Indirect overhead allocation rate"} },
    { id: "billableHoursPerMonth", label: "Billable hours per month", label_i18n: {"en":"Billable hours per month"}, type: "number", unit: "saat", required: true, smartDefault: 140, validation: { min: 1 }, helper: "", expertMeaning: "Billable hours per month", expertMeaning_i18n: {"en":"Billable hours per month"} },
    { id: "bonusPct", label: "Annual bonus percentage", label_i18n: {"en":"Annual bonus percentage"}, type: "number", unit: "%", required: false, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Annual bonus percentage", expertMeaning_i18n: {"en":"Annual bonus percentage"} },
  ],
  outputs: [
    { id: "burdenedHourlyRate", label: "Toplam Yüklü Saatlik Ücret", label_i18n: {"en":"Total Yuklu Hourly Rate"}, unit: "USD/saat", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "burdenedHourlyRate", warning: 50, critical: 80, direction: "higher_is_bad", warningMessage: "Yüklü saatlik ücret >$50 — maliyet avantajı azalıyor.", warningMessage_i18n: {"en":"Loaded hourly rate >$50 — cost advantage is decreasing."}, criticalMessage: "Yüklü saatlik ücret >$80 — rekabetçi fiyatlama zorlaşır.", criticalMessage_i18n: {"en":"Loaded hourly rate >$80 — competitive pricing becomes difficult."} }],
  formulaPipeline: [
    { formulaId: "cost.burdened_hourly_rate", inputMap: {
        grossSalary: "grossSalary",
        employerTaxes: "employerTaxRate",
        benefits: "benefitsCost",
        productiveHours: "overheadPct",
        billableHoursPerMonth: "billableHoursPerMonth",
        bonusPct: "bonusPct"
      }, outputId: "burdenedHourlyRate" },
  ],
  reportTemplate: { title: "Saatlik Ücret Analiz Raporu", title_i18n: {"en":"Hourly Rate Analiz Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Yüklü saatlik ücret = (maaş + vergi + yan hak + genel gider + prim) / faturalanabilir saat.", "Vergi oranı işveren payı ve sosyal güvenlik primini içerir.", "Faturalanabilir saat aylık ortalama üzerinden hesaplanır."],assumptionNotes_i18n:[{"en":"Loaded hourly rate = (salary + tax + benefits + overhead + bonus) / billable hours."},{"en":"Tax rate includes employer contribution and social security premium."},{"en":"Billable hours are calculated based on monthly average."}] },
};
