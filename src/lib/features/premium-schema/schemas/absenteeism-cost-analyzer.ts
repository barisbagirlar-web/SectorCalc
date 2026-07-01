/**
 * Tool #30 — Devamsızlık Maliyeti
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const ABSENTEEISM_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "absenteeism-cost-analyzer", legacyPaidSlug: "absenteeism-cost-analyzer",
  name: "Absenteeism Cost Analysis", name_i18n: {"en":"Absenteeism Cost Analysis"}, sectorSlug: "sheet-metal", category: "cost",
  painStatement: "The true cost of absenteeism goes far beyond direct labor; overtime, temporary workers, production loss, and administrative burden add up.", painStatement_i18n: {"en":"The true cost of absenteeism goes far beyond direct labor; overtime, temporary workers, production loss, and administrative burden add up."},
  inputs: [
    { id: "absentHours", label: "Total Lost Hours", label_i18n: {"en":"Total Lost Hours"}, type: "number", unit: "saat", required: true, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Total absentee hours", expertMeaning_i18n: {"en":"Total absentee hours"} },
    { id: "hourlyRate", label: "Saatlik Ücret", label_i18n: {"en":"Hourly Wage"}, type: "number", unit: "USD", required: true, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Average hourly wage", expertMeaning_i18n: {"en":"Average hourly wage"} },
    { id: "burdenRate", label: "Burden Rate", label_i18n: {"en":"Burden Rate"}, type: "number", unit: "%", required: false, smartDefault: 30, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Burden rate percentage", expertMeaning_i18n: {"en":"Burden rate percentage"} },
    { id: "replaceOtHours", label: "Fazla Mesai Saati", label_i18n: {"en":"Overtime Hours"}, type: "number", unit: "saat", required: false, smartDefault: 150, validation: { min: 0 }, helper: "", expertMeaning: "Overtime replacement hours", expertMeaning_i18n: {"en":"Overtime replacement hours"} },
    { id: "regularRate", label: "Normal Saatlik Ücret", label_i18n: {"en":"Regular Hourly Rate"}, type: "number", unit: "USD", required: false, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Regular hourly rate", expertMeaning_i18n: {"en":"Regular hourly rate"} },
    { id: "otRate", label: "Fazla Mesai Ücreti", label_i18n: {"en":"Overtime Rate"}, type: "number", unit: "USD", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "Overtime hourly rate", expertMeaning_i18n: {"en":"Overtime hourly rate"} },
    { id: "tempHours", label: "Temp Worker Hours", label_i18n: {"en":"Temp Worker Hours"}, type: "number", unit: "saat", required: false, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "Temporary worker hours", expertMeaning_i18n: {"en":"Temporary worker hours"} },
    { id: "tempRate", label: "Temp Worker Rate", label_i18n: {"en":"Temp Worker Rate"}, type: "number", unit: "USD", required: false, smartDefault: 18, validation: { min: 0 }, helper: "", expertMeaning: "Temp hourly rate", expertMeaning_i18n: {"en":"Temp hourly rate"} },
    { id: "tempMarkup", label: "Temp Agency Markup", label_i18n: {"en":"Temp Agency Markup"}, type: "number", unit: "%", required: false, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Temp agency markup", expertMeaning_i18n: {"en":"Temp agency markup"} },
    { id: "outputPerHour", label: "Output Per Hour", label_i18n: {"en":"Output Per Hour"}, type: "number", unit: "birim/saat", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Output per hour per employee", expertMeaning_i18n: {"en":"Output per hour per employee"} },
    { id: "unitMargin", label: "Unit Profit Margin", label_i18n: {"en":"Unit Profit Margin"}, type: "number", unit: "USD", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Profit margin per unit", expertMeaning_i18n: {"en":"Profit margin per unit"} },
    { id: "effDropPct", label: "Efficiency Drop", label_i18n: {"en":"Efficiency Drop"}, type: "number", unit: "%", required: false, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Efficiency drop from replacements", expertMeaning_i18n: {"en":"Efficiency drop from replacements"} },
    { id: "absentEvents", label: "Absentee Event Count", label_i18n: {"en":"Absentee Event Count"}, type: "number", unit: "adet", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Number of absentee events", expertMeaning_i18n: {"en":"Number of absentee events"} },
    { id: "hrTime", label: "HR Processing Time", label_i18n: {"en":"HR Processing Time"}, type: "number", unit: "saat", required: false, smartDefault: 1, validation: { min: 0 }, helper: "", expertMeaning: "HR processing hours per event", expertMeaning_i18n: {"en":"HR processing hours per event"} },
    { id: "hrRate", label: "HR Hourly Cost", label_i18n: {"en":"HR Hourly Cost"}, type: "number", unit: "USD", required: false, smartDefault: 30, validation: { min: 0 }, helper: "", expertMeaning: "HR hourly cost", expertMeaning_i18n: {"en":"HR hourly cost"} },
  ],
  outputs: [
    { id: "directLaborLoss", label: "Direct Labor Loss", label_i18n: {"en":"Direct Labor Loss"}, unit: "USD", format: "currency" },
    { id: "prodLoss", label: "Production Loss", label_i18n: {"en":"Production Loss"}, unit: "USD", format: "currency" },
    { id: "totalAbsenteeismCost", label: "Total Absenteeism Cost", label_i18n: {"en":"Total Absenteeism Cost"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "totalAbsenteeismCost", warning: 25000, critical: 75000, direction: "higher_is_bad", warningMessage: "Maliyet > $25K — devamsızlık yönetimi programı başlatılmalı.", warningMessage_i18n: {"en":"Cost > $25K — devamsızlık yönetimi program başlatılmalı."}, criticalMessage: "Maliyet > $75K — acil müdahale gerekiyor.", criticalMessage_i18n: {"en":"Cost > $75K — urgent intervention gerekiyor."} }],
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
