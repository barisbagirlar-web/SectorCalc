import { AqlSamplingHipergeometrikDuzeltmeliCalculator3InputSchema, type AqlSamplingHipergeometrikDuzeltmeliCalculator3Input } from "./aql-sampling-hipergeometrik-duzeltmeli-calculator-3-validation";

export const calculateAqlSamplingHipergeometrikDuzeltmeliCalculator3Contract: any = {
  id: "aql-sampling-hipergeometrik-duzeltmeli-calculator-3",
  version: "1.0.0",
  category: "cost",
  inputSchema: AqlSamplingHipergeometrikDuzeltmeliCalculator3InputSchema,
  
  execute: async (input: any) => {
    try {
      const lotSize = Number(input.lotSize);
      const sampleSize = Number(input.sampleSize);
      const acceptNum = Number(input.acceptNum);
      const aqlPct = Number(input.aqlPct);
      const ltpdPct = Number(input.ltpdPct);
      const destructTest = Number(input.destructTest);
      const unitCost = Number(input.unitCost);
      const escapeCost = Number(input.escapeCost);
      const inspectorErr = Number(input.inspectorErr);

      // Formula: p_AQL = aql_pct / 100
      const pAQL = aqlPct / 100;

      // Formula: p_LTPD = ltpd_pct / 100
      const pLTPD = ltpdPct / 100;

      // Formula: DistType = IF((lot_size / sample_size) < 10, 'HYPERGEOMETRIC', 'BINOMIAL')
      const distType = (lotSize / sampleSize) < 10 ? 1 : 0;

      // Helper function for hypergeometric cumulative distribution
      function hypergeometricCDF(x: number, n: number, K: number, N: number): number {
        if (x < 0) return 0;
        if (x >= n) return 1;
        if (K > N) return 0;
        
        let cumulative = 0;
        const maxK = Math.min(K, n);
        const minK = Math.max(0, n - (N - K));
        
        for (let k = Math.max(0, minK); k <= Math.min(x, maxK); k++) {
          // Calculate combinations safely
          const combK = combination(K, k);
          const combNminusK = combination(N - K, n - k);
          const combN = combination(N, n);
          
          if (combK === 0 || combNminusK === 0 || combN === 0) continue;
          cumulative += (combK * combNminusK) / combN;
        }
        
        return Math.min(Math.max(cumulative, 0), 1);
      }

      // Combination function
      function combination(n: number, k: number): number {
        if (k < 0 || k > n) return 0;
        if (k === 0 || k === n) return 1;
        
        let result = 1;
        const maxK = Math.min(k, n - k);
        
        for (let i = 1; i <= maxK; i++) {
          result = result * (n - i + 1) / i;
        }
        
        return Math.round(result);
      }

      // Binomial cumulative distribution function
      function binomialCDF(x: number, n: number, p: number): number {
        if (x < 0) return 0;
        if (x >= n) return 1;
        if (p < 0 || p > 1) return 0;
        if (n === 0) return 1;
        
        let cumulative = 0;
        
        for (let k = 0; k <= Math.min(x, n); k++) {
          const comb = combination(n, k);
          const prob = Math.pow(p, k) * Math.pow(1 - p, n - k);
          cumulative += comb * prob;
        }
        
        return Math.min(Math.max(cumulative, 0), 1);
      }

      // Formula: Pa_Producer = IF(DistType == 'HYPERGEOMETRIC', HYPGEOMDIST(accept_num, sample_size, lot_size * p_AQL, lot_size), BINOMDIST(accept_num, sample_size, p_AQL, TRUE))
      let paProducer: number;
      if (distType === 1) {
        const K = Math.round(lotSize * pAQL);
        paProducer = hypergeometricCDF(acceptNum, sampleSize, K, lotSize);
      } else {
        paProducer = binomialCDF(acceptNum, sampleSize, pAQL);
      }

      // Formula: Alpha_Risk = 1 - Pa_Producer
      const alphaRisk = Math.max(0, 1 - paProducer);

      // Formula: Pa_Consumer = IF(DistType == 'HYPERGEOMETRIC', HYPGEOMDIST(accept_num, sample_size, lot_size * p_LTPD, lot_size), BINOMDIST(accept_num, sample_size, p_LTPD, TRUE))
      let paConsumer: number;
      if (distType === 1) {
        const K_ltpd = Math.round(lotSize * pLTPD);
        paConsumer = hypergeometricCDF(acceptNum, sampleSize, K_ltpd, lotSize);
      } else {
        paConsumer = binomialCDF(acceptNum, sampleSize, pLTPD);
      }

      // Formula: Beta_Risk = Pa_Consumer
      const betaRisk = paConsumer;

      // Formula: DestructCost = IF(destruct_test == 'Evet', sample_size * unit_cost, 0)
      const destructCost = destructTest > 0 ? sampleSize * unitCost : 0;

      // Formula: NetInspCost = (sample_size * test_cost) + DestructCost
      const testCost = destructTest > 0 ? destructTest : 0;
      const netInspCost = (sampleSize * testCost) + destructCost;

      // Formula: ATI = sample_size + ((1 - Pa_Producer) * (lot_size - sample_size))
      const aTI = sampleSize + ((1 - paProducer) * (lotSize - sampleSize));

      // Formula: AOQ = (Pa_Producer * p_AQL * (lot_size - sample_size)) / lot_size
      const aOQ = lotSize > 0 ? (paProducer * pAQL * (lotSize - sampleSize)) / lotSize : 0;

      // Formula: TrueEscape = (AOQ * lot_size) + (ATI * (inspector_err / 100))
      const trueEscape = (aOQ * lotSize) + (aTI * (inspectorErr / 100));

      // Formula: TotalRiskCost = NetInspCost + (TrueEscape * escape_cost)
      const totalRiskCost = netInspCost + (trueEscape * escapeCost);

      return {
        pAQL: Math.round((pAQL + Number.EPSILON) * 100) / 100,
        pLTPD: Math.round((pLTPD + Number.EPSILON) * 100) / 100,
        distType,
        paProducer: Math.round((paProducer + Number.EPSILON) * 10000) / 10000,
        alphaRisk: Math.round((alphaRisk + Number.EPSILON) * 10000) / 10000,
        paConsumer: Math.round((paConsumer + Number.EPSILON) * 10000) / 10000,
        betaRisk: Math.round((betaRisk + Number.EPSILON) * 10000) / 10000,
        destructCost: Math.round((destructCost + Number.EPSILON) * 100) / 100,
        netInspCost: Math.round((netInspCost + Number.EPSILON) * 100) / 100,
        aTI: Math.round((aTI + Number.EPSILON) * 100) / 100,
        aOQ: Math.round((aOQ + Number.EPSILON) * 10000) / 10000,
        trueEscape: Math.round((trueEscape + Number.EPSILON) * 100) / 100,
        totalRiskCost: Math.round((totalRiskCost + Number.EPSILON) * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};