import { EpqEkonomikUretimMiktariVeMaxEnvanterCalculator52InputSchema, type EpqEkonomikUretimMiktariVeMaxEnvanterCalculator52Input } from "./epq-ekonomik-uretim-miktari-ve-max-envanter-calculator-52-validation";

export const calculateEpqEkonomikUretimMiktariVeMaxEnvanterCalculator52Contract: any = {
  id: "epq-ekonomik-uretim-miktari-ve-max-envanter-calculator-52",
  version: "1.0.0",
  category: "cost",
  inputSchema: EpqEkonomikUretimMiktariVeMaxEnvanterCalculator52InputSchema,
  
  execute: async (input: any) => {
    try {
      const annualDemand = input.annualDemand;
      const dailyProduction = input.dailyProduction;
      const dailyDemand = input.dailyDemand;
      const setupCost = input.setupCost;
      const holdingCost = input.holdingCost;

      // Validate inputs to prevent division by zero or negative square roots
      if (annualDemand <= 0 || dailyProduction <= 0 || dailyDemand <= 0 || setupCost <= 0 || holdingCost <= 0) {
        throw new Error("All input values must be positive numbers greater than zero.");
      }

      if (dailyDemand >= dailyProduction) {
        throw new Error("Daily demand (d) must be less than daily production (p) for EPQ model to be valid.");
      }

      const utilizationRate = dailyDemand / dailyProduction;
      const ePQ = Math.sqrt((2 * annualDemand * setupCost) / (holdingCost * (1 - utilizationRate)));
      const maxInventory = ePQ * (1 - utilizationRate);
      const avgInventory = maxInventory / 2;
      const productionRunTimeDays = ePQ / dailyProduction;
      const cycleTimeDays = ePQ / dailyDemand;
      const annualSetups = annualDemand / ePQ;
      const annualSetupCost = annualSetups * setupCost;
      const annualHoldingCost = avgInventory * holdingCost;
      const totalInventoryCost = annualSetupCost + annualHoldingCost;

      return {
        ePQ: Math.round(ePQ * 100) / 100,
        maxInventory: Math.round(maxInventory * 100) / 100,
        avgInventory: Math.round(avgInventory * 100) / 100,
        productionRunTimeDays: Math.round(productionRunTimeDays * 100) / 100,
        cycleTimeDays: Math.round(cycleTimeDays * 100) / 100,
        annualSetups: Math.round(annualSetups * 100) / 100,
        annualSetupCost: Math.round(annualSetupCost * 100) / 100,
        annualHoldingCost: Math.round(annualHoldingCost * 100) / 100,
        totalInventoryCost: Math.round(totalInventoryCost * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};