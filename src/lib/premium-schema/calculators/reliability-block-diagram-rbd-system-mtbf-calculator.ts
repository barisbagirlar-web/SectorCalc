import { GuvenilirlikBlokDiyagramiRbdVeSistemMtbfCalculator80InputSchema, type GuvenilirlikBlokDiyagramiRbdVeSistemMtbfCalculator80Input } from "./guvenilirlik-blok-diyagrami-rbd-ve-sistem-mtbf-calculator-80-validation";

export const calculateGuvenilirlikBlokDiyagramiRbdVeSistemMtbfCalculator80Contract: any = {
  id: "guvenilirlik-blok-diyagrami-rbd-ve-sistem-mtbf-calculator-80",
  version: "1.0.0",
  category: "cost",
  inputSchema: GuvenilirlikBlokDiyagramiRbdVeSistemMtbfCalculator80InputSchema,
  
  execute: async (input: any) => {
    try {
      const failureRatesLambda = Number(input.failureRatesLambda) || 0;
      const configType = String(input.configType).trim();
      const missionTimeT = Number(input.configType) || 0;
      const targetReliabilityPercent = Number(input.targetReliability) || 0;
      const targetReliability = targetReliabilityPercent / 100;

      const lambdaValues = [failureRatesLambda];
      const n = lambdaValues.length;

      let reliabilityI: number;
      let rSystemSeries: number;
      let rSystemParallel: number;
      let rSystemActual: number;
      let lambdaSystemSeries: number;
      let mTBFSystemSeries: number;
      let mTBFSystemParallel: number;
      let mTBFActual: number;

      if (n === 0 || missionTimeT <= 0) {
        reliabilityI = 0;
        rSystemSeries = 0;
        rSystemParallel = 0;
        rSystemActual = 0;
        lambdaSystemSeries = 0;
        mTBFSystemSeries = 0;
        mTBFSystemParallel = 0;
        mTBFActual = 0;
      } else {
        const lambda = lambdaValues[0];
        reliabilityI = Math.exp(-lambda * missionTimeT);

        // Series system (single component)
        rSystemSeries = reliabilityI;

        // Parallel system (single component)
        rSystemParallel = 1 - (1 - reliabilityI);

        // Actual based on config
        rSystemActual = configType === 'Seri' || configType === '1' || configType === 'serial' 
          ? rSystemSeries 
          : rSystemParallel;

        // Series lambda
        lambdaSystemSeries = lambdaValues.reduce((sum, l) => sum + l, 0);

        // Series MTBF
        mTBFSystemSeries = lambdaSystemSeries > 0 ? 1 / lambdaSystemSeries : Infinity;

        // Parallel MTBF for identical components: sum_{i=1}^{n} (1/(i*lambda))
        const nParallel = lambdaValues.length;
        let parallelMTBFSum = 0;
        for (let i = 1; i <= nParallel; i++) {
          const sign = Math.pow(-1, i - 1);
          const sumCombinations = combinationSum(lambdaValues, i);
          if (sumCombinations !== 0) {
            parallelMTBFSum += sign / sumCombinations;
          }
        }
        mTBFSystemParallel = parallelMTBFSum;

        // Actual MTBF
        mTBFActual = configType === 'Seri' || configType === '1' || configType === 'serial' 
          ? mTBFSystemSeries 
          : mTBFSystemParallel;

        // Handle Infinity/NaN
        if (!isFinite(mTBFSystemSeries)) mTBFSystemSeries = 0;
        if (!isFinite(mTBFSystemParallel)) mTBFSystemParallel = 0;
        if (!isFinite(mTBFActual)) mTBFActual = 0;
      }

      return {
        reliabilityI,
        rSystemSeries,
        rSystemParallel,
        rSystemActual,
        lambdaSystemSeries,
        mTBFSystemSeries,
        mTBFSystemParallel,
        mTBFActual
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};

function combinationSum(values: number[], k: number): number {
  const n = values.length;
  let total = 0;
  const indices: number[] = [];
  
  function combine(start: number, depth: number) {
    if (depth === k) {
      let sum = 0;
      for (const idx of indices) {
        sum += values[idx];
      }
      total += 1 / sum;
      return;
    }
    for (let i = start; i <= n - (k - depth); i++) {
      indices[depth] = i;
      combine(i + 1, depth + 1);
    }
  }
  
  combine(0, 0);
  return total;
}