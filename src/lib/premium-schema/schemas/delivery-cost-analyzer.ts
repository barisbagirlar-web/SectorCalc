/**
 * Tool #27 — Teslimat Maliyeti
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const DELIVERY_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "delivery-cost-analyzer", legacyPaidSlug: "delivery-cost-analyzer",
  name: "Teslimat Maliyet Analizi", sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Teslimat maliyetleri başarılı ve başarısız sevkiyatlara göre ayrıştırılmazsa lojistik verimlilik ölçülemez.",
  inputs: [
    { id: "totalDeliveries", label: "Toplam Teslimat Sayısı", type: "number", unit: "adet/ay", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Total monthly deliveries" },
    { id: "successfulDeliveries", label: "Başarılı Teslimat", type: "number", unit: "adet/ay", required: true, smartDefault: 470, validation: { min: 0 }, helper: "", expertMeaning: "Successful deliveries" },
    { id: "costPerDelivery", label: "Teslimat Başına Maliyet", type: "number", unit: "USD", required: true, smartDefault: 8, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per delivery" },
    { id: "extraFailedDeliveryCost", label: "Başarısız Teslimat Ek Maliyeti", type: "number", unit: "USD/adet", required: true, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Additional cost per failed delivery" },
    { id: "returnHandlingCost", label: "İade İşlem Maliyeti", type: "number", unit: "USD/adet", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Return handling cost per unit" },
  ],
  outputs: [
    { id: "deliveryEfficiency", label: "Teslimat Verimliliği", unit: "%", format: "percentage" },
    { id: "failedDeliveryCost", label: "Başarısız Teslimat Maliyeti", unit: "USD/ay", format: "currency" },
    { id: "totalDeliveryCost", label: "Toplam Teslimat Maliyeti", unit: "USD/ay", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "deliveryEfficiency", warning: 90, critical: 80, direction: "lower_is_bad", warningMessage: "Teslimat verimliliği < %90 — süreç iyileştirme önerilir.", criticalMessage: "Teslimat verimliliği < %80 — acil rota optimizasyonu gerekli." }],
  formulaPipeline: [
    { formulaId: "measurement.delivery_efficiency", inputMap: { successfulDeliveries: "successfulDeliveries", totalDeliveries: "totalDeliveries" }, outputId: "deliveryEfficiency" },
    { formulaId: "cost.failed_delivery_cost", inputMap: { totalDeliveries: "totalDeliveries", successfulDeliveries: "successfulDeliveries", failedDeliveryCost: "extraFailedDeliveryCost", returnHandlingCost: "returnHandlingCost" }, outputId: "failedDeliveryCost" },
    { formulaId: "cost.total_delivery_cost", inputMap: { totalDeliveries: "totalDeliveries", costPerDelivery: "costPerDelivery", failedDeliveryCost: "failedDeliveryCost" }, outputId: "totalDeliveryCost" },
  ],
  reportTemplate: { title: "Delivery Cost Analysis Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 5, targetMarginPercent: 12, assumptionNotes: ["Efficiency = Successful / Total.", "Failed cost = Failed × (ExtraCost + Return).", "Total = (Total × CostPer) + FailedCost."] },
};
