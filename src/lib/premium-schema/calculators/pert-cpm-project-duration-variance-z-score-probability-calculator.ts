import { PertcpmProjectDurationVeVaryansZskoruOlasiligiCalculator56InputSchema, type PertcpmProjectDurationVeVaryansZskoruOlasiligiCalculator56Input } from "./pertcpm-project-duration-ve-varyans-zskoru-olasiligi-calculator-56-validation";

export const calculatePertcpmProjectDurationVeVaryansZskoruOlasiligiCalculator56Contract: any = {
  id: "pertcpm-project-duration-ve-varyans-zskoru-olasiligi-calculator-56",
  version: "1.0.0",
  category: "cost",
  inputSchema: PertcpmProjectDurationVeVaryansZskoruOlasiligiCalculator56InputSchema,
  
  execute: async (input: any) => {
    try {
      const parsed = input as PertcpmProjectDurationVeVaryansZskoruOlasiligiCalculator56Input;
      
      const tOpt = Number(parsed.tOpt);
      const tMl = Number(parsed.tMl);
      const tPess = Number(parsed.tPess);
      const targetDuration = Number(parsed.targetDuration);
      const dailyPenalty = Number(parsed.dailyPenalty);

      // PERT Expected Time = (t_opt + (4 * t_ml) + t_pess) / 6
      const pERTExpectedTime = (tOpt + (4 * tMl) + tPess) / 6;

      // PERT Standard Deviation = (t_pess - t_opt) / 6
      const pERTStdDev = (tPess - tOpt) / 6;

      // PERT Variance = StdDev^2
      const pERTVariance = Math.pow(pERTStdDev, 2);

      // Z-Score = (target_duration - PERT_Expected_Time) / PERT_Std_Dev
      const zScore = pERTStdDev !== 0 ? (targetDuration - pERTExpectedTime) / pERTStdDev : 0;

      // Probability using standard normal distribution approximation (error function)
      const probOnTimePct = zScore >= 0
        ? 0.5 * (1 + erf(zScore / Math.sqrt(2))) * 100
        : (1 - (0.5 * (1 + erf(Math.abs(zScore) / Math.sqrt(2))))) * 100;

      // Probability of delay
      const probDelayPct = 100 - probOnTimePct;

      // Expected delay days (only if project is expected to exceed target)
      const expectedDelayDays = Math.max(0, pERTExpectedTime - targetDuration);

      // Expected penalty risk
      const expectedPenaltyRisk = expectedDelayDays * dailyPenalty;

      // Clamp probabilities to valid range
      const clampedProbOnTime = Math.max(0, Math.min(100, probOnTimePct));
      const clampedProbDelay = Math.max(0, Math.min(100, probDelayPct));

      return {
        pERTExpectedTime: Number(pERTExpectedTime.toFixed(4)),
        pERTStdDev: Number(pERTStdDev.toFixed(4)),
        pERTVariance: Number(pERTVariance.toFixed(4)),
        zScore: Number(zScore.toFixed(4)),
        probOnTimePct: Number(clampedProbOnTime.toFixed(2)),
        probDelayPct: Number(clampedProbDelay.toFixed(2)),
        expectedDelayDays: Number(expectedDelayDays.toFixed(2)),
        expectedPenaltyRisk: Number(expectedPenaltyRisk.toFixed(2))
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};

// Error function approximation for normal distribution CDF
function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  // Constants for approximation
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}