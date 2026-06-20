/**
 * Tool #26 — Ofis Malzemeleri Maliyet
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const OFFICE_SUPPLIES_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "office-supplies-cost-analyzer", legacyPaidSlug: "office-supplies-cost-analyzer",
  name: "Ofis Malzemeleri Maliyet Analizi", sectorSlug: "financial-planning", category: "cost",
  painStatement: "Ofis malzemelerinde EOQ, taşıma maliyeti ve stok tükenme maliyeti hesaplanmazsa gereksiz stok ve fazla harcama oluşur.",
  inputs: [
    { id: "monthlyConsumption", label: "Aylık Tüketim Miktarı", type: "number", unit: "adet/ay", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Monthly consumption quantity" },
    { id: "unitPrice", label: "Birim Fiyat", type: "number", unit: "USD", required: true, smartDefault: 3.5, validation: { min: 0.01 }, helper: "", expertMeaning: "Unit price" },
    { id: "orderCost", label: "Sipariş Maliyeti", type: "number", unit: "USD/sipariş", required: true, smartDefault: 15, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per order" },
    { id: "holdingRate", label: "Taşıma Maliyeti Oranı", type: "number", unit: "%/yıl", required: true, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Annual holding cost rate" },
    { id: "stockoutRate", label: "Stok Tükenme Riski", type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Stockout probability" },
    { id: "stockoutCostPerUnit", label: "Stok Tükenme Birim Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Cost per stockout unit" },
    { id: "currentOrderQty", label: "Mevcut Sipariş Miktarı", type: "number", unit: "adet", required: false, smartDefault: 300, validation: { min: 1 }, helper: "", expertMeaning: "Current order quantity" },
  ],
  outputs: [
    { id: "consumptionRate", label: "Yıllık Tüketim Hızı", unit: "adet/yıl", format: "number" },
    { id: "annualCost", label: "Yıllık Ofis Malzeme Maliyeti", unit: "USD/yıl", format: "currency" },
    { id: "carryingCost", label: "Taşıma Maliyeti", unit: "USD/yıl", format: "currency" },
    { id: "stockoutCost", label: "Stok Tükenme Maliyeti", unit: "USD/yıl", format: "currency" },
    { id: "optimalEoq", label: "Optimum Sipariş Miktarı (EOQ)", unit: "adet", format: "number" },
    { id: "wastePct", label: "İsraf Yüzdesi", unit: "%", format: "number" },
    { id: "optimizationSavings", label: "Optimizasyon Tasarrufu", unit: "USD/yıl", format: "currency" },
  ],
  thresholds: [{ fieldId: "optimizationSavings", warning: 500, critical: 100, direction: "lower_is_bad", warningMessage: "Tasarruf < $500 — mevcut sistem optimize.", criticalMessage: "Tasarruf < $100 — küçük iyileştirme fırsatı." }],
  formulaPipeline: [
    { formulaId: "cost.office_consumption_rate", inputMap: { monthlyConsumption: "monthlyConsumption" }, outputId: "consumptionRate" },
    { formulaId: "cost.office_annual_cost", inputMap: { consumptionRate: "consumptionRate", unitPrice: "unitPrice" }, outputId: "annualCost" },
    { formulaId: "cost.office_carrying_cost", inputMap: { currentOrderQty: "currentOrderQty", unitPrice: "unitPrice", holdingRate: "holdingRate" }, outputId: "carryingCost" },
    { formulaId: "cost.office_stockout_cost", inputMap: { stockoutRate: "stockoutRate", stockoutCostPerUnit: "stockoutCostPerUnit", consumptionRate: "consumptionRate" }, outputId: "stockoutCost" },
    { formulaId: "cost.office_eoq", inputMap: { consumptionRate: "consumptionRate", orderCost: "orderCost", unitPrice: "unitPrice", holdingRate: "holdingRate" }, outputId: "optimalEoq" },
    { formulaId: "cost.office_waste_pct", inputMap: { currentOrderQty: "currentOrderQty", optimalEoq: "optimalEoq" }, outputId: "wastePct" },
    { formulaId: "cost.office_optimization_savings", inputMap: { currentOrderQty: "currentOrderQty", optimalEoq: "optimalEoq", orderCost: "orderCost", unitPrice: "unitPrice", holdingRate: "holdingRate" }, outputId: "optimizationSavings" },
  ],
  reportTemplate: { title: "Office Supplies Cost Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["EOQ = √(2×yıllık talep×sipariş maliyeti / taşıma maliyeti).", "Taşıma maliyeti = stok değeri × taşıma oranı.", "Stok tükenme maliyeti = risk × birim maliyet × talep."] },
};
