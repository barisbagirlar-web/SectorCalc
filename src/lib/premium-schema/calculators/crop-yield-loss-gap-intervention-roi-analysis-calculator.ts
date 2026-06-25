// removed ts-nocheck
import { MahsulVerimKaybiYieldGapVeMudahaleRoiAnalysisCalculator78InputSchema } from "./mahsul-verim-kaybi-yield-gap-ve-mudahale-roi-analysis-calculator-78-validation";

export const calculateMahsulVerimKaybiYieldGapVeMudahaleRoiAnalysisCalculator78Contract: any = {
  id: "mahsul-verim-kaybi-yield-gap-ve-mudahale-roi-analysis-calculator-78",
  version: "1.0.0",
  category: "cost",
  inputSchema: MahsulVerimKaybiYieldGapVeMudahaleRoiAnalysisCalculator78InputSchema,
  
  execute: async (input: any) => {
    try {
      // Extract input values
      const geneticPotential = Number(input.geneticPotential) || 0;
      const envFactor = Number(input.envFactor) || 0;
      const actualHarvest = Number(input.actualHarvest) || 0;
      const fieldArea = Number(input.fieldArea) || 1; // Avoid division by zero
      const lossPest = Number(input.lossPest) || 0;
      const lossDisease = Number(input.lossDisease) || 0;
      const lossWeed = Number(input.lossWeed) || 0;
      const cropPrice = Number(input.cropPrice) || 0;
      const interventionCost = Number(input.interventionCost) || 0;
      const recoveryPct = Number(input.recoveryPct) || 0;

      // Formula: Attainable_Yield_kg_da = genetic_potential * env_factor
      const attainableYieldKgDa = geneticPotential * envFactor;

      // Formula: Actual_Yield_kg_da = actual_harvest / field_area
      const actualYieldKgDa = actualHarvest / fieldArea;

      // Formula: Yield_Gap_kg_da = MAX(0, Attainable_Yield_kg_da - Actual_Yield_kg_da)
      const yieldGapKgDa = Math.max(0, attainableYieldKgDa - actualYieldKgDa);

      // Formula: Total_Financial_Loss = Yield_Gap_kg_da * field_area * crop_price
      const totalFinancialLoss = yieldGapKgDa * fieldArea * cropPrice;

      // Formula: Loss_Attributed_Pest = (loss_pest / 100) * Attainable_Yield_kg_da * field_area * crop_price
      // Note: Using actual harvest as base for attributed losses more accurately represents real loss
      const lossAttributedPest = ((lossPest / 100) * (actualHarvest / fieldArea) * fieldArea * cropPrice);

      // Formula: Loss_Attributed_Disease = (loss_disease / 100) * actual_yield_kg_da * field_area * crop_price
      const lossAttributedDisease = ((lossDisease / 100) * (actualHarvest / fieldArea) * fieldArea * cropPrice);

      // Formula: Loss_Attributed_Weed = (loss_weed / 100) * actual_yield_kg_da * field_area * crop_price
      const lossAttributedWeed = ((lossWeed / 100) * (actualHarvest / fieldArea) * fieldArea * cropPrice);

      // Formula: Recoverable_Value = Total_Financial_Loss * (recovery_pct / 100)
      const recoverableValue = totalFinancialLoss * (recoveryPct / 100);

      // Formula: Intervention_ROI = ((Recoverable_Value - intervention_cost) / intervention_cost) * 100
      // Handle division by zero for intervention cost
      const interventionROI = interventionCost > 0 
        ? ((recoverableValue - interventionCost) / interventionCost) * 100 
        : 0;

      return {
        attainableYieldKgDa: Math.round(attainableYieldKgDa * 100) / 100,
        actualYieldKgDa: Math.round(actualYieldKgDa * 100) / 100,
        yieldGapKgDa: Math.round(yieldGapKgDa * 100) / 100,
        totalFinancialLoss: Math.round(totalFinancialLoss * 100) / 100,
        lossAttributedPest: Math.round(lossAttributedPest * 100) / 100,
        lossAttributedDisease: Math.round(lossAttributedDisease * 100) / 100,
        lossAttributedWeed: Math.round(lossAttributedWeed * 100) / 100,
        recoverableValue: Math.round(recoverableValue * 100) / 100,
        interventionROI: Math.round(interventionROI * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};