/**
 * Tool — Stok Devir Hızı
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const INVENTORY_TURNOVER_RISK_ANALYZER: PremiumCalculatorSchema = {
  id: "inventory-turnover-risk-analyzer", legacyPaidSlug: "inventory-turnover-risk-analyzer",
  name: "Inventory Turnover Risk Analyzer", name_i18n: {"en":"Inventory Turnover Risk Analyzer"}, sectorSlug: "logistics-transport", category: "measurement",
  painStatement: "Stok devir hızı izlenmezse fazla stokta bekleyen sermaye atıl kalır, modası geçen ürünler ise hurda veya iskonto ile satılmak zorunda kalır.", painStatement_i18n: {"en":"Inventory Rotation hızı if not tracked Overtime stokta bekleyen sermaye atıl kalır, modası geçen ürünler ise Scrap veya Discount ile satılmak zorunda kalır."},
  inputs: [
    { id: "annualCogs", label: "Annual cost of goods sold", label_i18n: {"en":"Annual cost of goods sold"}, type: "number", unit: "USD", required: true, smartDefault: 1200000, validation: { min: 1 }, helper: "", expertMeaning: "Annual cost of goods sold", expertMeaning_i18n: {"en":"Annual cost of goods sold"} },
    { id: "avgInventory", label: "Average inventory value", label_i18n: {"en":"Average inventory value"}, type: "number", unit: "USD", required: true, smartDefault: 300000, validation: { min: 1 }, helper: "", expertMeaning: "Average inventory value", expertMeaning_i18n: {"en":"Average inventory value"} },
    { id: "daysInPeriod", label: "Days in accounting period", label_i18n: {"en":"Days in accounting period"}, type: "number", unit: "gün", required: false, smartDefault: 365, validation: { min: 1 }, helper: "", expertMeaning: "Days in accounting period", expertMeaning_i18n: {"en":"Days in accounting period"} },
    { id: "avgSellingPrice", label: "Average selling price per unit", label_i18n: {"en":"Average selling price per unit"}, type: "number", unit: "USD", required: false, smartDefault: 100, validation: { min: 1 }, helper: "", expertMeaning: "Average selling price per unit", expertMeaning_i18n: {"en":"Average selling price per unit"} },
    { id: "inventoryUnitCount", label: "Inventory in units", label_i18n: {"en":"Inventory in units"}, type: "number", unit: "adet", required: false, smartDefault: 3000, validation: { min: 1 }, helper: "", expertMeaning: "Inventory in units", expertMeaning_i18n: {"en":"Inventory in units"} },
    { id: "obsolescenceRate", label: "Annual obsolescence rate", label_i18n: {"en":"Annual obsolescence rate"}, type: "number", unit: "%", required: false, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Annual obsolescence rate", expertMeaning_i18n: {"en":"Annual obsolescence rate"} },
    { id: "liquidationDiscount", label: "Discount rate for liquidation", label_i18n: {"en":"Discount rate for liquidation"}, type: "number", unit: "%", required: false, smartDefault: 50, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Discount rate for liquidation", expertMeaning_i18n: {"en":"Discount rate for liquidation"} },
  ],
  outputs: [
    { id: "inventoryTurnoverRatio", label: "Inventory Turnover Rate", label_i18n: {"en":"Inventory Turnover Rate"}, unit: "tur/yıl", format: "number" },
    { id: "dsiDays", label: "Stokta Kalma Süresi (DSI)", label_i18n: {"en":"Inventory Holding Period (DSI)"}, unit: "gün", format: "number" },
    { id: "obsolescenceRiskCost", label: "Obsolescence Risk Cost", label_i18n: {"en":"Obsolescence Risk Cost"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
    { id: "liquidationLoss", label: "Liquidation Loss", label_i18n: {"en":"Liquidation Loss"}, unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "inventoryTurnoverRatio", warning: 4, critical: 2, direction: "lower_is_bad", warningMessage: "Stok devir hızı <4 — sermaye atıl kalıyor.", warningMessage_i18n: {"en":"Inventory Rotation hızı <4 — sermaye atıl kalıyor."}, criticalMessage: "Stok devir hızı <2 — acil stok eritme aksiyonu gerekli.", criticalMessage_i18n: {"en":"Inventory Rotation hızı <2 — urgent Inventory eritme aksiyonu gerekli."} }],
  formulaPipeline: [
    { formulaId: "measurement.inventory_turnover_ratio", inputMap: { annualCogs: "annualCogs", avgInventory: "avgInventory" ,
        cogs: "cogs"}, outputId: "inventoryTurnoverRatio" },
    { formulaId: "measurement.dsi_days", inputMap: { daysInPeriod: "daysInPeriod", inventoryTurnoverRatio: "inventoryTurnoverRatio" ,
        inventoryTurnover: "inventoryTurnover"}, outputId: "dsiDays" },
    { formulaId: "cost.obsolescence_risk_cost", inputMap: { avgInventory: "avgInventory", obsolescenceRate: "obsolescenceRate" }, outputId: "obsolescenceRiskCost" },
    { formulaId: "cost.liquidation_loss", inputMap: {
        slowMovingInv: "inventoryUnitCount",
        salvagePct: "avgSellingPrice",
        liquidationDiscount: "liquidationDiscount"
      }, outputId: "liquidationLoss" },
  ],
  reportTemplate: { title: "Stok Devir Hızı ve Risk Raporu", title_i18n: {"en":"Inventory Rotation Hızı ve Risk Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Stok devir = SMM / ortalama stok. DSI = gün / devir.", "Eskime risk maliyeti = stok × eskime oranı.", "Tasfiye zararı = adet × fiyat × iskonto oranı.", "OEM stokları ortalama 4-6 tur/yıl hedefler."],assumptionNotes_i18n:[{"en":"Stok devir = SMM / ortalama stok. DSI = gün / devir."},{"en":"Eskime risk maliyeti = stok × eskime oranı."},{"en":"Tasfiye zararı = adet × fiyat × iskonto oranı."},{"en":"OEM stokları ortalama 4-6 tur/yıl hedefler."}] },
};
