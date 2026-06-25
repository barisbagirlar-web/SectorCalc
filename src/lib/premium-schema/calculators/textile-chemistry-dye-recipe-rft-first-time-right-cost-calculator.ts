import { TekstilkimyaBoyaReceteVeRftIlkSeferdeDogruMaliyetiCalculator30InputSchema, type TekstilkimyaBoyaReceteVeRftIlkSeferdeDogruMaliyetiCalculator30Input } from "./tekstilkimya-boya-recete-ve-rft-ilk-seferde-dogru-maliyeti-calculator-30-validation";

export const calculateTekstilkimyaBoyaReceteVeRftIlkSeferdeDogruMaliyetiCalculator30Contract: any = {
  id: "tekstilkimya-boya-recete-ve-rft-ilk-seferde-dogru-maliyeti-calculator-30",
  version: "1.0.0",
  category: "cost",
  inputSchema: TekstilkimyaBoyaReceteVeRftIlkSeferdeDogruMaliyetiCalculator30InputSchema,
  
  execute: async (input: any) => {
    try {
      const fabricWeightKg = input.fabricWeightKg;
      const liquorRatio = input.liquorRatio;
      const dyeChemCostKg = input.dyeChemCostKg;
      const waterTariffM3 = input.waterTariffM3;
      const energyCostBatch = input.energyCostBatch;
      const rftPct = input.rftPct;
      const reworkPenaltyMultiplier = input.reworkPenaltyMultiplier;

      // Formula: Bath_Volume_Liters = fabric_weight_kg * liquor_ratio
      const bathVolumeLiters = fabricWeightKg * liquorRatio;

      // Formula: Water_Cost = (Bath_Volume_Liters / 1000) * water_tariff_m3
      const waterCost = (bathVolumeLiters / 1000) * waterTariffM3;

      // Formula: Chem_Cost = fabric_weight_kg * dye_chem_cost_kg
      const chemCost = fabricWeightKg * dyeChemCostKg;

      // Formula: Base_Batch_Cost = Chem_Cost + Water_Cost + energy_cost_batch
      const baseBatchCost = chemCost + waterCost + energyCostBatch;

      // Formula: Rework_Prob = 1 - (rft_pct / 100)
      const reworkProb = 1 - (rftPct / 100);

      // Formula: Expected_Rework_Cost = Base_Batch_Cost * rework_penalty_multiplier * Rework_Prob
      const expectedReworkCost = baseBatchCost * reworkPenaltyMultiplier * reworkProb;

      // Formula: Total_Effective_Cost = Base_Batch_Cost + Expected_Rework_Cost
      const totalEffectiveCost = baseBatchCost + expectedReworkCost;

      // Formula: Cost_Per_Kg = Total_Effective_Cost / fabric_weight_kg
      const costPerKg = totalEffectiveCost / fabricWeightKg;

      return {
        bathVolumeLiters,
        waterCost,
        chemCost,
        baseBatchCost,
        reworkProb,
        expectedReworkCost,
        totalEffectiveCost,
        costPerKg
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};