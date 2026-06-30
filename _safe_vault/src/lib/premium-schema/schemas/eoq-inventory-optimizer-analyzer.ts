/**
 * Tool #37 — EOQ Envanter
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const EOQ_INVENTORY_SCHEMA: PremiumCalculatorSchema = {
  id: "eoq-inventory-optimizer-analyzer", legacyPaidSlug: "eoq-inventory-optimizer-analyzer",
  name: "EOQ Envanter Optimizasyonu", name_i18n: {"en":"EOQ Envanter Optimizasyonu","tr":"EOQ Envanter Optimizasyonu"}, sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Envanter yönetiminde EOQ, ROP ve güvenlik stoğu hesaplanmazsa ya stok fazlası ya da stoksuz kalma maliyeti oluşur.", painStatement_i18n: {"en":"Envanter yönetiminde EOQ, ROP ve güvenlik stoğu hesaplanmazsa ya stok fazlası ya da stoksuz kalma maliyeti oluşur.","tr":"Envanter yönetiminde EOQ, ROP ve güvenlik stoğu hesaplanmazsa ya stok fazlası ya da stoksuz kalma maliyeti oluşur."},
  inputs: [
    { id: "annualDemand", label: "Yıllık Talep", label_i18n: {"en":"Annual demand","tr":"Yıllık Talep"}, type: "number", unit: "adet", required: true, smartDefault: 10000, validation: { min: 1 }, helper: "", expertMeaning: "Annual demand", expertMeaning_i18n: {"en":"Annual demand","tr":"yıllık talep"} },
    { id: "orderCost", label: "Sipariş Maliyeti", label_i18n: {"en":"Cost per order","tr":"Sipariş Maliyeti"}, type: "number", unit: "USD/sipariş", required: true, smartDefault: 50, validation: { min: 1 }, helper: "", expertMeaning: "Cost per order", expertMeaning_i18n: {"en":"Cost per order","tr":"sipariş maliyeti"} },
    { id: "holdingCost", label: "Taşıma Maliyeti", label_i18n: {"en":"Holding cost per unit","tr":"Taşıma Maliyeti"}, type: "number", unit: "USD/adet/yıl", required: true, smartDefault: 2, validation: { min: 0.01 }, helper: "", expertMeaning: "Holding cost per unit", expertMeaning_i18n: {"en":"Holding cost per unit","tr":"taşıma maliyeti"} },
    { id: "leadTime", label: "Teslim Süresi", label_i18n: {"en":"Lead time in days","tr":"Teslim Süresi"}, type: "number", unit: "gün", required: true, smartDefault: 7, validation: { min: 1 }, helper: "", expertMeaning: "Lead time in days", expertMeaning_i18n: {"en":"Lead time in days","tr":"teslim süresi"} },
    { id: "demandStdDev", label: "Talep Std. Sapma", label_i18n: {"en":"Talep Std. Sapma","tr":"Talep Std. Sapma"}, type: "number", unit: "adet/gün", required: false, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Daily demand std dev", expertMeaning_i18n: {"en":"Daily demand std dev","tr":"Daily demand std dev"} },
    { id: "zScore", label: "Z-Skor (Servis Seviyesi)", label_i18n: {"en":"Z-Skor (Servis Seviyesi)","tr":"Z-Skor (Servis Seviyesi)"}, type: "number", unit: "", required: false, smartDefault: 1.65, validation: { min: 0, max: 4 }, helper: "", expertMeaning: "Z-score for 95% service", expertMeaning_i18n: {"en":"Z-score for 95% service","tr":"Z-score for 95% service"} },
    { id: "avgInventory", label: "Ortalama Stok Seviyesi", label_i18n: {"en":"Ortalama Stok Seviyesi","tr":"Ortalama Stok Seviyesi"}, type: "number", unit: "adet", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Average inventory level", expertMeaning_i18n: {"en":"Average inventory level","tr":"Average inventory level"} },
  ],
  outputs: [
    { id: "eoq", label: "EOQ (Optimum Sipariş)", label_i18n: {"en":"EOQ (Optimum Siparis)","tr":"EOQ (Optimum Sipariş)"}, unit: "adet", format: "number" },
    { id: "safetyStock", label: "Güvenlik Stoğu", label_i18n: {"en":"Guvenlik Stogu","tr":"Güvenlik Stoğu"}, unit: "adet", format: "number" },
    { id: "rop", label: "Yeniden Sipariş Noktası (ROP)", label_i18n: {"en":"Yeniden Siparis Noktas (ROP)","tr":"Yeniden Sipariş Noktası (ROP)"}, unit: "adet", format: "number" },
    { id: "totalInvCost", label: "Toplam Envanter Maliyeti", label_i18n: {"en":"Toplam Envanter Maliyeti","tr":"Toplam Envanter Maliyeti"}, unit: "USD/yıl", format: "currency" },
    { id: "inventoryTurnover", label: "Stok Devir Hızı", label_i18n: {"en":"Stok Devir Hz","tr":"Stok Devir Hızı"}, unit: "tur/yıl", format: "number", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "totalInvCost", warning: 10000, critical: 25000, direction: "higher_is_bad", warningMessage: "Maliyet > $10K — EOQ optimizasyonu önerilir.", warningMessage_i18n: {"en":"Maliyet > $10K — EOQ optimizasyonu önerilir.","tr":"Maliyet > $10K — EOQ optimizasyonu önerilir."}, criticalMessage: "Maliyet > $25K — envanter politikası yenilenmeli.", criticalMessage_i18n: {"en":"Maliyet > $25K — envanter politikası yenilenmeli.","tr":"Maliyet > $25K — envanter politikası yenilenmeli."} }],
  formulaPipeline: [
    { formulaId: "cost.eoq", inputMap: { annualDemand: "annualDemand", orderCost: "orderCost", holdingCost: "holdingCost" }, outputId: "eoq" },
    { formulaId: "measurement.eoq_safety_stock", inputMap: {
        zScore: "zScore",
        leadTime: "leadTime",
        stdDev: "demandStdDev"
      }, outputId: "safetyStock" },
    { formulaId: "measurement.eoq_rop", inputMap: { leadTime: "leadTime", dailyDemand: "annualDemand", safetyStock: "safetyStock" }, outputId: "rop" },
    { formulaId: "cost.eoq_total_cost", inputMap: { annualDemand: "annualDemand", eoq: "eoq", orderCost: "orderCost", safetyStock: "safetyStock", holdingCost: "holdingCost" }, outputId: "totalInvCost" },
    { formulaId: "measurement.eoq_turnover", inputMap: {
        annualDemand: "annualDemand",
        avgInv: "avgInventory"
      }, outputId: "inventoryTurnover" },
  ],
  reportTemplate: { title: "EOQ Inventory Report", title_i18n: {"en":"EOQ Inventory Report","tr":"EOQ Inventory Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["EOQ = √(2×Demand×Order/Holding).", "Safety = Z×StdDev×√LT. ROP = LT×DailyDemand+Safety.", "Total = (Demand/EOQ)×Order + (EOQ/2+Safety)×Holding."],assumptionNotes_i18n:[{"en":"EOQ = √(2×Demand×Order/Holding).","tr":"EOQ = √(2×Demand×Order/Holding)."},{"en":"Safety = Z×StdDev×√LT. ROP = LT×DailyDemand+Safety.","tr":"Safety = Z×StdDev×√LT. ROP = LT×DailyDemand+Safety."},{"en":"Total = (Demand/EOQ)×Order + (EOQ/2+Safety)×Holding.","tr":"Total = (Demand/EOQ)×Order + (EOQ/2+Safety)×Holding."}] },
};
