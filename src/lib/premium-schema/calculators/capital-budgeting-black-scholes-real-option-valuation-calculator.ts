import { SermayeButcelemesiBlackscholesGercekOpsiyonDegerlemeCalculator174InputSchema } from "./sermaye-butcelemesi-blackscholes-gercek-opsiyon-degerleme-calculator-174-validation";

export const calculateSermayeButcelemesiBlackscholesGercekOpsiyonDegerlemeCalculator174Contract: any = {
  id: "sermaye-butcelemesi-blackscholes-gercek-opsiyon-degerleme-calculator-174",
  version: "1.0.0",
  category: "cost",
  inputSchema: SermayeButcelemesiBlackscholesGercekOpsiyonDegerlemeCalculator174InputSchema,
  
  execute: async (input: any) => {
    try {
      const { projectPv, strikePriceCapex, riskFreeRate, optionTimeYrs, volatilityAnnual } = input;

      // Convert percentages to decimals
      const rDec = riskFreeRate / 100;
      const sigmaDec = volatilityAnnual / 100;

      // Calculate d1
      const d1 = (Math.log(projectPv / strikePriceCapex) + (rDec + Math.pow(sigmaDec, 2) / 2) * optionTimeYrs) / (sigmaDec * Math.sqrt(optionTimeYrs));

      // Calculate d2
      const d2 = d1 - (sigmaDec * Math.sqrt(optionTimeYrs));

      // Standard normal cumulative distribution function (approximation using error function)
      const normCdf = (x: number): number => {
        return (1.0 + erf(x / Math.SQRT2)) / 2.0;
      };

      // Error function approximation (Abramowitz and Stegun)
      const erf = (x: number): number => {
        const sign = x >= 0 ? 1 : -1;
        x = Math.abs(x);

        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;

        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
        return sign * y;
      };

      // Calculate N(d1) and N(d2)
      const nd1 = normCdf(d1);
      const nd2 = normCdf(d2);

      // Call Option Value (Real Option) using Black-Scholes formula
      const callOptionValueRealOption = (projectPv * nd1) - (strikePriceCapex * Math.exp(-rDec * optionTimeYrs) * nd2);

      // Traditional NPV
      const traditionalNPV = projectPv - strikePriceCapex;

      // Expanded NPV
      const expandedNPV = traditionalNPV + callOptionValueRealOption;

      return {
        rDec,
        sigmaDec,
        d1,
        d2,
        callOptionValueRealOption,
        traditionalNPV,
        expandedNPV,
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};