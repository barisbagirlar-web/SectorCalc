import { CokKademeliEvaporatorIsiDengesiVeBuharEkonomisiFaktoruCalculator168InputSchema, type CokKademeliEvaporatorIsiDengesiVeBuharEkonomisiFaktoruCalculator168Input } from "./cok-kademeli-evaporator-isi-dengesi-ve-buhar-ekonomisi-faktoru-calculator-168-validation";

export const calculateCokKademeliEvaporatorIsiDengesiVeBuharEkonomisiFaktoruCalculator168Contract: any = {
  id: "cok-kademeli-evaporator-isi-dengesi-ve-buhar-ekonomisi-faktoru-calculator-168",
  version: "1.0.0",
  category: "cost",
  inputSchema: CokKademeliEvaporatorIsiDengesiVeBuharEkonomisiFaktoruCalculator168InputSchema,
  
  execute: async (input: any) => {
    try {
      const { 
        stagesCount, 
        liveSteamInputTon, 
        totalEvapWaterTon, 
        latentHeatLiveKj, 
        steamCostTon 
      } = input;

      // Validate inputs
      if (stagesCount <= 0 || liveSteamInputTon <= 0 || totalEvapWaterTon <= 0 || latentHeatLiveKj <= 0 || steamCostTon <= 0) {
        throw new Error("All input values must be greater than zero");
      }

      // Steam Economy: Total water evaporated per unit of live steam input
      const steamEconomy = totalEvapWaterTon / liveSteamInputTon;

      // Theoretical Max Economy: Based on number of stages (ideal Carnot-type limit for multi-stage evaporators)
      // Typical theoretical max for N stages is approximately N * 0.9 (accounts for thermodynamic losses)
      const theoreticalMaxEconomy = stagesCount * 0.9;

      // Economy Efficiency: How close actual economy is to theoretical maximum
      const economyEfficiencyPct = (steamEconomy / theoreticalMaxEconomy) * 100;

      // Annual Steam Cost: Based on live steam usage and cost per ton
      const annualSteamCost = liveSteamInputTon * steamCostTon;

      // Wasted Steam: Calculated based on ideal steam requirement vs actual usage
      // Ideal steam needed = totalEvapWaterTon / (stagesCount * evaporationEfficiency)
      // Using 0.85 as typical evaporation efficiency factor per stage
      const idealSteamRequired = totalEvapWaterTon / (0.85 * stagesCount);
      const wastedSteamTon = Math.max(0, idealSteamRequired - liveSteamInputTon);

      return {
        steamEconomy: Math.round(steamEconomy * 100) / 100,
        theoreticalMaxEconomy: Math.round(theoreticalMaxEconomy * 100) / 100,
        economyEfficiencyPct: Math.round(economyEfficiencyPct * 100) / 100,
        annualSteamCost: Math.round(annualSteamCost * 100) / 100,
        wastedSteamTon: Math.round(wastedSteamTon * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};