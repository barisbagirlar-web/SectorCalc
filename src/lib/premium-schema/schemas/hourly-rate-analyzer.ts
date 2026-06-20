/**
 * Tool — Saatlik Ücret
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const HOURLY_RATE_ANALYZER: PremiumCalculatorSchema = {
  id: "hourly-rate-analyzer", legacyPaidSlug: "hourly-rate-analyzer",
  name: "Saatlik Ücret Analizi", sectorSlug: "financial-planning", category: "cost",
  painStatement: "Çalışanın gerçek saatlik maliyeti brüt maaşın çok üzerindedir; yan haklar, vergiler ve dolaylı giderler hesaba katılmazsa fiyatlama zarar eder.",
  inputs: [
    { id: "grossSalary", label: "Brüt Aylık Maaş", type: "number", unit: "USD", required: true, smartDefault: 4000, validation: { min: 1 }, helper: "", expertMeaning: "Gross monthly salary" },
    { id: "employerTaxRate", label: "İşveren Vergi Oranı", type: "number", unit: "%", required: true, smartDefault: 22.5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Employer tax & social security rate" },
    { id: "benefitsCost", label: "Yan Hak Maliyeti", type: "number", unit: "USD/ay", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Monthly benefits cost" },
    { id: "overheadPct", label: "Genel Gider Oranı", type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Indirect overhead allocation rate" },
    { id: "billableHoursPerMonth", label: "Aylık Faturalanabilir Saat", type: "number", unit: "saat", required: true, smartDefault: 140, validation: { min: 1 }, helper: "", expertMeaning: "Billable hours per month" },
    { id: "bonusPct", label: "Prim Oranı", type: "number", unit: "%", required: false, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Annual bonus percentage" },
  ],
  outputs: [
    { id: "burdenedHourlyRate", label: "Toplam Yüklü Saatlik Ücret", unit: "USD/saat", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "burdenedHourlyRate", warning: 50, critical: 80, direction: "higher_is_bad", warningMessage: "Yüklü saatlik ücret >$50 — maliyet avantajı azalıyor.", criticalMessage: "Yüklü saatlik ücret >$80 — rekabetçi fiyatlama zorlaşır." }],
  formulaPipeline: [
    { formulaId: "cost.burdened_hourly_rate", inputMap: { grossSalary: "grossSalary", employerTaxRate: "employerTaxRate", benefitsCost: "benefitsCost", overheadPct: "overheadPct", billableHoursPerMonth: "billableHoursPerMonth", bonusPct: "bonusPct" }, outputId: "burdenedHourlyRate" },
  ],
  reportTemplate: { title: "Saatlik Ücret Analiz Raporu", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Yüklü saatlik ücret = (maaş + vergi + yan hak + genel gider + prim) / faturalanabilir saat.", "Vergi oranı işveren payı ve sosyal güvenlik primini içerir.", "Faturalanabilir saat aylık ortalama üzerinden hesaplanır."] },
};
