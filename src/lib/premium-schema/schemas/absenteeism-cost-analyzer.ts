/**
 * Tool #30 — Devamsızlık Maliyeti
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const ABSENTEEISM_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "absenteeism-cost-analyzer", legacyPaidSlug: "absenteeism-cost-analyzer",
  name: "Devamsızlık Maliyet Analizi", sectorSlug: "sheet-metal", category: "cost",
  painStatement: "Devamsızlığın gerçek maliyeti direkt işçiliğin çok ötesindedir; fazla mesai, geçici işçi, üretim kaybı ve idari yük eklenir.",
  inputs: [
    { id: "absentHours", label: "Toplam Kayıp Saat", type: "number", unit: "saat", required: true, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Total absentee hours" },
    { id: "hourlyRate", label: "Saatlik Ücret", type: "number", unit: "USD", required: true, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Average hourly wage" },
    { id: "burdenRate", label: "Yan Hak Oranı", type: "number", unit: "%", required: false, smartDefault: 30, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Burden rate percentage" },
    { id: "replaceOtHours", label: "Fazla Mesai Saati", type: "number", unit: "saat", required: false, smartDefault: 150, validation: { min: 0 }, helper: "", expertMeaning: "Overtime replacement hours" },
    { id: "regularRate", label: "Normal Saatlik Ücret", type: "number", unit: "USD", required: false, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Regular hourly rate" },
    { id: "otRate", label: "Fazla Mesai Ücreti", type: "number", unit: "USD", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Overtime hourly rate" },
    { id: "tempHours", label: "Geçici İşçi Saati", type: "number", unit: "saat", required: false, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "Temporary worker hours" },
    { id: "tempRate", label: "Geçici İşçi Ücreti", type: "number", unit: "USD", required: false, smartDefault: 18, validation: { min: 0 }, helper: "", expertMeaning: "Temp hourly rate" },
    { id: "tempMarkup", label: "Geçici İşçi Kar Marjı", type: "number", unit: "%", required: false, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Temp agency markup" },
    { id: "outputPerHour", label: "Saat Başına Çıktı", type: "number", unit: "birim/saat", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Output per hour per employee" },
    { id: "unitMargin", label: "Birim Kâr Marjı", type: "number", unit: "USD", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Profit margin per unit" },
    { id: "effDropPct", label: "Verim Düşüşü", type: "number", unit: "%", required: false, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Efficiency drop from replacements" },
    { id: "absentEvents", label: "Devamsızlık Olay Sayısı", type: "number", unit: "adet", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Number of absentee events" },
    { id: "hrTime", label: "İK İşlem Süresi", type: "number", unit: "saat", required: false, smartDefault: 1, validation: { min: 0 }, helper: "", expertMeaning: "HR processing hours per event" },
    { id: "hrRate", label: "İK Saatlik Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "HR hourly cost" },
  ],
  outputs: [
    { id: "directLaborLoss", label: "Direkt İşçilik Kaybı", unit: "USD", format: "currency" },
    { id: "prodLoss", label: "Üretim Kaybı", unit: "USD", format: "currency" },
    { id: "totalAbsenteeismCost", label: "Toplam Devamsızlık Maliyeti", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "totalAbsenteeismCost", warning: 25000, critical: 75000, direction: "higher_is_bad", warningMessage: "Maliyet > $25K — devamsızlık yönetimi programı başlatılmalı.", criticalMessage: "Maliyet > $75K — acil müdahale gerekiyor." }],
  formulaPipeline: [
    { formulaId: "cost.absenteeism_direct", inputMap: { absentHours: "absentHours", hourlyRate: "hourlyRate", burdenRate: "burdenRate" }, outputId: "directLaborLoss" },
    { formulaId: "cost.absenteeism_prod_loss", inputMap: { absentHours: "absentHours", outputPerHour: "outputPerHour", unitMargin: "unitMargin", effDropPct: "effDropPct" }, outputId: "prodLoss" },
    { formulaId: "cost.absenteeism_total", inputMap: { directCost: "directLaborLoss", otPremium: "replaceOtHours", tempCost: "tempHours", prodLoss: "prodLoss", adminCost: "absentEvents" }, outputId: "totalAbsenteeismCost" },
  ],
  reportTemplate: { title: "Absenteeism Cost Report", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Direct = AbsHours×Rate×(1+Burden%).", "Prod loss = AbsHours×Output×Margin×EffDrop."] },
};
