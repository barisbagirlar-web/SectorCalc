
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const EOQ_INVENTORY_SCHEMA: PremiumCalculatorSchema = {
  id: "eoq-inventory-optimizer-analyzer", legacyPaidSlug: "eoq-inventory-optimizer-analyzer",
  name: "EOQ Inventory Optimizer", name_i18n: {"en":"EOQ Inventory Optimizer"}, sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Without calculating EOQ, ROP, and safety stock in inventory management, either excess inventory or stockout costs arise.", painStatement_i18n: {"en":"Without calculating EOQ, ROP, and safety stock in inventory management, either excess inventory or stockout costs arise."},
  inputs: [
    { id: "annualDemand", label: "Annual demand", label_i18n: {"en":"Annual demand"}, type: "number", unit: "units", required: true, smartDefault: 10000, validation: { min: 1 }, helper: "", expertMeaning: "Annual demand", expertMeaning_i18n: {"en":"Annual demand"} },
    { id: "orderCost", label: "Cost per order", label_i18n: {"en":"Cost per order"}, type: "number", unit: "USD/siparis", required: true, smartDefault: 50, validation: { min: 1 }, helper: "", expertMeaning: "Cost per order", expertMeaning_i18n: {"en":"Cost per order"} },
    { id: "holdingCost", label: "Holding cost per unit", label_i18n: {"en":"Holding cost per unit"}, type: "number", unit: "USD/unit/year", required: true, smartDefault: 2, validation: { min: 0.01 }, helper: "", expertMeaning: "Holding cost per unit", expertMeaning_i18n: {"en":"Holding cost per unit"} },
    { id: "leadTime", label: "Lead time in days", label_i18n: {"en":"Lead time in days"}, type: "number", unit: "days", required: true, smartDefault: 7, validation: { min: 1 }, helper: "", expertMeaning: "Lead time in days", expertMeaning_i18n: {"en":"Lead time in days"} },
    { id: "demandStdDev", label: "demand Std. Deviation", label_i18n: {"en":"demand Std. Deviation"}, type: "number", unit: "units/day", required: false, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Daily demand std dev", expertMeaning_i18n: {"en":"Daily demand std dev"} },
    { id: "zScore", label: "Z-Skor (Servis level)", label_i18n: {"en":"Z-Skor (Servis level)"}, type: "number", unit: "scalar", required: false, smartDefault: 1.65, validation: { min: 0, max: 4 }, helper: "", expertMeaning: "Z-score for 95% service", expertMeaning_i18n: {"en":"Z-score for 95% service"} },
    { id: "avgInventory", label: "Average Inventory level", label_i18n: {"en":"Average Inventory level"}, type: "number", unit: "units", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Average inventory level", expertMeaning_i18n: {"en":"Average inventory level"} },
  ],
  outputs: [
    { id: "eoq", label: "EOQ (Optimum Siparis)", label_i18n: {"en":"EOQ (Optimum Siparis)"}, unit: "units", format: "number" },
    { id: "safetyStock", label: "Guvenlik Inventory", label_i18n: {"en":"Guvenlik Inventory"}, unit: "units", format: "number" },
    { id: "rop", label: "re Siparis Point (ROP)", label_i18n: {"en":"re Siparis Point (ROP)"}, unit: "units", format: "number" },
    { id: "totalInvCost", label: "Total Envanter Cost", label_i18n: {"en":"Total Envanter Cost"}, unit: "USD/year", format: "currency" },
    { id: "inventoryTurnover", label: "Inventory Turnover Rate", label_i18n: {"en":"Inventory Turnover Rate"}, unit: "tur/yil", format: "number", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "totalInvCost", warning: 10000, critical: 25000, direction: "higher_is_bad", warningMessage: "Cost > $10K — EOQ optimization recommended.", warningMessage_i18n: {"en":"Cost > $10K — EOQ optimization recommended."}, criticalMessage: "Cost > $25K — envanter policy yenilenmeli.", criticalMessage_i18n: {"en":"Cost > $25K — envanter policy yenilenmeli."} }],
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
  reportTemplate: { title: "EOQ Inventory Report", title_i18n: {"en":"EOQ Inventory Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["EOQ = √(2×Demand×Order/Holding).", "Safety = Z×StdDev×√LT. ROP = LT×DailyDemand+Safety.", "Total = (Demand/EOQ)×Order + (EOQ/2+Safety)×Holding."],assumptionNotes_i18n:[{"en":"EOQ = √(2×Demand×Order/Holding)."},{"en":"Safety = Z×StdDev×√LT. ROP = LT×DailyDemand+Safety."},{"en":"Total = (Demand/EOQ)×Order + (EOQ/2+Safety)×Holding."}] },
};
