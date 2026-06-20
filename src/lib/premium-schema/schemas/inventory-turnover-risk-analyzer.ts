/**
 * Tool — Stok Devir Hızı
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const INVENTORY_TURNOVER_RISK_ANALYZER: PremiumCalculatorSchema = {
  id: "inventory-turnover-risk-analyzer", legacyPaidSlug: "inventory-turnover-risk-analyzer",
  name: "Stok Devir Hızı ve Risk Analizi", sectorSlug: "logistics-transport", category: "measurement",
  painStatement: "Stok devir hızı izlenmezse fazla stokta bekleyen sermaye atıl kalır, modası geçen ürünler ise hurda veya iskonto ile satılmak zorunda kalır.",
  inputs: [
    { id: "annualCogs", label: "Yıllık SMM (Satılan Mal Maliyeti)", type: "number", unit: "USD", required: true, smartDefault: 1200000, validation: { min: 1 }, helper: "", expertMeaning: "Annual cost of goods sold" },
    { id: "avgInventory", label: "Ortalama Stok Değeri", type: "number", unit: "USD", required: true, smartDefault: 300000, validation: { min: 1 }, helper: "", expertMeaning: "Average inventory value" },
    { id: "daysInPeriod", label: "Dönem Gün Sayısı", type: "number", unit: "gün", required: false, smartDefault: 365, validation: { min: 1 }, helper: "", expertMeaning: "Days in accounting period" },
    { id: "avgSellingPrice", label: "Ortalama Satış Fiyatı", type: "number", unit: "USD", required: false, smartDefault: 100, validation: { min: 1 }, helper: "", expertMeaning: "Average selling price per unit" },
    { id: "inventoryUnitCount", label: "Stok Adet Sayısı", type: "number", unit: "adet", required: false, smartDefault: 3000, validation: { min: 1 }, helper: "", expertMeaning: "Inventory in units" },
    { id: "obsolescenceRate", label: "Eskime Oranı", type: "number", unit: "%", required: false, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Annual obsolescence rate" },
    { id: "liquidationDiscount", label: "Tasfiye İskonto Oranı", type: "number", unit: "%", required: false, smartDefault: 50, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Discount rate for liquidation" },
  ],
  outputs: [
    { id: "inventoryTurnoverRatio", label: "Stok Devir Hızı", unit: "tur/yıl", format: "number" },
    { id: "dsiDays", label: "Stokta Kalma Süresi (DSI)", unit: "gün", format: "number" },
    { id: "obsolescenceRiskCost", label: "Eskime Risk Maliyeti", unit: "USD/yıl", format: "currency", isBigNumber: true },
    { id: "liquidationLoss", label: "Tasfiye Zararı", unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "inventoryTurnoverRatio", warning: 4, critical: 2, direction: "lower_is_bad", warningMessage: "Stok devir hızı <4 — sermaye atıl kalıyor.", criticalMessage: "Stok devir hızı <2 — acil stok eritme aksiyonu gerekli." }],
  formulaPipeline: [
    { formulaId: "measurement.inventory_turnover_ratio", inputMap: { annualCogs: "annualCogs", avgInventory: "avgInventory" }, outputId: "inventoryTurnoverRatio" },
    { formulaId: "measurement.dsi_days", inputMap: { daysInPeriod: "daysInPeriod", inventoryTurnoverRatio: "inventoryTurnoverRatio" }, outputId: "dsiDays" },
    { formulaId: "cost.obsolescence_risk_cost", inputMap: { avgInventory: "avgInventory", obsolescenceRate: "obsolescenceRate" }, outputId: "obsolescenceRiskCost" },
    { formulaId: "cost.liquidation_loss", inputMap: { inventoryUnitCount: "inventoryUnitCount", avgSellingPrice: "avgSellingPrice", liquidationDiscount: "liquidationDiscount" }, outputId: "liquidationLoss" },
  ],
  reportTemplate: { title: "Stok Devir Hızı ve Risk Raporu", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Stok devir = SMM / ortalama stok. DSI = gün / devir.", "Eskime risk maliyeti = stok × eskime oranı.", "Tasfiye zararı = adet × fiyat × iskonto oranı.", "OEM stokları ortalama 4-6 tur/yıl hedefler."] },
};
