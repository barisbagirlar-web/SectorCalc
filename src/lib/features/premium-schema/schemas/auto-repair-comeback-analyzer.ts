/**
 * Tool #6 — Auto Repair Comeback Cost
 * Direct + warranty + goodwill + opportunity
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const AUTO_REPAIR_COMEBACK_SCHEMA: PremiumCalculatorSchema = {
  id: "auto-repair-comeback-analyzer", legacyPaidSlug: "auto-repair-comeback-analyzer",
  name: "Auto Repair Comeback Maliyet Analizi", name_i18n: {"en":"Auto Repair Comeback Cost Analysis"}, sectorSlug: "auto-repair", category: "cost",
  painStatement: "Geri donus onarimlari (comeback) sadece direkt iscilik degil, korfez doluluk loss ve musteri guven lossna da yol acar. Gercek maliyet gorunenden fazladir.", painStatement_i18n: {"en":"Return repairs (comeback) cause not only Direct labor but also bay occupancy Loss and loss of customer trust. Actual Cost is higher than visible."},
  inputs: [
    { id: "totalCompletedOrders", label: "Donem Tamamlanan RO", label_i18n: {"en":"Completed Repair Orders"}, type: "number", unit: "adet", required: true, smartDefault: 200, validation: { min: 1 }, helper: "", expertMeaning: "Total repair orders completed", expertMeaning_i18n: {"en":"Total repair orders completed"} },
    { id: "comebackOrders", label: "Comeback Repair Orders", label_i18n: {"en":"Comeback Repair Orders"}, type: "number", unit: "adet", required: true, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Return repair orders", expertMeaning_i18n: {"en":"Return repair orders"} },
    { id: "avgDiagnosisMinutes", label: "Avg Diagnosis Time", label_i18n: {"en":"Avg Diagnosis Time"}, type: "number", unit: "dakika", required: true, smartDefault: 45, validation: { min: 0 }, helper: "", expertMeaning: "Average diagnosis time per comeback", expertMeaning_i18n: {"en":"Average diagnosis time per comeback"} },
    { id: "avgRepairMinutes", label: "Avg Repair Time", label_i18n: {"en":"Avg Repair Time"}, type: "number", unit: "dakika", required: false, smartDefault: 60, validation: { min: 0 }, helper: "", expertMeaning: "Average repair time per comeback", expertMeaning_i18n: {"en":"Average repair time per comeback"} },
    { id: "laborRate", label: "Labor Rate", label_i18n: {"en":"Labor Rate"}, type: "number", unit: "USD/saat", required: true, smartDefault: 85, validation: { min: 0 }, helper: "", expertMeaning: "Shop labor rate per hour", expertMeaning_i18n: {"en":"Shop labor rate per hour"} },
    { id: "avgWastedPartsValue", label: "Avg Wasted Parts Value", label_i18n: {"en":"Avg Wasted Parts Value"}, type: "number", unit: "USD", required: false, smartDefault: 75, validation: { min: 0 }, helper: "", expertMeaning: "Average parts value wasted", expertMeaning_i18n: {"en":"Average parts value wasted"} },
    { id: "warrantyClaimFee", label: "Warranty Processing Fee", label_i18n: {"en":"Warranty Processing Fee"}, type: "number", unit: "USD", required: false, smartDefault: 35, validation: { min: 0 }, helper: "", expertMeaning: "Warranty processing fee per claim", expertMeaning_i18n: {"en":"Warranty processing fee per claim"} },
    { id: "goodwillDiscountAvg", label: "Goodwill Discount", label_i18n: {"en":"Goodwill Discount"}, type: "number", unit: "USD", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Average goodwill discount given", expertMeaning_i18n: {"en":"Average goodwill discount given"} },
    { id: "bayOccupancyHours", label: "Korfez Doluluk Suresi", label_i18n: {"en":"Bay Occupancy Time"}, type: "number", unit: "saat", required: false, smartDefault: 2.5, validation: { min: 0 }, helper: "", expertMeaning: "Bay hours per comeback", expertMeaning_i18n: {"en":"Bay hours per comeback"} },
    { id: "revenuePerBayHour", label: "Revenue Per Bay Hour", label_i18n: {"en":"Revenue Per Bay Hour"}, type: "number", unit: "USD/saat", required: false, smartDefault: 125, validation: { min: 0 }, helper: "", expertMeaning: "Average revenue per bay hour", expertMeaning_i18n: {"en":"Average revenue per bay hour"} },
  ],
  outputs: [
    { id: "comebackRate", label: "Comeback Rate", label_i18n: {"en":"Comeback Rate"}, unit: "%", format: "percentage" },
    { id: "comebackCostDirect", label: "Direct Return Cost", label_i18n: {"en":"Direct Return Cost"}, unit: "USD", format: "currency" },
    { id: "comebackCostParts", label: "Parts Waste Cost", label_i18n: {"en":"Parts Waste Cost"}, unit: "USD", format: "currency" },
    { id: "comebackCostOpportunity", label: "Opportunity Cost", label_i18n: {"en":"Opportunity Cost"}, unit: "USD", format: "currency" },
    { id: "totalComebackCost", label: "Total Comeback Cost", label_i18n: {"en":"Total Comeback Cost"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "comebackRate", warning: 5, critical: 10, direction: "higher_is_bad", warningMessage: "Comeback orani > %5 — surec iyilestirme plani baslatilmali.", warningMessage_i18n: {"en":"Comeback rate > 5% — process improvement plan must be initiated."}, criticalMessage: "Comeback orani > %10 — acil kalite revizyonu gerekiyor.", criticalMessage_i18n: {"en":"Comeback rate > %10 — urgent Quality revizyonu gerekiyor."} },
  ],
  formulaPipeline: [
    { formulaId: "cost.comeback_direct", inputMap: { comebackOrders: "comebackOrders", avgDiagnosisMinutes: "avgDiagnosisMinutes", avgRepairMinutes: "avgRepairMinutes", laborRate: "laborRate", avgWastedPartsValue: "avgWastedPartsValue", bayOccupancyHours: "bayOccupancyHours", revenuePerBayHour: "revenuePerBayHour" ,
        laborCost: "laborCost",
        partsCost: "partsCost",
        opportunityCost: "opportunityCost"}, outputId: "comebackCostDirect" },
    { formulaId: "cost.comeback_total", inputMap: { directCost: "comebackCostDirect", warrantyCost: "warrantyClaimFee", goodwillCost: "goodwillDiscountAvg" }, outputId: "totalComebackCost" },
  ],
  reportTemplate: { title: "Auto Repair Comeback Cost Report", title_i18n: {"en":"Auto Repair Comeback Cost Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 20, assumptionNotes: ["Comeback rate = Comeback orders / Total completed orders * 100.", "Direct cost = Comebacks × (Diagnosis + Repair) hours × Labor rate.", "Opportunity cost = Comebacks × Bay hours × Revenue per bay hour.", "Lifetime customer value loss is not included in this model."],assumptionNotes_i18n:[{"en":"Comeback rate = Comeback orders / Total completed orders * 100."},{"en":"Direct cost = Comebacks × (Diagnosis + Repair) hours × Labor rate."},{"en":"Opportunity cost = Comebacks × Bay hours × Revenue per bay hour."},{"en":"Lifetime customer value loss is not included in this model."}]},
};
