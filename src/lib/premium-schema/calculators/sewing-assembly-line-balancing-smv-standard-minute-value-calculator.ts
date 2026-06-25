import { DikismontajHattiDengelemeVeSmvStandartDakikaDegeriCalculator29InputSchema, type DikismontajHattiDengelemeVeSmvStandartDakikaDegeriCalculator29Input } from "./dikismontaj-hatti-dengeleme-ve-smv-standart-dakika-degeri-calculator-29-validation";

export const calculateDikismontajHattiDengelemeVeSmvStandartDakikaDegeriCalculator29Contract: any = {
  id: "dikismontaj-hatti-dengeleme-ve-smv-standart-dakika-degeri-calculator-29",
  version: "1.0.0",
  category: "cost",
  inputSchema: DikismontajHattiDengelemeVeSmvStandartDakikaDegeriCalculator29InputSchema,
  
  execute: async (input: any) => {
    try {
      const { taskSmvArray, shiftDurationMin, dailyTargetQty, actualOperators, laborRateHr } = input;

      // Convert taskSmvArray from string if needed, ensure it's an array of numbers
      const smvValues: number[] = Array.isArray(taskSmvArray) 
        ? taskSmvArray.map(v => Number(v)) 
        : typeof taskSmvArray === 'string' 
          ? taskSmvArray.split(',').map(v => Number(v.trim())).filter(v => !isNaN(v))
          : [];

      if (smvValues.length === 0 || shiftDurationMin <= 0 || dailyTargetQty <= 0 || actualOperators <= 0 || laborRateHr <= 0) {
        return {
          taktTime: 0,
          totalSMV: 0,
          theoOperators: 0,
          maxStationTime: 0,
          lineEfficiency: 0,
          balanceDelay: 0,
          laborCostPerUnit: 0
        };
      }

      // Formula: TaktTime = shift_duration_min / daily_target_qty
      const taktTime = shiftDurationMin / dailyTargetQty;

      // Formula: Total_SMV = SUM(task_smv_array)
      const totalSMV = smvValues.reduce((sum, val) => sum + val, 0);

      // Formula: Theo_Operators = Total_SMV / TaktTime
      const theoOperators = totalSMV / taktTime;

      // Formula: Max_Station_Time = MAX(task_smv_array)
      const maxStationTime = Math.max(...smvValues);

      // Formula: Line_Efficiency = (Total_SMV / (actual_operators * Max_Station_Time)) * 100
      const lineEfficiency = (totalSMV / (actualOperators * maxStationTime)) * 100;

      // Formula: Balance_Delay = 100 - Line_Efficiency
      const balanceDelay = 100 - lineEfficiency;

      // Formula: Labor_Cost_Per_Unit = (actual_operators * (shift_duration_min / 60) * labor_rate_hr) / (shift_duration_min / maxStationTime)
      const laborCostPerUnit = (actualOperators * (shiftDurationMin / 60) * laborRateHr) / (shiftDurationMin / maxStationTime);

      return {
        taktTime: Math.round(taktTime * 100) / 100,
        totalSMV: Math.round(totalSMV * 100) / 100,
        theoOperators: Math.round(theoOperators * 100) / 100,
        maxStationTime: Math.round(maxStationTime * 100) / 100,
        lineEfficiency: Math.round(lineEfficiency * 100) / 100,
        balanceDelay: Math.round(balanceDelay * 100) / 100,
        laborCostPerUnit: Math.round(laborCostPerUnit * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};