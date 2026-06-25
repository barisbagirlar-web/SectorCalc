import { OgrenmeEgrisiWrightModeliCostVeFiyatlamaEtkisiCalculator128InputSchema, type OgrenmeEgrisiWrightModeliCostVeFiyatlamaEtkisiCalculator128Input } from "./ogrenme-egrisi-wright-modeli-cost-ve-fiyatlama-etkisi-calculator-128-validation";

export const calculateOgrenmeEgrisiWrightModeliCostVeFiyatlamaEtkisiCalculator128Contract: any = {
  id: "ogrenme-egrisi-wright-modeli-cost-ve-fiyatlama-etkisi-calculator-128",
  version: "1.0.0",
  category: "cost",
  inputSchema: OgrenmeEgrisiWrightModeliCostVeFiyatlamaEtkisiCalculator128InputSchema,
  
  execute: async (input: any) => {
    try {
      const timeUnit1 = input.timeUnit1 as number;
      const learningRatePct = input.learningRatePct as number;
      const targetUnitN = input.targetUnitN as number;
      const totalBatchSize = input.totalBatchSize as number;
      const laborRateHr = input.laborRateHr as number;

      // Validate inputs
      if (timeUnit1 <= 0 || learningRatePct <= 0 || learningRatePct >= 100 || targetUnitN <= 0 || totalBatchSize <= 0 || laborRateHr <= 0) {
        throw new Error("Invalid input parameters. All values must be positive numbers and learning rate must be between 0 and 100.");
      }

      // Formula: b_index = LOG10(learning_rate_pct / 100) / LOG10(2)
      const bIndex = Math.log10(learningRatePct / 100) / Math.log10(2);

      // Formula: Time_For_Nth_Unit = time_unit_1 * POWER(target_unit_N, b_index)
      const timeForNthUnit = timeUnit1 * Math.pow(targetUnitN, bIndex);

      // Formula: Cumulative_Time_Batch = time_unit_1 * (POWER(total_batch_size, b_index + 1)) / (b_index + 1)
      const cumulativeTimeBatch = (timeUnit1 * Math.pow(totalBatchSize, bIndex + 1)) / (bIndex + 1);

      // Formula: Cumulative_Avg_Time = Cumulative_Time_Batch / total_batch_size
      const cumulativeAvgTime = cumulativeTimeBatch / totalBatchSize;

      // Formula: Cost_For_Nth_Unit = Time_For_Nth_Unit * labor_rate_hr
      const costForNthUnit = timeForNthUnit * laborRateHr;

      // Formula: Total_Labor_Cost_Batch = Cumulative_Time_Batch * labor_rate_hr
      const totalLaborCostBatch = cumulativeTimeBatch * laborRateHr;

      return {
        bIndex: Math.round(bIndex * 10000) / 10000,
        timeForNthUnit: Math.round(timeForNthUnit * 100) / 100,
        cumulativeTimeBatch: Math.round(cumulativeTimeBatch * 100) / 100,
        cumulativeAvgTime: Math.round(cumulativeAvgTime * 100) / 100,
        costForNthUnit: Math.round(costForNthUnit * 100) / 100,
        totalLaborCostBatch: Math.round(totalLaborCostBatch * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};