/**
 * Tool #30 — Devamsızlık Maliyeti
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const ABSENTEEISM_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "absenteeism-cost-analyzer", legacyPaidSlug: "absenteeism-cost-analyzer",
  name: "Devamsızlık Maliyet Analizi", name_i18n: {"en":"Absenteeism Cost Analysis","tr":"Devamsızlık Maliyet Analizi"}, sectorSlug: "sheet-metal", category: "cost",
  painStatement: "Devamsızlığın gerçek maliyeti direkt işçiliğin çok ötesindedir; fazla mesai, geçici işçi, üretim kaybı ve idari yük eklenir.", painStatement_i18n: {"en":"The true cost of absenteeism goes far beyond direct labor; overtime, temporary workers, production loss, and administrative burden add up.","tr":"Devamsızlığın gerçek maliyeti direkt işçiliğin çok ötesindedir; fazla mesai, geçici işçi, üretim kaybı ve idari yük eklenir."},
  inputs: [
    { id: "absentHours", label: "Toplam Kayıp Saat", label_i18n: {"en":"Total Lost Hours","tr":"Toplam Kayıp Saat"}, type: "number", unit: "saat", required: true, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Total absentee hours", expertMeaning_i18n: {"en":"Total absentee hours","tr":"Toplam devamsızlık saati"} },
    { id: "hourlyRate", label: "Saatlik Ücret", label_i18n: {"en":"Hourly Wage","tr":"Saatlik Ücret"}, type: "number", unit: "USD", required: true, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Average hourly wage", expertMeaning_i18n: {"en":"Average hourly wage","tr":"Ortalama saatlik ücret"} },
    { id: "burdenRate", label: "Yan Hak Oranı", label_i18n: {"en":"Burden Rate","tr":"Yan Hak Oranı"}, type: "number", unit: "%", required: false, smartDefault: 30, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Burden rate percentage", expertMeaning_i18n: {"en":"Burden rate percentage","tr":"Yan hak oranı yüzdesi"} },
    { id: "replaceOtHours", label: "Fazla Mesai Saati", label_i18n: {"en":"Overtime Hours","tr":"Fazla Mesai Saati"}, type: "number", unit: "saat", required: false, smartDefault: 150, validation: { min: 0 }, helper: "", expertMeaning: "Overtime replacement hours", expertMeaning_i18n: {"en":"Overtime replacement hours","tr":"Fazla mesai karşılama saati"} },
    { id: "regularRate", label: "Normal Saatlik Ücret", label_i18n: {"en":"Regular Hourly Rate","tr":"Normal Saatlik Ücret"}, type: "number", unit: "USD", required: false, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Regular hourly rate", expertMeaning_i18n: {"en":"Regular hourly rate","tr":"Normal saatlik ücret"} },
    { id: "otRate", label: "Fazla Mesai Ücreti", label_i18n: {"en":"Overtime Rate","tr":"Fazla Mesai Ücreti"}, type: "number", unit: "USD", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Overtime hourly rate", expertMeaning_i18n: {"en":"Overtime hourly rate","tr":"Fazla mesai saat ücreti"} },
    { id: "tempHours", label: "Geçici İşçi Saati", label_i18n: {"en":"Temp Worker Hours","tr":"Geçici İşçi Saati"}, type: "number", unit: "saat", required: false, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "Temporary worker hours", expertMeaning_i18n: {"en":"Temporary worker hours","tr":"Geçici işçi saati"} },
    { id: "tempRate", label: "Geçici İşçi Ücreti", label_i18n: {"en":"Temp Worker Rate","tr":"Geçici İşçi Ücreti"}, type: "number", unit: "USD", required: false, smartDefault: 18, validation: { min: 0 }, helper: "", expertMeaning: "Temp hourly rate", expertMeaning_i18n: {"en":"Temp hourly rate","tr":"Geçici işçi saat ücreti"} },
    { id: "tempMarkup", label: "Geçici İşçi Kar Marjı", label_i18n: {"en":"Temp Agency Markup","tr":"Geçici İşçi Kar Marjı"}, type: "number", unit: "%", required: false, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Temp agency markup", expertMeaning_i18n: {"en":"Temp agency markup","tr":"Geçici işçi acente kar marjı"} },
    { id: "outputPerHour", label: "Saat Başına Çıktı", label_i18n: {"en":"Output Per Hour","tr":"Saat Başına Çıktı"}, type: "number", unit: "birim/saat", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Output per hour per employee", expertMeaning_i18n: {"en":"Output per hour per employee","tr":"Çalışan başına saatlik çıktı"} },
    { id: "unitMargin", label: "Birim Kâr Marjı", label_i18n: {"en":"Unit Profit Margin","tr":"Birim Kâr Marjı"}, type: "number", unit: "USD", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Profit margin per unit", expertMeaning_i18n: {"en":"Profit margin per unit","tr":"Birim kâr marjı"} },
    { id: "effDropPct", label: "Verim Düşüşü", label_i18n: {"en":"Efficiency Drop","tr":"Verim Düşüşü"}, type: "number", unit: "%", required: false, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Efficiency drop from replacements", expertMeaning_i18n: {"en":"Efficiency drop from replacements","tr":"Yedeklerden kaynaklı verim düşüşü"} },
    { id: "absentEvents", label: "Devamsızlık Olay Sayısı", label_i18n: {"en":"Absentee Event Count","tr":"Devamsızlık Olay Sayısı"}, type: "number", unit: "adet", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Number of absentee events", expertMeaning_i18n: {"en":"Number of absentee events","tr":"Devamsızlık olay sayısı"} },
    { id: "hrTime", label: "İK İşlem Süresi", label_i18n: {"en":"HR Processing Time","tr":"İK İşlem Süresi"}, type: "number", unit: "saat", required: false, smartDefault: 1, validation: { min: 0 }, helper: "", expertMeaning: "HR processing hours per event", expertMeaning_i18n: {"en":"HR processing hours per event","tr":"Olay başına İK işlem süresi"} },
    { id: "hrRate", label: "İK Saatlik Maliyeti", label_i18n: {"en":"HR Hourly Cost","tr":"İK Saatlik Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "HR hourly cost", expertMeaning_i18n: {"en":"HR hourly cost","tr":"İK saatlik maliyeti"} },
  ],
  outputs: [
    { id: "directLaborLoss", label: "Direkt İşçilik Kaybı", label_i18n: {"en":"Direkt Iscilik Kayb","tr":"Direkt İşçilik Kaybı"}, unit: "USD", format: "currency" },
    { id: "prodLoss", label: "Üretim Kaybı", label_i18n: {"en":"Uretim Kayb","tr":"Üretim Kaybı"}, unit: "USD", format: "currency" },
    { id: "totalAbsenteeismCost", label: "Toplam Devamsızlık Maliyeti", label_i18n: {"en":"Toplam Devamszlk Maliyeti","tr":"Toplam Devamsızlık Maliyeti"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "totalAbsenteeismCost", warning: 25000, critical: 75000, direction: "higher_is_bad", warningMessage: "Maliyet > $25K — devamsızlık yönetimi programı başlatılmalı.", warningMessage_i18n: {"en":"Maliyet > $25K — devamsızlık yönetimi programı başlatılmalı.","tr":"Maliyet > $25K — devamsızlık yönetimi programı başlatılmalı."}, criticalMessage: "Maliyet > $75K — acil müdahale gerekiyor.", criticalMessage_i18n: {"en":"Maliyet > $75K — acil müdahale gerekiyor.","tr":"Maliyet > $75K — acil müdahale gerekiyor."} }],
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
  reportTemplate: { title: "Absenteeism Cost Report", title_i18n: {"en":"Absenteeism Cost Report","tr":"Absenteeism Cost Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Direct = AbsHours×Rate×(1+Burden%).", "Prod loss = AbsHours×Output×Margin×EffDrop."],assumptionNotes_i18n:[{"en":"Direct = AbsHours×Rate×(1+Burden%).","tr":"Direct = AbsHours×Rate×(1+Burden%)."},{"en":"Prod loss = AbsHours×Output×Margin×EffDrop.","tr":"Prod loss = AbsHours×Output×Margin×EffDrop."}]},
};
