import { IleriZamanEtuduVeOgrenmeEgrisiLearningCurveCalculator87InputSchema, type IleriZamanEtuduVeOgrenmeEgrisiLearningCurveCalculator87Input } from "./ileri-zaman-etudu-ve-ogrenme-egrisi-learning-curve-calculator-87-validation";

export const calculateIleriZamanEtuduVeOgrenmeEgrisiLearningCurveCalculator87Contract: any = {
  id: "ileri-zaman-etudu-ve-ogrenme-egrisi-learning-curve-calculator-87",
  version: "1.0.0",
  category: "cost",
  inputSchema: IleriZamanEtuduVeOgrenmeEgrisiLearningCurveCalculator87InputSchema,
  
  execute: async (input: IleriZamanEtuduVeOgrenmeEgrisiLearningCurveCalculator87Input) => {
    try {
      const firstUnitTime = input.firstUnitTime;
      const learningRatePct = input.learningRatePct;
      const targetUnitN = input.targetUnitN;
      const laborRate = input.laborRate;

      const learningRateDecimal = learningRatePct / 100;

      // Formula: b_index = LOG(learning_rate_pct / 100) / LOG(2)
      const bIndex = Math.log(learningRateDecimal) / Math.log(2);

      // Formula: Time_For_Nth_Unit = first_unit_time * POWER(target_unit_n, b_index)
      const timeForNthUnit = firstUnitTime * Math.pow(targetUnitN, bIndex);

      // Formula: Cumulative_Time_N = first_unit_time * (POWER(target_unit_n, b_index + 1)) / (b_index + 1)
      const cumulativeTimeN = firstUnitTime * (Math.pow(targetUnitN, bIndex + 1)) / (bIndex + 1);

      // Formula: Cumulative_Avg_Time_N = Cumulative_Time_N / target_unit_n
      const cumulativeAvgTimeN = cumulativeTimeN / targetUnitN;

      // Formula: Cost_For_Nth_Unit = (Time_For_Nth_Unit / 60) * labor_rate
      const costForNthUnit = (timeForNthUnit / 60) * laborRate;

      // Formula: Cumulative_Labor_Cost = (Cumulative_Time_N / 60) * labor_rate
      const cumulativeLaborCost = (cumulativeTimeN / 60) * laborRate;

      return {
        bIndex: Math.round(bIndex * 100000) / 100000,
        timeForNthUnit: Math.round(timeForNthUnit * 100) / 100,
        cumulativeTimeN: Math.round(cumulativeTimeN * 100) / 100,
        cumulativeAvgTimeN: Math.round(cumulativeAvgTimeN * 100) / 100,
        costForNthUnit: Math.round(costForNthUnit * 100) / 100,
        cumulativeLaborCost: Math.round(cumulativeLaborCost * 100) / 100,
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};