import { IstatistikselGucAnalysisVeOrneklemCohensDCalculator132InputSchema, type IstatistikselGucAnalysisVeOrneklemCohensDCalculator132Input } from "./istatistiksel-guc-analysis-ve-orneklem-cohens-d-calculator-132-validation";

export const calculateIstatistikselGucAnalysisVeOrneklemCohensDCalculator132Contract: any = {
  id: "istatistiksel-guc-analysis-ve-orneklem-cohens-d-calculator-132",
  version: "1.0.0",
  category: "cost",
  inputSchema: IstatistikselGucAnalysisVeOrneklemCohensDCalculator132InputSchema,
  
  execute: async (input: IstatistikselGucAnalysisVeOrneklemCohensDCalculator132Input) => {
    try {
      const {
        meanGroup1,
        meanGroup2,
        stdDev1,
        stdDev2,
        alphaLevel,
        targetPower,
        attritionRate
      } = input;

      // Calculate pooled variance
      const pooledVariance = (Math.pow(stdDev1, 2) + Math.pow(stdDev2, 2)) / 2;

      // Calculate pooled standard deviation
      const pooledStdDev = Math.sqrt(pooledVariance);

      // Calculate Cohen's d effect size
      const cohensDEffectSize = Math.abs(meanGroup1 - meanGroup2) / pooledStdDev;

      // Z-score calculations using the rational approximation (Abramowitz and Stegun formula)
      // Approximation for the inverse standard normal CDF (probit function)
      function normSInv(p: number): number {
        if (p <= 0 || p >= 1) return p <= 0 ? -Infinity : Infinity;
        
        const a1 = -3.969683028665376e+1;
        const a2 = 2.209460984245205e+2;
        const a3 = -2.759285104469687e+2;
        const a4 = 1.383577518672690e+2;
        const a5 = -3.066479806614716e+1;
        const a6 = 2.506628277459239e+0;
        
        const b1 = -5.447609879822406e+1;
        const b2 = 1.615858368580409e+2;
        const b3 = -1.556989798598866e+2;
        const b4 = 6.680131188771972e+1;
        const b5 = -1.328068155288572e+1;
        
        const c1 = -7.784894002430293e-3;
        const c2 = -3.223964580411365e-1;
        const c3 = -2.400758277161838e+0;
        const c4 = -2.549732539343734e+0;
        const c5 = 4.374664141464968e+0;
        const c6 = 2.938163982698783e+0;
        
        const d1 = 7.784695709041462e-3;
        const d2 = 3.224671290700398e-1;
        const d3 = 2.445134137142996e+0;
        const d4 = 3.754408661907416e+0;
        
        // Define break points
        const pLow = 0.02425;
        const pHigh = 1 - pLow;
        
        let q: number, r: number;
        
        if (p < pLow) {
          // Rational approximation for lower region
          q = Math.sqrt(-2 * Math.log(p));
          r = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
        } else if (p <= pHigh) {
          // Rational approximation for central region
          q = p - 0.5;
          r = (((((a1 * q + a2) * q + a3) * q + a4) * q + a5) * q + a6) / (((((b1 * q + b2) * q + b3) * q + b4) * q + b5) * q + 1);
        } else {
          // Rational approximation for upper region
          q = Math.sqrt(-2 * Math.log(1 - p));
          r = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
        }
        
        return r;
      }

      // Calculate Z Alpha (two-tailed test)
      const zAlpha = normSInv(1 - alphaLevel / 2);

      // Calculate Z Beta for target power
      const zBeta = normSInv(targetPower);

      // Calculate raw sample size per group
      const nPerGroupRaw = 2 * Math.pow((zAlpha + zBeta) / cohensDEffectSize, 2);

      // Adjust for attrition rate
      const nFinalAdjusted = Math.ceil(nPerGroupRaw / (1 - (attritionRate / 100)));

      // Calculate total sample size
      const totalSampleSize = nFinalAdjusted * 2;

      return {
        pooledVariance,
        pooledStdDev,
        cohensDEffectSize,
        zAlpha,
        zBeta,
        nPerGroupRaw,
        nFinalAdjusted,
        totalSampleSize
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};