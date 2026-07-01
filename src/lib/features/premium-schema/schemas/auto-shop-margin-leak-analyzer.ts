/**
 * Tool #8 — Auto Shop Marj Kacak (Margin Leak)
 * EffectiveLaborRate → NetMargin → AnnualLeakage
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const AUTO_SHOP_MARGIN_LEAK_SCHEMA: PremiumCalculatorSchema = {
  id: "auto-shop-margin-leak-analyzer", legacyPaidSlug: "auto-shop-margin-leak-analyzer",
  name: "Auto Shop Margin Leak Analysis", name_i18n: {"en":"Auto Shop Margin Leak Analysis"}, sectorSlug: "auto-repair", category: "cost",
  painStatement: "Oto servislerde parca ve iscilik marjindaki kucuk sapmalar yillik yuz binlerce dolarlik kacaga donusur. Bu arac marj structureni analiz eder ve yillik kacagi hesaplar.", painStatement_i18n: {"en":"Small deviations in Parts and labor margin in auto repair shops turn into annual leakage of hundreds of thousands of dollars. This tool analyzes Margin structure and calculates annual leakage."},
  inputs: [
    { id: "monthlyPartsRevenue", label: "Monthly Parts Revenue", label_i18n: {"en":"Monthly Parts Revenue"}, type: "number", unit: "USD", required: true, smartDefault: 40000, validation: { min: 0 }, helper: "", expertMeaning: "Parts revenue per month", expertMeaning_i18n: {"en":"Parts revenue per month"} },
    { id: "monthlyLaborRevenue", label: "Monthly Labor Revenue", label_i18n: {"en":"Monthly Labor Revenue"}, type: "number", unit: "USD", required: true, smartDefault: 60000, validation: { min: 0 }, helper: "", expertMeaning: "Labor revenue per month", expertMeaning_i18n: {"en":"Labor revenue per month"} },
    { id: "partsCogs", label: "Parts COGS", label_i18n: {"en":"Parts COGS"}, type: "number", unit: "USD", required: true, smartDefault: 28000, validation: { min: 0 }, helper: "", expertMeaning: "Parts cost of goods sold", expertMeaning_i18n: {"en":"Parts cost of goods sold"} },
    { id: "laborCost", label: "Labor Cost", label_i18n: {"en":"Labor Cost"}, type: "number", unit: "USD", required: true, smartDefault: 36000, validation: { min: 0 }, helper: "", expertMeaning: "Direct labor cost", expertMeaning_i18n: {"en":"Direct labor cost"} },
    { id: "inventoryShrinkage", label: "Envanter Fire", label_i18n: {"en":"Inventory Shrinkage"}, type: "number", unit: "USD", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Inventory shrinkage/loss", expertMeaning_i18n: {"en":"Inventory shrinkage/loss"} },
    { id: "totalFlagHours", label: "Flag Saatleri", label_i18n: {"en":"Flag Hours"}, type: "number", unit: "saat", required: true, smartDefault: 800, validation: { min: 0 }, helper: "", expertMeaning: "Total billed hours", expertMeaning_i18n: {"en":"Total billed hours"} },
    { id: "totalAvailableHours", label: "Mevcut Saatler", label_i18n: {"en":"Available Hours"}, type: "number", unit: "saat", required: false, smartDefault: 1000, validation: { min: 0 }, helper: "", expertMeaning: "Total available technician hours", expertMeaning_i18n: {"en":"Total available technician hours"} },
    { id: "totalOpEx", label: "Toplam OpEx", label_i18n: {"en":"Total OpEx"}, type: "number", unit: "USD", required: false, smartDefault: 35000, validation: { min: 0 }, helper: "", expertMeaning: "Total operating expenses", expertMeaning_i18n: {"en":"Total operating expenses"} },
    { id: "industryBenchmarkMargin", label: "Industry Benchmark Margin", label_i18n: {"en":"Industry Benchmark Margin"}, type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Industry average net margin", expertMeaning_i18n: {"en":"Industry average Net margin"} },
    { id: "monthlyDiscounts", label: "Monthly Discounts", label_i18n: {"en":"Monthly Discounts"}, type: "number", unit: "USD", required: false, smartDefault: 3000, validation: { min: 0 }, helper: "", expertMeaning: "Total discounts given", expertMeaning_i18n: {"en":"Total discounts given"} },
    { id: "netMarginInput", label: "Net Marj (%)", label_i18n: {"en":"Net Margin (%)"}, type: "number", unit: "%", required: true, smartDefault: 8, validation: { min: 0, max: 100 }, helper: "Mevcut net kâr marjiniz.", helper_i18n: {"en":"Your current net profit margin."}, expertMeaning: "Current net profit margin percentage", expertMeaning_i18n: {"en":"Current Net profit margin percentage"} },
  ],
  outputs: [
    { id: "grossMarginParts", label: "Parts Gross Margin", label_i18n: {"en":"Parts Gross Margin"}, unit: "%", format: "percentage" },
    { id: "effectiveLaborRate", label: "Effective Labor Rate", label_i18n: {"en":"Effective Labor Rate"}, unit: "USD/saat", format: "currency" },
    { id: "netMargin", label: "Net Marj", label_i18n: {"en":"Net Margin"}, unit: "%", format: "percentage" },
    { id: "annualLeakage", label: "Yllk Marj Kacag", label_i18n: {"en":"Annual Margin Kacag"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "annualLeakage", warning: 30000, critical: 100000, direction: "higher_is_bad", warningMessage: "Yillik kacak > $30K — fiyatlama gozden gecirilmeli.", warningMessage_i18n: {"en":"Annual Leak > $30K — pricing should be reviewed."}, criticalMessage: "Yillik kacak > $100K — acil marj iyilestirme programi baslatilmali.", criticalMessage_i18n: {"en":"Annual Leak > $100K — urgent Margin improvement program must be initiated."} },
  ],
  formulaPipeline: [
    { formulaId: "math.add", inputMap: { a: "monthlyPartsRevenue", b: "monthlyLaborRevenue" }, outputId: "totalMonthlyRevenue" },
    { formulaId: "cost.effective_labor_rate", inputMap: {
        laborRevenue: "monthlyLaborRevenue",
        flagHours: "totalFlagHours"
      }, outputId: "effectiveLaborRate" },
    { formulaId: "cost.annual_margin_leakage", inputMap: { totalRevenue: "totalMonthlyRevenue", targetMargin: "industryBenchmarkMargin", actualMargin: "netMarginInput" }, outputId: "annualLeakage" },
  ],
  reportTemplate: { title: "Auto Shop Margin Leak Report", title_i18n: {"en":"Auto Shop Margin Leak Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 20, assumptionNotes: ["Gross margin = (Revenue - COGS) / Revenue. Parts margin excludes labor.", "Effective labor rate = Labor revenue / Flag hours.", "Net margin = (Total Revenue - COGS - OpEx) / Total Revenue.", "Annual leakage = Monthly revenue × (Target margin - Net margin) × 12."],assumptionNotes_i18n:[{"en":"Gross margin = (Revenue - COGS) / Revenue. Parts margin excludes labor."},{"en":"Effective labor rate = Labor revenue / Flag hours."},{"en":"Net margin = (Total Revenue - COGS - OpEx) / Total Revenue."},{"en":"Annual leakage = Monthly revenue × (Target margin - Net margin) × 12."}]},
};
