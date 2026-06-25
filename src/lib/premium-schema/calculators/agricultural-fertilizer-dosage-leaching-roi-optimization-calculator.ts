import { TarimsalGubreDozajLeachingSizmaVeRoiOptimizasyonuCalculator136InputSchema, type TarimsalGubreDozajLeachingSizmaVeRoiOptimizasyonuCalculator136Input } from "./tarimsal-gubre-dozaj-leaching-sizma-ve-roi-optimizasyonu-calculator-136-validation";

export const calculateTarimsalGubreDozajLeachingSizmaVeRoiOptimizasyonuCalculator136Contract: any = {
  id: "tarimsal-gubre-dozaj-leaching-sizma-ve-roi-optimizasyonu-calculator-136",
  version: "1.0.0",
  category: "cost",
  inputSchema: TarimsalGubreDozajLeachingSizmaVeRoiOptimizasyonuCalculator136InputSchema,
  
  execute: async (input: any) => {
    try {
      // Formula: Nutrient_Required_Total_kg_da = (target_yield_kg_da / 1000) * plant_req_nutrient
      const nutrientRequiredTotalKgDa = (input.targetYieldKgDa / 1000) * input.plantReqNutrient;

      // Formula: Nutrient_Deficit_kg_da = MAX(0, Nutrient_Required_Total_kg_da - soil_supply)
      const nutrientDeficitKgDa = Math.max(0, nutrientRequiredTotalKgDa - input.soilSupply);

      // Formula: Pure_Nutrient_To_Apply_kg_da = Nutrient_Deficit_kg_da / (fertilizer_efficiency / 100)
      const pureNutrientToApplyKgDa = nutrientDeficitKgDa / (input.fertilizerEfficiency / 100);

      // Formula: Commercial_Fertilizer_Rate_kg_da = Pure_Nutrient_To_Apply_kg_da / (fertilizer_content_pct / 100)
      const commercialFertilizerRateKgDa = pureNutrientToApplyKgDa / (input.fertilizerContentPct / 100);

      // Formula: Total_Fertilizer_Needed_kg = Commercial_Fertilizer_Rate_kg_da * field_area
      const totalFertilizerNeededKg = commercialFertilizerRateKgDa * input.fieldArea;

      // Formula: Total_Application_Cost = Total_Fertilizer_Needed_kg * fertilizer_price
      const totalApplicationCost = totalFertilizerNeededKg * input.fertilizerPrice;

      // Formula: Environmental_Leach_Loss_kg = Pure_Nutrient_To_Apply_kg_da * leaching_coeff * field_area
      const environmentalLeachLossKg = pureNutrientToApplyKgDa * input.leachingCoeff * input.fieldArea;

      // Formula: Expected_Revenue = target_yield_kg_da * field_area * crop_price
      const expectedRevenue = input.targetYieldKgDa * input.fieldArea * input.cropPrice;

      // Formula: Base_Revenue_No_Fertilizer = (soil_supply / plant_req_nutrient) * 1000 * field_area * crop_price
      // Protect against division by zero - if plant_req_nutrient is 0, base revenue is 0 as no nutrients are needed
      const baseRevenueNoFertilizer = input.plantReqNutrient !== 0 
        ? (input.soilSupply / input.plantReqNutrient) * 1000 * input.fieldArea * input.cropPrice
        : 0;

      // Formula: Value_Added_By_Fertilizer = Expected_Revenue - Base_Revenue_No_Fertilizer
      const valueAddedByFertilizer = expectedRevenue - baseRevenueNoFertilizer;

      // Formula: Fertilizer_ROI_Pct = ((Value_Added_By_Fertilizer - Total_Application_Cost) / Total_Application_Cost) * 100
      // Protect against division by zero - if no cost, ROI is infinite but we'll return 0
      const fertilizerROIPct = totalApplicationCost !== 0
        ? ((valueAddedByFertilizer - totalApplicationCost) / totalApplicationCost) * 100
        : 0;

      return {
        nutrientRequiredTotalKgDa,
        nutrientDeficitKgDa,
        pureNutrientToApplyKgDa,
        commercialFertilizerRateKgDa,
        totalFertilizerNeededKg,
        totalApplicationCost,
        environmentalLeachLossKg,
        expectedRevenue,
        baseRevenueNoFertilizer,
        valueAddedByFertilizer,
        fertilizerROIPct
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};