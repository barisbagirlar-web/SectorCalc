/**
 * Tool — Saatlik Ücret
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const HOURLY_RATE_ANALYZER: PremiumCalculatorSchema = {
  id: "hourly-rate-analyzer", legacyPaidSlug: "hourly-rate-analyzer",
  name: "Saatlik Ücret Analizi", name_i18n: {"en":"Saatlik ucret Analizi","tr":"Saatlik Ücret Analizi"}, sectorSlug: "financial-planning", category: "cost",
  painStatement: "Çalışanın gerçek saatlik maliyeti brüt maaşın çok üzerindedir; yan haklar, vergiler ve dolaylı giderler hesaba katılmazsa fiyatlama zarar eder.", painStatement_i18n: {"en":"Çalışanın gerçek saatlik maliyeti brüt maaşın çok üzerindedir; yan haklar, vergiler ve dolaylı giderler hesaba katılmazsa fiyatlama zarar eder.","tr":"Çalışanın gerçek saatlik maliyeti brüt maaşın çok üzerindedir; yan haklar, vergiler ve dolaylı giderler hesaba katılmazsa fiyatlama zarar eder."},
  inputs: [
    { id: "grossSalary", label: "Brüt Aylık Maaş", label_i18n: {"en":"Gross monthly salary","tr":"Brüt Aylık Maaş"}, type: "number", unit: "USD", required: true, smartDefault: 4000, validation: { min: 1 }, helper: "", expertMeaning: "Gross monthly salary", expertMeaning_i18n: {"en":"Gross monthly salary","tr":"brüt aylık maaş"} },
    { id: "employerTaxRate", label: "İşveren Vergi Oranı", label_i18n: {"en":"Employer tax & social security rate","tr":"İşveren Vergi Oranı"}, type: "number", unit: "%", required: true, smartDefault: 22.5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Employer tax & social security rate", expertMeaning_i18n: {"en":"Employer tax & social security rate","tr":"i̇şveren vergi oranı"} },
    { id: "benefitsCost", label: "Yan Hak Maliyeti", label_i18n: {"en":"Yan Hak Maliyeti","tr":"Yan Hak Maliyeti"}, type: "number", unit: "USD/ay", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Monthly benefits cost", expertMeaning_i18n: {"en":"Monthly benefits cost","tr":"Monthly benefits cost"} },
    { id: "overheadPct", label: "Genel Gider Oranı", label_i18n: {"en":"Indirect overhead allocation rate","tr":"Genel Gider Oranı"}, type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Indirect overhead allocation rate", expertMeaning_i18n: {"en":"Indirect overhead allocation rate","tr":"genel gider oranı"} },
    { id: "billableHoursPerMonth", label: "Aylık Faturalanabilir Saat", label_i18n: {"en":"Billable hours per month","tr":"Aylık Faturalanabilir Saat"}, type: "number", unit: "saat", required: true, smartDefault: 140, validation: { min: 1 }, helper: "", expertMeaning: "Billable hours per month", expertMeaning_i18n: {"en":"Billable hours per month","tr":"aylık faturalanabilir saat"} },
    { id: "bonusPct", label: "Prim Oranı", label_i18n: {"en":"Annual bonus percentage","tr":"Prim Oranı"}, type: "number", unit: "%", required: false, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Annual bonus percentage", expertMeaning_i18n: {"en":"Annual bonus percentage","tr":"prim oranı"} },
  ],
  outputs: [
    { id: "burdenedHourlyRate", label: "Toplam Yüklü Saatlik Ücret", label_i18n: {"en":"Toplam Yuklu Saatlik Ucret","tr":"Toplam Yüklü Saatlik Ücret"}, unit: "USD/saat", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "burdenedHourlyRate", warning: 50, critical: 80, direction: "higher_is_bad", warningMessage: "Yüklü saatlik ücret >$50 — maliyet avantajı azalıyor.", warningMessage_i18n: {"en":"Yüklü saatlik ücret >$50 — maliyet avantajı azalıyor.","tr":"Yüklü saatlik ücret >$50 — maliyet avantajı azalıyor."}, criticalMessage: "Yüklü saatlik ücret >$80 — rekabetçi fiyatlama zorlaşır.", criticalMessage_i18n: {"en":"Yüklü saatlik ücret >$80 — rekabetçi fiyatlama zorlaşır.","tr":"Yüklü saatlik ücret >$80 — rekabetçi fiyatlama zorlaşır."} }],
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
  reportTemplate: { title: "Saatlik Ücret Analiz Raporu", title_i18n: {"en":"Saatlik Ücret Analiz Raporu","tr":"Saatlik Ücret Analiz Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Yüklü saatlik ücret = (maaş + vergi + yan hak + genel gider + prim) / faturalanabilir saat.", "Vergi oranı işveren payı ve sosyal güvenlik primini içerir.", "Faturalanabilir saat aylık ortalama üzerinden hesaplanır."],assumptionNotes_i18n:[{"en":"Yüklü saatlik ücret = (maaş + vergi + yan hak + genel gider + prim) / faturalanabilir saat.","tr":"Yüklü saatlik ücret = (maaş + vergi + yan hak + genel gider + prim) / faturalanabilir saat."},{"en":"Vergi oranı işveren payı ve sosyal güvenlik primini içerir.","tr":"Vergi oranı işveren payı ve sosyal güvenlik primini içerir."},{"en":"Faturalanabilir saat aylık ortalama üzerinden hesaplanır.","tr":"Faturalanabilir saat aylık ortalama üzerinden hesaplanır."}] },
};
