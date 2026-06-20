/**
 * Tool #47 — HACCP Deviation
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const HACCP_DEVIATION_SCHEMA: PremiumCalculatorSchema = {
  id: "haccp-deviation-cost-analyzer", legacyPaidSlug: "haccp-deviation-cost-analyzer",
  name: "HACCP Sapma Maliyet & RPN Analizi", sectorSlug: "food", category: "cost",
  painStatement: "HACCP sapmalarının maliyeti (bekletme, test, rework, geri çağırma) hesaplanmazsa gıda güvenliği yatırım öncelikleri yanlış belirlenir.",
  inputs: [
    { id: "quarantineVolume", label: "Karantina Hacmi", type: "number", unit: "kg", required: true, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Quarantined product volume" },
    { id: "holdCostPerUnit", label: "Bekletme Maliyeti", type: "number", unit: "USD/kg/gün", required: true, smartDefault: 0.1, validation: { min: 0 }, helper: "", expertMeaning: "Cost per unit per day" },
    { id: "holdDays", label: "Bekletme Günü", type: "number", unit: "gün", required: true, smartDefault: 3, validation: { min: 1 }, helper: "", expertMeaning: "Hold duration" },
    { id: "testSamples", label: "Test Örnek Sayısı", type: "number", unit: "adet", required: true, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Number of test samples" },
    { id: "labCost", label: "Laboratuvar Maliyeti", type: "number", unit: "USD/örnek", required: true, smartDefault: 50, validation: { min: 0 }, helper: "", expertMeaning: "Lab cost per sample" },
    { id: "deviationVolume", label: "Sapma Hacmi", type: "number", unit: "kg", required: false, smartDefault: 1000, validation: { min: 0 }, helper: "", expertMeaning: "Volume requiring rework" },
    { id: "reworkCost", label: "Rework Maliyeti", type: "number", unit: "USD/kg", required: false, smartDefault: 1.5, validation: { min: 0 }, helper: "", expertMeaning: "Rework cost per kg" },
    { id: "condemnedVolume", label: "İmha Hacmi", type: "number", unit: "kg", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Condemned volume" },
    { id: "disposalCost", label: "Bertaraf Maliyeti", type: "number", unit: "USD/kg", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Disposal cost per kg" },
    { id: "lostMaterial", label: "Malzeme Kaybı", type: "number", unit: "USD", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Lost material cost" },
    { id: "notificationCost", label: "Bildirim Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Notification cost" },
    { id: "logisticsRecall", label: "Geri Toplama Lojistiği", type: "number", unit: "USD", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Recall logistics cost" },
    { id: "retailPenalty", label: "Perakende Cezası", type: "number", unit: "USD", required: false, smartDefault: 10000, validation: { min: 0 }, helper: "", expertMeaning: "Retailer penalty" },
    { id: "brandDamage", label: "Marka Hasarı", type: "number", unit: "USD", required: false, smartDefault: 50000, validation: { min: 0 }, helper: "", expertMeaning: "Brand damage cost" },
    { id: "probDetection", label: "Tespit Olasılığı", type: "number", unit: "%", required: false, smartDefault: 30, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Regulatory detection probability" },
    { id: "fineAmount", label: "Ceza Tutarı", type: "number", unit: "USD", required: false, smartDefault: 100000, validation: { min: 0 }, helper: "", expertMeaning: "Maximum regulatory fine" },
  ],
  outputs: [
    { id: "totalHaccpCost", label: "Toplam HACCP Sapma Maliyeti", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "totalHaccpCost", warning: 50000, critical: 150000, direction: "higher_is_bad", warningMessage: "Maliyet > $50K — HACCP planı gözden geçirilmeli.", criticalMessage: "Maliyet > $150K — tesis denetimi ve düzeltici faaliyet acil." }],
  formulaPipeline: [
    { formulaId: "cost.haccp_hold", inputMap: { quarantineVolume: "quarantineVolume", holdCostPerUnit: "holdCostPerUnit", holdDays: "holdDays" }, outputId: "holdCost" },
    { formulaId: "cost.haccp_test", inputMap: { testSamples: "testSamples", labCost: "labCost" }, outputId: "testCost" },
    { formulaId: "cost.haccp_rework", inputMap: { deviationVolume: "deviationVolume", reworkCost: "reworkCost" }, outputId: "reworkCost" },
    { formulaId: "cost.haccp_disposal", inputMap: { condemnedVolume: "condemnedVolume", disposalCost: "disposalCost", lostMaterial: "lostMaterial" }, outputId: "disposalCost" },
    { formulaId: "cost.haccp_recall", inputMap: { notificationCost: "notificationCost", logisticsRecall: "logisticsRecall", retailPenalty: "retailPenalty", brandDamage: "brandDamage" }, outputId: "recallCost" },
    { formulaId: "cost.haccp_fine", inputMap: { probDetection: "probDetection", fineAmount: "fineAmount" }, outputId: "fine" },
    { formulaId: "cost.haccp_total", inputMap: { holdCost: "holdCost", testCost: "testCost", reworkCost: "reworkCost", disposalCost: "disposalCost", recallCost: "recallCost", fine: "fine" }, outputId: "totalHaccpCost" },
  ],
  reportTemplate: { title: "HACCP Deviation Cost Report", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.2, volatilityPercent: 20, targetMarginPercent: 25, assumptionNotes: ["Hold = Vol×Cost×Days. Test = Samples×LabCost.", "Rework = Vol×ReworkCost. Disp = CondVol×DispCost+LostMat.", "Recall = Notif+Log+RetailPen+Brand. Fine = Prob×Fine."] },
};
