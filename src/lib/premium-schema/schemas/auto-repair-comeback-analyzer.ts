/**
 * Tool #6 — Auto Repair Comeback Cost
 * Direct + warranty + goodwill + opportunity
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const AUTO_REPAIR_COMEBACK_SCHEMA: PremiumCalculatorSchema = {
  id: "auto-repair-comeback-analyzer", legacyPaidSlug: "auto-repair-comeback-analyzer",
  name: "Auto Repair Comeback Maliyet Analizi", sectorSlug: "auto-repair", category: "cost",
  painStatement: "Geri dönüş onarımları (comeback) sadece direkt işçilik değil, körfez doluluk kaybı ve müşteri güven kaybına da yol açar. Gerçek maliyet görünenden fazladır.",
  inputs: [
    { id: "totalCompletedOrders", label: "Dönem Tamamlanan RO", type: "number", unit: "adet", required: true, smartDefault: 200, validation: { min: 1 }, helper: "", expertMeaning: "Total repair orders completed" },
    { id: "comebackOrders", label: "Geri Dönüş (Comeback) RO", type: "number", unit: "adet", required: true, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Return repair orders" },
    { id: "avgDiagnosisMinutes", label: "Ortalama Teşhis Süresi", type: "number", unit: "dakika", required: true, smartDefault: 45, validation: { min: 0 }, helper: "", expertMeaning: "Average diagnosis time per comeback" },
    { id: "avgRepairMinutes", label: "Ortalama Onarım Süresi", type: "number", unit: "dakika", required: false, smartDefault: 60, validation: { min: 0 }, helper: "", expertMeaning: "Average repair time per comeback" },
    { id: "laborRate", label: "Saatlik İşçilik Ücreti", type: "number", unit: "USD/saat", required: true, smartDefault: 85, validation: { min: 0 }, helper: "", expertMeaning: "Shop labor rate per hour" },
    { id: "avgWastedPartsValue", label: "Ort. İsraf Parça Değeri", type: "number", unit: "USD", required: false, smartDefault: 75, validation: { min: 0 }, helper: "", expertMeaning: "Average parts value wasted" },
    { id: "warrantyClaimFee", label: "Garanti İşlem Ücreti", type: "number", unit: "USD", required: false, smartDefault: 35, validation: { min: 0 }, helper: "", expertMeaning: "Warranty processing fee per claim" },
    { id: "goodwillDiscountAvg", label: "İyi Niyet İskontosu", type: "number", unit: "USD", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Average goodwill discount given" },
    { id: "bayOccupancyHours", label: "Körfez Doluluk Süresi", type: "number", unit: "saat", required: false, smartDefault: 2.5, validation: { min: 0 }, helper: "", expertMeaning: "Bay hours per comeback" },
    { id: "revenuePerBayHour", label: "Körfez Başına Saatlik Gelir", type: "number", unit: "USD/saat", required: false, smartDefault: 125, validation: { min: 0 }, helper: "", expertMeaning: "Average revenue per bay hour" },
  ],
  outputs: [
    { id: "comebackRate", label: "Comeback Oranı", unit: "%", format: "percentage" },
    { id: "comebackCostDirect", label: "Direkt Geri Dönüş Maliyeti", unit: "USD", format: "currency" },
    { id: "comebackCostParts", label: "Parça İsraf Maliyeti", unit: "USD", format: "currency" },
    { id: "comebackCostOpportunity", label: "Fırsat Maliyeti", unit: "USD", format: "currency" },
    { id: "totalComebackCost", label: "Toplam Comeback Maliyeti", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "comebackRate", warning: 5, critical: 10, direction: "higher_is_bad", warningMessage: "Comeback oranı > %5 — süreç iyileştirme planı başlatılmalı.", criticalMessage: "Comeback oranı > %10 — acil kalite revizyonu gerekiyor." },
  ],
  formulaPipeline: [
    { formulaId: "cost.comeback_direct", inputMap: { comebackOrders: "comebackOrders", avgDiagnosisMinutes: "avgDiagnosisMinutes", avgRepairMinutes: "avgRepairMinutes", laborRate: "laborRate", avgWastedPartsValue: "avgWastedPartsValue", bayOccupancyHours: "bayOccupancyHours", revenuePerBayHour: "revenuePerBayHour" }, outputId: "comebackCostDirect" },
    { formulaId: "cost.comeback_total", inputMap: { directCost: "comebackCostDirect", warrantyCost: "warrantyClaimFee", goodwillCost: "goodwillDiscountAvg" }, outputId: "totalComebackCost" },
  ],
  reportTemplate: { title: "Auto Repair Comeback Cost Report", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 20, assumptionNotes: ["Comeback rate = Comeback orders / Total completed orders * 100.", "Direct cost = Comebacks × (Diagnosis + Repair) hours × Labor rate.", "Opportunity cost = Comebacks × Bay hours × Revenue per bay hour.", "Lifetime customer value loss is not included in this model."] },
};
