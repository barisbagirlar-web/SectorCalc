import { CpkppmDonusturucuVeKaliteLossFinansiCalculator21InputSchema, type CpkppmDonusturucuVeKaliteLossFinansiCalculator21Input } from "./cpkppm-donusturucu-ve-kalite-loss-finansi-calculator-21-validation";

// Normal distribution cumulative distribution function (CDF)
function normSdist(z: number): number {
  // Using the Abramowitz and Stegun approximation
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = z < 0 ? -1 : 1;
  const absZ = Math.abs(z);

  const t = 1.0 / (1.0 + p * absZ);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absZ * absZ / 2);

  return 0.5 * (1.0 + sign * y);
}

export const calculateCpkppmDonusturucuVeKaliteLossFinansiCalculator21Contract: any = {
  id: "cpkppm-donusturucu-ve-kalite-loss-finansi-calculator-21",
  version: "1.0.0",
  category: "cost",
  inputSchema: CpkppmDonusturucuVeKaliteLossFinansiCalculator21InputSchema,
  
  execute: async (input: any) => {
    try {
      const usl = Number(input.usl);
      const lsl = Number(input.lsl);
      const processMean = Number(input.processMean);
      const stdDev = Number(input.stdDev);
      const dailyVolume = Number(input.dailyVolume);
      const costPerDefect = Number(input.costPerDefect);

      // Validate inputs to prevent division by zero or negative standard deviation
      if (stdDev <= 0) {
        throw new Error("Standard deviation must be greater than zero");
      }

      // Calculate Z values
      const zUSL = (usl - processMean) / stdDev;
      const zLSL = (processMean - lsl) / stdDev;

      // Calculate Cp
      const cp = (usl - lsl) / (6 * stdDev);

      // Calculate Cpk
      const cpk = Math.min(zUSL, zLSL) / 3;

      // Calculate probabilities using normal distribution
      const pAbove = 1 - normSdist(zUSL);
      const pBelow = normSdist(-zLSL);

      // Calculate total PPM
      const totalPPM = (pAbove + pBelow) * 1000000;

      // Calculate Sigma Level (with 1.5 shift as per standard Six Sigma)
      const sigmaLevel = cpk * 3 + 1.5;

      // Calculate Daily Scrap Cost
      const dailyScrapCost = (totalPPM / 1000000) * dailyVolume * costPerDefect;

      return {
        zUSL: Math.round(zUSL * 6) / 6,
        zLSL: Math.round(zLSL * 6) / 6,
        cp: Math.round(cp * 6) / 6,
        cpk: Math.round(cpk * 6) / 6,
        pAbove: Math.round(pAbove * 1000000) / 1000000,
        pBelow: Math.round(pBelow * 1000000) / 1000000,
        totalPPM: Math.round(totalPPM * 1000) / 1000,
        sigmaLevel: Math.round(sigmaLevel * 6) / 6,
        dailyScrapCost: Math.round(dailyScrapCost * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};