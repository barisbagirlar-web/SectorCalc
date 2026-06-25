import { IleriStokastikEoqVeGuvenlikStoguOptimizasyonuCalculator34InputSchema, type IleriStokastikEoqVeGuvenlikStoguOptimizasyonuCalculator34Input } from "./ileri-stokastik-eoq-ve-guvenlik-stogu-optimizasyonu-calculator-34-validation";

export const calculateIleriStokastikEoqVeGuvenlikStoguOptimizasyonuCalculator34Contract: any = {
  id: "ileri-stokastik-eoq-ve-guvenlik-stogu-optimizasyonu-calculator-34",
  version: "1.0.0",
  category: "cost",
  inputSchema: IleriStokastikEoqVeGuvenlikStoguOptimizasyonuCalculator34InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        annualDemand,
        orderCost,
        holdingCostUnit,
        leadTimeDays,
        stdDevDemandDaily,
        stdDevLtDays,
        serviceLevelZ
      } = input;

      // Daily Demand
      const dailyDemand = annualDemand / 365;

      // Classic EOQ
      const classicEOQ = Math.sqrt((2 * annualDemand * orderCost) / holdingCostUnit);

      // Lead Time Demand Variance
      const leadTimeDemandVar = 
        (leadTimeDays * Math.pow(stdDevDemandDaily, 2)) + 
        (Math.pow(dailyDemand, 2) * Math.pow(stdDevLtDays, 2));

      // Safety Stock
      const safetyStock = serviceLevelZ * Math.sqrt(leadTimeDemandVar);

      // Reorder Point (ROP)
      const reorderPointROP = (dailyDemand * leadTimeDays) + safetyStock;

      // Average Inventory
      const avgInventory = (classicEOQ / 2) + safetyStock;

      // Total Inventory Cost
      const totalInventoryCost = 
        (annualDemand / classicEOQ) * orderCost + 
        (avgInventory * holdingCostUnit);

      // Inventory Turnover
      const inventoryTurnover = annualDemand / avgInventory;

      return {
        dailyDemand,
        classicEOQ,
        leadTimeDemandVar,
        safetyStock,
        reorderPointROP,
        avgInventory,
        totalInventoryCost,
        inventoryTurnover
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};