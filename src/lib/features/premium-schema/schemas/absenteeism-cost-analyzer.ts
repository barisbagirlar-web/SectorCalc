/**
 * Tool #30 — Devamsızlık Maliyeti
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const ABSENTEEISM_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "absenteeism-cost-analyzer", legacyPaidSlug: "absenteeism-cost-analyzer",
  name: "Devamsızlık Maliyet Analizi", name_i18n: {"en":"Absenteeism Cost Analysis"}, sectorSlug: "sheet-metal", category: "cost",
  painStatement: "Devamsızlığın gerçek maliyeti direkt işçiliğin çok ötesindedir; fazla mesai, geçici işçi, üretim kaybı ve idari yük eklenir.", painStatement_i18n: {"en":"The true cost of absenteeism goes far beyond direct labor; overtime, temporary workers, production loss, and administrative burden add up."},
  inputs: [
    { id: "absentHours", label: "Toplam Kayıp Saat", label_i18n: {"en":"Total Lost Hours"}, type: "number", unit: "saat", required: true, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Total absentee hours", expertMeaning_i18n: {"en":"Total absentee hours"} },
    { id: "hourlyRate", label: "Saatlik Ücret", label_i18n: {"en":"Hourly Wage"}, type: "number", unit: "USD", required: true, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Average hourly wage", expertMeaning_i18n: {"en":"Average hourly wage"} },
    { id: "burdenRate", label: "Yan Hak Oranı", label_i18n: {"en":"Burden Rate"}, type: "number", unit: "%", required: false, smartDefault: 30, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Burden rate percentage", expertMeaning_i18n: {"en":"Burden rate percentage"} },
    { id: "replaceOtHours", label: "Fazla Mesai Saati", label_i18n: {"en":"Overtime Hours"}, type: "number", unit: "saat", required: false, smartDefault: 150, validation: { min: 0 }, helper: "", expertMeaning: "Overtime replacement hours", expertMeaning_i18n: {"en":"Overtime replacement hours"} },
    { id: "regularRate", label: "Normal Saatlik Ücret", label_i18n: {"en":"Regular Hourly Rate"}, type: "number", unit: "USD", required: false, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Regular hourly rate", expertMeaning_i18n: {"en":"Regular hourly rate"} },
    { id: "otRate", label: "Fazla Mesai Ücreti", label_i18n: {"en":"Overtime Rate"}, type: "number", unit: "USD", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Overtime hourly rate", expertMeaning_i18n: {"en":"Overtime hourly rate"} },
    { id: "tempHours", label: "Geçici İşçi Saati", label_i18n: {"en":"Temp Worker Hours"}, type: "number", unit: "saat", required: false, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "Temporary worker hours", expertMeaning_i18n: {"en":"Temporary worker hours"} },
    { id: "tempRate", label: "Geçici İşçi Ücreti", label_i18n: {"en":"Temp Worker Rate"}, type: "number", unit: "USD", required: false, smartDefault: 18, validation: { min: 0 }, helper: "", expertMeaning: "Temp hourly rate", expertMeaning_i18n: {"en":"Temp hourly rate"} },
    { id: "tempMarkup", label: "Geçici İşçi Kar Marjı", label_i18n: {"en":"Temp Agency Markup"}, type: "number", unit: "%", required: false, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Temp agency markup", expertMeaning_i18n: {"en":"Temp agency markup"} },
    { id: "outputPerHour", label: "Saat Başına Çıktı", label_i18n: {"en":"Output Per Hour"}, type: "number", unit: "birim/saat", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Output per hour per employee", expertMeaning_i18n: {"en":"Output per hour per employee"} },
    { id: "unitMargin", label: "Birim Kâr Marjı", label_i18n: {"en":"Unit Profit Margin"}, type: "number", unit: "USD", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Profit margin per unit", expertMeaning_i18n: {"en":"Profit margin per unit"} },
    { id: "effDropPct", label: "Verim Düşüşü", label_i18n: {"en":"Efficiency Drop"}, type: "number", unit: "%", required: false, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Efficiency drop from replacements", expertMeaning_i18n: {"en":"Efficiency drop from replacements"} },
    { id: "absentEvents", label: "Devamsızlık Olay Sayısı", label_i18n: {"en":"Absentee Event Count"}, type: "number", unit: "adet", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Number of absentee events", expertMeaning_i18n: {"en":"Number of absentee events"} },
    { id: "hrTime", label: "İK İşlem Süresi", label_i18n: {"en":"HR Processing Time"}, type: "number", unit: "saat", required: false, smartDefault: 1, validation: { min: 0 }, helper: "", expertMeaning: "HR processing hours per event", expertMeaning_i18n: {"en":"HR processing hours per event"} },
    { id: "hrRate", label: "İK Saatlik Maliyeti", label_i18n: {"en":"HR Hourly Cost"}, type: "number", unit: "USD", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "HR hourly cost", expertMeaning_i18n: {"en":"HR hourly cost"} },
  ],
  outputs: [
    { id: "directLaborLoss", label: "Direkt İşçilik Kaybı", label_i18n: {"en":"Direkt Iscilik Kayb"}, unit: "USD", format: "currency" },
    { id: "prodLoss", label: "Üretim Kaybı", label_i18n: {"en":"Uretim Kayb"}, unit: "USD", format: "currency" },
    { id: "totalAbsenteeismCost", label: "Toplam Devamsızlık Maliyeti", label_i18n: {"en":"Toplam Devamszlk Maliyeti"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "totalAbsenteeismCost", warning: 25000, critical: 75000, direction: "higher_is_bad", warningMessage: "Maliyet > $25K — devamsızlık yönetimi programı başlatılmalı.", warningMessage_i18n: {"en":"Maliyet > $25K — devamsızlık yönetimi programı başlatılmalı."}, criticalMessage: "Maliyet > $75K — acil müdahale gerekiyor.", criticalMessage_i18n: {"en":"Maliyet > $75K — acil müdahale gerekiyor."} }],
  formulaPipeline: [
    { formulaId: "cost.absenteeism_direct", inputMap: {
        absentHours: "absentHours",
        hourlyRate: "hourlyRate",
        burden: "burdenRate"
      }, outputId: "directLaborLoss" },
    { formulaId: "cost.absenteeism_prod_loss", inputMap: {
        absentHours: "absentHours",
        outputPerHour: "outputPerHour",
        margin: "unitMargin",
        effDrop: "effDropPct"
      }, outputId: "prodLoss" },
    { formulaId: "cost.absenteeism_total", inputMap: { directCost: "directLaborLoss", otPremium: "replaceOtHours", tempCost: "tempHours", prodLoss: "prodLoss", adminCost: "absentEvents" }, outputId: "totalAbsenteeismCost" },
  ],
  reportTemplate: { title: "Absenteeism Cost Report", title_i18n: {"en":"Absenteeism Cost Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Direct = AbsHours×Rate×(1+Burden%).", "Prod loss = AbsHours×Output×Margin×EffDrop."],assumptionNotes_i18n:[{"en":"Direct = AbsHours×Rate×(1+Burden%)."},{"en":"Prod loss = AbsHours×Output×Margin×EffDrop."}]},
};
