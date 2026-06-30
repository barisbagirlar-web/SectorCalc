/**
 * Tool #27 — Teslimat Maliyeti
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const DELIVERY_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "delivery-cost-analyzer", legacyPaidSlug: "delivery-cost-analyzer",
  name: "Delivery Cost Analyzer", name_i18n: {"en":"Delivery Cost Analyzer","tr":"Delivery Cost Analyzer"}, sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Teslimat maliyetleri başarılı ve başarısız sevkiyatlara göre ayrıştırılmazsa lojistik verimlilik ölçülemez.", painStatement_i18n: {"en":"Teslimat maliyetleri başarılı ve başarısız sevkiyatlara göre ayrıştırılmazsa lojistik verimlilik ölçülemez.","tr":"Teslimat maliyetleri başarılı ve başarısız sevkiyatlara göre ayrıştırılmazsa lojistik verimlilik ölçülemez."},
  inputs: [
    { id: "totalDeliveries", label: "Toplam Teslimat Sayısı", label_i18n: {"en":"Total monthly deliveries","tr":"Toplam Teslimat Sayısı"}, type: "number", unit: "adet/ay", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Total monthly deliveries", expertMeaning_i18n: {"en":"Total monthly deliveries","tr":"toplam teslimat sayısı"} },
    { id: "successfulDeliveries", label: "Başarılı Teslimat", label_i18n: {"en":"Successful deliveries","tr":"Başarılı Teslimat"}, type: "number", unit: "adet/ay", required: true, smartDefault: 470, validation: { min: 0 }, helper: "", expertMeaning: "Successful deliveries", expertMeaning_i18n: {"en":"Successful deliveries","tr":"başarılı teslimat"} },
    { id: "costPerDelivery", label: "Teslimat Başına Maliyet", label_i18n: {"en":"Cost per delivery","tr":"Teslimat Başına Maliyet"}, type: "number", unit: "USD", required: true, smartDefault: 8, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per delivery", expertMeaning_i18n: {"en":"Cost per delivery","tr":"teslimat başına maliyet"} },
    { id: "extraFailedDeliveryCost", label: "Başarısız Teslimat Ek Maliyeti", label_i18n: {"en":"Additional cost per failed delivery","tr":"Başarısız Teslimat Ek Maliyeti"}, type: "number", unit: "USD/adet", required: true, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Additional cost per failed delivery", expertMeaning_i18n: {"en":"Additional cost per failed delivery","tr":"başarısız teslimat ek maliyeti"} },
    { id: "returnHandlingCost", label: "İade İşlem Maliyeti", label_i18n: {"en":"Return handling cost per unit","tr":"İade İşlem Maliyeti"}, type: "number", unit: "USD/adet", required: false, smartDefault: 5, validation: { min: 0 }, helper: "", expertMeaning: "Return handling cost per unit", expertMeaning_i18n: {"en":"Return handling cost per unit","tr":"i̇ade i̇şlem maliyeti"} },
  ],
  outputs: [
    { id: "deliveryEfficiency", label: "Teslimat Verimliliği", label_i18n: {"en":"Teslimat Verimliligi","tr":"Teslimat Verimliliği"}, unit: "%", format: "percentage" },
    { id: "failedDeliveryCost", label: "Başarısız Teslimat Maliyeti", label_i18n: {"en":"Basarsz Teslimat Maliyeti","tr":"Başarısız Teslimat Maliyeti"}, unit: "USD/ay", format: "currency" },
    { id: "totalDeliveryCost", label: "Toplam Teslimat Maliyeti", label_i18n: {"en":"Toplam Teslimat Maliyeti","tr":"Toplam Teslimat Maliyeti"}, unit: "USD/ay", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "deliveryEfficiency", warning: 90, critical: 80, direction: "lower_is_bad", warningMessage: "Teslimat verimliliği < %90 — süreç iyileştirme önerilir.", warningMessage_i18n: {"en":"Teslimat verimliliği < %90 — süreç iyileştirme önerilir.","tr":"Teslimat verimliliği < %90 — süreç iyileştirme önerilir."}, criticalMessage: "Teslimat verimliliği < %80 — acil rota optimizasyonu gerekli.", criticalMessage_i18n: {"en":"Teslimat verimliliği < %80 — acil rota optimizasyonu gerekli.","tr":"Teslimat verimliliği < %80 — acil rota optimizasyonu gerekli."} }],
  formulaPipeline: [
    { formulaId: "measurement.delivery_efficiency", inputMap: {
        totalDeliveries: "totalDeliveries",
        onTimeDeliveries: "successfulDeliveries"
      }, outputId: "deliveryEfficiency" },
    { formulaId: "cost.failed_delivery_cost", inputMap: {
        failedDeliveries: "totalDeliveries",
        costPerFailedDelivery: "successfulDeliveries",
        failedDeliveryCost: "extraFailedDeliveryCost",
        returnHandlingCost: "returnHandlingCost"
      }, outputId: "failedDeliveryCost" },
    { formulaId: "cost.total_delivery_cost", inputMap: {
        failedDeliveryCost: "failedDeliveryCost",
        successfulDeliveries: "totalDeliveries",
        costPerSuccessfulDelivery: "costPerDelivery"
      }, outputId: "totalDeliveryCost" },
  ],
  reportTemplate: { title: "Delivery Cost Analysis Report", title_i18n: {"en":"Delivery Cost Analysis Report","tr":"Delivery Cost Analysis Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 5, targetMarginPercent: 12, assumptionNotes: ["Efficiency = Successful / Total.", "Failed cost = Failed × (ExtraCost + Return).", "Total = (Total × CostPer) + FailedCost."],assumptionNotes_i18n:[{"en":"Efficiency = Successful / Total.","tr":"Efficiency = Successful / Total."},{"en":"Failed cost = Failed × (ExtraCost + Return).","tr":"Failed cost = Failed × (ExtraCost + Return)."},{"en":"Total = (Total × CostPer) + FailedCost.","tr":"Total = (Total × CostPer) + FailedCost."}] },
};
