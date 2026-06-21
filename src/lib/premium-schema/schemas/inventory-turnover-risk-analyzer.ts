/**
 * Tool — Stok Devir Hızı
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const INVENTORY_TURNOVER_RISK_ANALYZER: PremiumCalculatorSchema = {
  id: "inventory-turnover-risk-analyzer", legacyPaidSlug: "inventory-turnover-risk-analyzer",
  name: "Stok Devir Hızı ve Risk Analizi", name_i18n: {"en":"Stok Devir Hızı ve Risk Analizi","tr":"Stok Devir Hızı ve Risk Analizi"}, sectorSlug: "logistics-transport", category: "measurement",
  painStatement: "Stok devir hızı izlenmezse fazla stokta bekleyen sermaye atıl kalır, modası geçen ürünler ise hurda veya iskonto ile satılmak zorunda kalır.", painStatement_i18n: {"en":"Stok devir hızı izlenmezse fazla stokta bekleyen sermaye atıl kalır, modası geçen ürünler ise hurda veya iskonto ile satılmak zorunda kalır.","tr":"Stok devir hızı izlenmezse fazla stokta bekleyen sermaye atıl kalır, modası geçen ürünler ise hurda veya iskonto ile satılmak zorunda kalır."},
  inputs: [
    { id: "annualCogs", label: "Yıllık SMM (Satılan Mal Maliyeti)", label_i18n: {"en":"Yıllık SMM (Satılan Mal Maliyeti)","tr":"Yıllık SMM (Satılan Mal Maliyeti)"}, type: "number", unit: "USD", required: true, smartDefault: 1200000, validation: { min: 1 }, helper: "", expertMeaning: "Annual cost of goods sold", expertMeaning_i18n: {"en":"Annual cost of goods sold","tr":"Annual cost of goods sold"} },
    { id: "avgInventory", label: "Ortalama Stok Değeri", label_i18n: {"en":"Ortalama Stok Değeri","tr":"Ortalama Stok Değeri"}, type: "number", unit: "USD", required: true, smartDefault: 300000, validation: { min: 1 }, helper: "", expertMeaning: "Average inventory value", expertMeaning_i18n: {"en":"Average inventory value","tr":"Average inventory value"} },
    { id: "daysInPeriod", label: "Dönem Gün Sayısı", label_i18n: {"en":"Dönem Gün Sayısı","tr":"Dönem Gün Sayısı"}, type: "number", unit: "gün", required: false, smartDefault: 365, validation: { min: 1 }, helper: "", expertMeaning: "Days in accounting period", expertMeaning_i18n: {"en":"Days in accounting period","tr":"Days in accounting period"} },
    { id: "avgSellingPrice", label: "Ortalama Satış Fiyatı", label_i18n: {"en":"Ortalama Satış Fiyatı","tr":"Ortalama Satış Fiyatı"}, type: "number", unit: "USD", required: false, smartDefault: 100, validation: { min: 1 }, helper: "", expertMeaning: "Average selling price per unit", expertMeaning_i18n: {"en":"Average selling price per unit","tr":"Average selling price per unit"} },
    { id: "inventoryUnitCount", label: "Stok Adet Sayısı", label_i18n: {"en":"Stok Adet Sayısı","tr":"Stok Adet Sayısı"}, type: "number", unit: "adet", required: false, smartDefault: 3000, validation: { min: 1 }, helper: "", expertMeaning: "Inventory in units", expertMeaning_i18n: {"en":"Inventory in units","tr":"Inventory in units"} },
    { id: "obsolescenceRate", label: "Eskime Oranı", label_i18n: {"en":"Eskime Oranı","tr":"Eskime Oranı"}, type: "number", unit: "%", required: false, smartDefault: 10, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Annual obsolescence rate", expertMeaning_i18n: {"en":"Annual obsolescence rate","tr":"Annual obsolescence rate"} },
    { id: "liquidationDiscount", label: "Tasfiye İskonto Oranı", label_i18n: {"en":"Tasfiye İskonto Oranı","tr":"Tasfiye İskonto Oranı"}, type: "number", unit: "%", required: false, smartDefault: 50, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Discount rate for liquidation", expertMeaning_i18n: {"en":"Discount rate for liquidation","tr":"Discount rate for liquidation"} },
  ],
  outputs: [
    { id: "inventoryTurnoverRatio", label: "Stok Devir Hızı", label_i18n: {"en":"Stok Devir Hızı","tr":"Stok Devir Hızı"}, unit: "tur/yıl", format: "number" },
    { id: "dsiDays", label: "Stokta Kalma Süresi (DSI)", label_i18n: {"en":"Stokta Kalma Süresi (DSI)","tr":"Stokta Kalma Süresi (DSI)"}, unit: "gün", format: "number" },
    { id: "obsolescenceRiskCost", label: "Eskime Risk Maliyeti", label_i18n: {"en":"Eskime Risk Maliyeti","tr":"Eskime Risk Maliyeti"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
    { id: "liquidationLoss", label: "Tasfiye Zararı", label_i18n: {"en":"Tasfiye Zararı","tr":"Tasfiye Zararı"}, unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "inventoryTurnoverRatio", warning: 4, critical: 2, direction: "lower_is_bad", warningMessage: "Stok devir hızı <4 — sermaye atıl kalıyor.", warningMessage_i18n: {"en":"Stok devir hızı <4 — sermaye atıl kalıyor.","tr":"Stok devir hızı <4 — sermaye atıl kalıyor."}, criticalMessage: "Stok devir hızı <2 — acil stok eritme aksiyonu gerekli.", criticalMessage_i18n: {"en":"Stok devir hızı <2 — acil stok eritme aksiyonu gerekli.","tr":"Stok devir hızı <2 — acil stok eritme aksiyonu gerekli."} }],
  formulaPipeline: [
    { formulaId: "measurement.inventory_turnover_ratio", inputMap: { annualCogs: "annualCogs", avgInventory: "avgInventory" }, outputId: "inventoryTurnoverRatio" },
    { formulaId: "measurement.dsi_days", inputMap: { daysInPeriod: "daysInPeriod", inventoryTurnoverRatio: "inventoryTurnoverRatio" }, outputId: "dsiDays" },
    { formulaId: "cost.obsolescence_risk_cost", inputMap: { avgInventory: "avgInventory", obsolescenceRate: "obsolescenceRate" }, outputId: "obsolescenceRiskCost" },
    { formulaId: "cost.liquidation_loss", inputMap: { inventoryUnitCount: "inventoryUnitCount", avgSellingPrice: "avgSellingPrice", liquidationDiscount: "liquidationDiscount" }, outputId: "liquidationLoss" },
  ],
  reportTemplate: { title: "Stok Devir Hızı ve Risk Raporu", title_i18n: {"en":"Stok Devir Hızı ve Risk Raporu","tr":"Stok Devir Hızı ve Risk Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Stok devir = SMM / ortalama stok. DSI = gün / devir.", "Eskime risk maliyeti = stok × eskime oranı.", "Tasfiye zararı = adet × fiyat × iskonto oranı.", "OEM stokları ortalama 4-6 tur/yıl hedefler."],assumptionNotes_i18n:[{"en":"Stok devir = SMM / ortalama stok. DSI = gün / devir.","tr":"Stok devir = SMM / ortalama stok. DSI = gün / devir."},{"en":"Eskime risk maliyeti = stok × eskime oranı.","tr":"Eskime risk maliyeti = stok × eskime oranı."},{"en":"Tasfiye zararı = adet × fiyat × iskonto oranı.","tr":"Tasfiye zararı = adet × fiyat × iskonto oranı."},{"en":"OEM stokları ortalama 4-6 tur/yıl hedefler.","tr":"OEM stokları ortalama 4-6 tur/yıl hedefler."}] },
};
