/**
 * Tool #18 — Ciro Maliyeti (Employee Turnover Cost)
 * Separation → Vacancy → Replacement → Training → ProductivityLoss → Total
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const TURNOVER_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "employee-turnover-cost-analyzer", legacyPaidSlug: "employee-turnover-cost-analyzer",
  name: "Çalışan Ciro (Turnover) Maliyet Analizi", sectorSlug: "legal-tax", category: "cost",
  painStatement: "Personel ayrılma maliyeti sadece tazminat değil; işe alım, eğitim ve verimlilik kaybını da içerir. Bu araç ayrılan çalışan başına gerçek maliyeti hesaplar.",
  inputs: [
    { id: "exitsCount", label: "Ayrılan Personel Sayısı", type: "number", unit: "kişi", required: true, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Number of employee exits" },
    { id: "severancePay", label: "Kıdem Tazminatı (Toplam)", type: "number", unit: "USD", required: true, smartDefault: 25000, validation: { min: 0 }, helper: "", expertMeaning: "Total severance compensation" },
    { id: "timeToFillDays", label: "İşe Alım Süresi", type: "number", unit: "gün", required: true, smartDefault: 45, validation: { min: 1 }, helper: "", expertMeaning: "Average days to fill position" },
    { id: "dailyRevenuePerEmployee", label: "Çalışan Başına Günlük Gelir", type: "number", unit: "USD/gün", required: true, smartDefault: 400, validation: { min: 0 }, helper: "", expertMeaning: "Revenue per employee per day" },
    { id: "advertisingAndAgencyFees", label: "İlan ve Ajans Ücretleri", type: "number", unit: "USD", required: true, smartDefault: 3000, validation: { min: 0 }, helper: "", expertMeaning: "Total recruitment advertising" },
    { id: "interviewHours", label: "Mülakat Süresi (Toplam)", type: "number", unit: "saat", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Manager interview hours per hire" },
    { id: "interviewerRate", label: "Mülakatçı Saatlik Ücreti", type: "number", unit: "USD/saat", required: false, smartDefault: 60, validation: { min: 0 }, helper: "", expertMeaning: "Manager hourly rate" },
    { id: "trainingHours", label: "Eğitim Süresi", type: "number", unit: "saat", required: false, smartDefault: 80, validation: { min: 0 }, helper: "", expertMeaning: "Total training hours per hire" },
    { id: "trainerRate", label: "Eğitmen Saatlik Ücreti", type: "number", unit: "USD/saat", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Trainer hourly cost" },
    { id: "onboardingHours", label: "Oryantasyon Süresi", type: "number", unit: "saat", required: false, smartDefault: 40, validation: { min: 0 }, helper: "", expertMeaning: "Onboarding hours per hire" },
    { id: "newHireRate", label: "Yeni Çalışan Saatlik Ücreti", type: "number", unit: "USD/saat", required: false, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "New hire hourly rate during training" },
    { id: "timeToFullProductivityDays", label: "Tam Verimliliğe Ulaşma", type: "number", unit: "gün", required: false, smartDefault: 90, validation: { min: 0 }, helper: "", expertMeaning: "Days to reach full productivity" },
    { id: "avgDailyOutput", label: "Ortalama Günlük Çıktı", type: "number", unit: "birim/gün", required: false, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Average daily output per employee" },
    { id: "unitMargin", label: "Birim Kâr Marjı", type: "number", unit: "USD", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Profit margin per unit" },
    { id: "separationCostInput", label: "Ayrılma Maliyeti (Tahmini)", type: "number", unit: "USD", required: false, smartDefault: 3000, validation: { min: 0 }, helper: "İşten çıkış maliyeti (tazminat + işlem).", expertMeaning: "Separation cost per employee" },
    { id: "vacancyCostInput", label: "Pozisyon Boşluk Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 12000, validation: { min: 0 }, helper: "Boş pozisyonun günlük gelir kaybı.", expertMeaning: "Vacancy cost per employee" },
    { id: "replacementCostInput", label: "Yenileme Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "İlan, mülakat, referans maliyeti.", expertMeaning: "Replacement hiring cost" },
    { id: "trainingCostInput", label: "Eğitim Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 4000, validation: { min: 0 }, helper: "Eğitim + oryantasyon maliyeti.", expertMeaning: "Training cost per new hire" },
    { id: "productivityLossInput", label: "Verimlilik Kaybı", type: "number", unit: "USD", required: false, smartDefault: 8000, validation: { min: 0 }, helper: "Tam verime ulaşana kadar kayıp.", expertMeaning: "Productivity loss per new hire" },
  ],
  outputs: [
    { id: "separationCost", label: "Ayrılma Maliyeti", unit: "USD", format: "currency" },
    { id: "vacancyCost", label: "Pozisyon Boşluk Maliyeti", unit: "USD", format: "currency" },
    { id: "replacementCost", label: "Yenileme Maliyeti", unit: "USD", format: "currency" },
    { id: "trainingCost", label: "Eğitim Maliyeti", unit: "USD", format: "currency" },
    { id: "productivityLoss", label: "Verimlilik Kaybı", unit: "USD", format: "currency" },
    { id: "totalTurnoverCost", label: "Toplam Ciro Maliyeti", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "totalTurnoverCost", warning: 50000, critical: 150000, direction: "higher_is_bad", warningMessage: "Ciro maliyeti > $50K — çalışan bağlılığı programı değerlendirilmeli.", criticalMessage: "Ciro maliyeti > $150K — acil elde tutma stratejisi gerekiyor." },
  ],
  formulaPipeline: [
    { formulaId: "cost.turnover_total", inputMap: { separationCost: "separationCostInput", vacancyCost: "vacancyCostInput", replacementCost: "replacementCostInput", trainingCost: "trainingCostInput", productivityLoss: "productivityLossInput" }, outputId: "totalTurnoverCost" },
  ],
  reportTemplate: { title: "Employee Turnover Cost Report", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Separation cost = Exit interview + Severance + Admin.", "Vacancy cost = Time to fill × Daily revenue + Temp agency.", "Replacement cost = Ads + Agency + Interview time × Manager rate.", "Training cost = Training hours × Trainer rate + Onboarding × New hire rate.", "Productivity loss = Time to full prod × (1 - Ramp-up curve) × Output × Margin."] },
};
