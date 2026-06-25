import { GidaFireVeReceteMarjKacagiYieldShrinkageCalculator137InputSchema, type GidaFireVeReceteMarjKacagiYieldShrinkageCalculator137Input } from "./gida-fire-ve-recete-marj-kacagi-yield-shrinkage-calculator-137-validation";

export const calculateGidaFireVeReceteMarjKacagiYieldShrinkageCalculator137Contract: any = {
  id: "gida-fire-ve-recete-marj-kacagi-yield-shrinkage-calculator-137",
  version: "1.0.0",
  category: "cost",
  inputSchema: GidaFireVeReceteMarjKacagiYieldShrinkageCalculator137InputSchema,
  
  execute: async (input: any) => {
    try {
      const validatedInput: GidaFireVeReceteMarjKacagiYieldShrinkageCalculator137Input = GidaFireVeReceteMarjKacagiYieldShrinkageCalculator137InputSchema.parse(input);

      const {
        rawInputKg,
        finishedOutputKg,
        spoiledWasteKg,
        rawCostPerKg,
        processingCostKg,
        theoreticalRecipeYield,
        salvageValueKg
      } = validatedInput;

      // Formula: Actual_Yield_Pct = (finished_output_kg / raw_input_kg) * 100
      const actualYieldPct = rawInputKg > 0 ? (finishedOutputKg / rawInputKg) * 100 : 0;

      // Formula: Shrinkage_kg = raw_input_kg - finished_output_kg
      const shrinkageKg = rawInputKg - finishedOutputKg;

      // Formula: Cost_Of_Shrinkage = Shrinkage_kg * raw_cost_per_kg
      const costOfShrinkage = shrinkageKg * rawCostPerKg;

      // Formula: Cost_Of_Spoilage_Added_Value = spoiled_waste_kg * processing_cost_kg
      const costOfSpoilageAddedValue = spoiledWasteKg * processingCostKg;

      // Formula: Salvage_Recovery = (Shrinkage_kg + spoiled_waste_kg) * salvage_value_kg
      const salvageRecovery = (shrinkageKg + spoiledWasteKg) * salvageValueKg;

      // Formula: Yield_Variance_Pct = theoretical_recipe_yield - Actual_Yield_Pct
      const yieldVariancePct = theoreticalRecipeYield - actualYieldPct;

      // Formula: Margin_Leak_Due_To_Variance = (Yield_Variance_Pct / 100) * raw_input_kg * (raw_cost_per_kg + processing_cost_kg)
      const marginLeakDueToVariance = (yieldVariancePct / 100) * rawInputKg * (rawCostPerKg + processingCostKg);

      // Formula: Total_Cost_Of_Quality_Loss = Cost_Of_Shrinkage + Cost_Of_Spoilage_Added_Value - Salvage_Recovery
      const totalCostOfQualityLoss = costOfShrinkage + costOfSpoilageAddedValue - salvageRecovery;

      return {
        actualYieldPct: Math.round(actualYieldPct * 100) / 100,
        shrinkageKg: Math.round(shrinkageKg * 100) / 100,
        costOfShrinkage: Math.round(costOfShrinkage * 100) / 100,
        costOfSpoilageAddedValue: Math.round(costOfSpoilageAddedValue * 100) / 100,
        salvageRecovery: Math.round(salvageRecovery * 100) / 100,
        yieldVariancePct: Math.round(yieldVariancePct * 100) / 100,
        marginLeakDueToVariance: Math.round(marginLeakDueToVariance * 100) / 100,
        totalCostOfQualityLoss: Math.round(totalCostOfQualityLoss * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};