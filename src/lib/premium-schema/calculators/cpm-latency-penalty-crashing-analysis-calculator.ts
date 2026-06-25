import { CpmLatencyCezasiVeHizlandirmaCrashingAnalysisCalculator22InputSchema, type CpmLatencyCezasiVeHizlandirmaCrashingAnalysisCalculator22Input } from "./cpm-latency-cezasi-ve-hizlandirma-crashing-analysis-calculator-22-validation";

export const calculateCpmLatencyCezasiVeHizlandirmaCrashingAnalysisCalculator22Contract: any = {
  id: "cpm-latency-cezasi-ve-hizlandirma-crashing-analysis-calculator-22",
  version: "1.0.0",
  category: "cost",
  inputSchema: CpmLatencyCezasiVeHizlandirmaCrashingAnalysisCalculator22InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        plannedDuration,
        actualDuration,
        excusableDelay,
        dailyPenalty,
        accelerationCost,
        maxCrashDays
      } = input;

      // Formula: Gross_Delay = MAX(0, actual_duration - planned_duration)
      const grossDelay = Math.max(0, actualDuration - plannedDuration);

      // Formula: NonExcusable_Delay = MAX(0, Gross_Delay - excusable_delay)
      const nonExcusableDelay = Math.max(0, grossDelay - excusableDelay);

      // Formula: Base_Penalty = NonExcusable_Delay * daily_penalty
      const basePenalty = nonExcusableDelay * dailyPenalty;

      // Formula: Opt_Crash_Days = IF(daily_penalty > acceleration_cost, MIN(NonExcusable_Delay, max_crash_days), 0)
      const optCrashDays = dailyPenalty > accelerationCost 
        ? Math.min(nonExcusableDelay, maxCrashDays) 
        : 0;

      // Formula: Total_Crash_Cost = Opt_Crash_Days * acceleration_cost
      const totalCrashCost = optCrashDays * accelerationCost;

      // Formula: Residual_Penalty = (NonExcusable_Delay - Opt_Crash_Days) * daily_penalty
      const residualPenalty = (nonExcusableDelay - optCrashDays) * dailyPenalty;

      // Formula: Net_Financial_Impact = Total_Crash_Cost + Residual_Penalty
      const netFinancialImpact = totalCrashCost + residualPenalty;

      // Formula: Savings_From_Crashing = Base_Penalty - Net_Financial_Impact
      const savingsFromCrashing = basePenalty - netFinancialImpact;

      return {
        grossDelay: Math.round(grossDelay * 100) / 100,
        nonExcusableDelay: Math.round(nonExcusableDelay * 100) / 100,
        basePenalty: Math.round(basePenalty * 100) / 100,
        optCrashDays: Math.round(optCrashDays * 100) / 100,
        totalCrashCost: Math.round(totalCrashCost * 100) / 100,
        residualPenalty: Math.round(residualPenalty * 100) / 100,
        netFinancialImpact: Math.round(netFinancialImpact * 100) / 100,
        savingsFromCrashing: Math.round(savingsFromCrashing * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};