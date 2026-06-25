import { SmedMatrisiVeEoqEnvanterOptimizasyonuCalculator25InputSchema, type SmedMatrisiVeEoqEnvanterOptimizasyonuCalculator25Input } from "./smed-matrisi-ve-eoq-envanter-optimizasyonu-calculator-25-validation";

export const calculateSmedMatrisiVeEoqEnvanterOptimizasyonuCalculator25Contract: any = {
  id: "smed-matrisi-ve-eoq-envanter-optimizasyonu-calculator-25",
  version: "1.0.0",
  category: "cost",
  inputSchema: SmedMatrisiVeEoqEnvanterOptimizasyonuCalculator25InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        internalSetupMin,
        externalSetupMin,
        conversionRate,
        changeoversYr,
        machineRate,
        annualDemand,
        holdingCostUnit
      } = input;

      // Validate inputs are numbers and not negative
      const validConversionRate = Math.max(0, Math.min(100, Number(conversionRate)));
      const validInternalSetupMin = Math.max(0, Number(internalSetupMin));
      const validExternalSetupMin = Math.max(0, Number(externalSetupMin));
      const validChangeoversYr = Math.max(0, Number(changeoversYr));
      const validMachineRate = Math.max(0, Number(machineRate));
      const validAnnualDemand = Math.max(0, Number(annualDemand));
      const validHoldingCostUnit = Math.max(0, Number(holdingCostUnit));

      // Formula: Target_Internal = internal_setup_min * (1 - (conversion_rate / 100))
      const targetInternal = validInternalSetupMin * (1 - (validConversionRate / 100));

      // Formula: Target_External = external_setup_min + (internal_setup_min * (conversion_rate / 100))
      const targetExternal = validExternalSetupMin + (validInternalSetupMin * (validConversionRate / 100));

      // Formula: Time_Saved_Min = internal_setup_min - Target_Internal
      const timeSavedMin = validInternalSetupMin - targetInternal;

      // Formula: Current_Setup_Cost = (internal_setup_min / 60) * machine_rate
      const currentSetupCost = (validInternalSetupMin / 60) * validMachineRate;

      // Formula: New_Setup_Cost = (Target_Internal / 60) * machine_rate
      const newSetupCost = (targetInternal / 60) * validMachineRate;

      // Formula: Annual_Setup_Savings = (Current_Setup_Cost - New_Setup_Cost) * changeovers_yr
      const annualSetupSavings = (currentSetupCost - newSetupCost) * validChangeoversYr;

      // Formula: Current_EOQ = SQRT((2 * annual_demand * Current_Setup_Cost) / holding_cost_unit)
      const currentEOQ = validHoldingCostUnit > 0 
        ? Math.sqrt((2 * validAnnualDemand * currentSetupCost) / validHoldingCostUnit)
        : 0;

      // Formula: New_EOQ = SQRT((2 * annual_demand * New_Setup_Cost) / holding_cost_unit)
      const newEOQ = validHoldingCostUnit > 0
        ? Math.sqrt((2 * validAnnualDemand * newSetupCost) / validHoldingCostUnit)
        : 0;

      // Formula: Inventory_Reduction_Value = ((Current_EOQ - New_EOQ) / 2) * holding_cost_unit
      const inventoryReductionValue = ((currentEOQ - newEOQ) / 2) * validHoldingCostUnit;

      // Formula: Total_Financial_Benefit = Annual_Setup_Savings + Inventory_Reduction_Value
      const totalFinancialBenefit = annualSetupSavings + inventoryReductionValue;

      return {
        targetInternal: Math.round(targetInternal * 100) / 100,
        targetExternal: Math.round(targetExternal * 100) / 100,
        timeSavedMin: Math.round(timeSavedMin * 100) / 100,
        currentSetupCost: Math.round(currentSetupCost * 100) / 100,
        newSetupCost: Math.round(newSetupCost * 100) / 100,
        annualSetupSavings: Math.round(annualSetupSavings * 100) / 100,
        currentEOQ: Math.round(currentEOQ * 100) / 100,
        newEOQ: Math.round(newEOQ * 100) / 100,
        inventoryReductionValue: Math.round(inventoryReductionValue * 100) / 100,
        totalFinancialBenefit: Math.round(totalFinancialBenefit * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};