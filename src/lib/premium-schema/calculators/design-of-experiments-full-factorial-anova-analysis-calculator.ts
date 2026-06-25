import { DeneyTasarimiDoeTamFaktoriyelVeAnovaAnalysisCalculator79InputSchema, type DeneyTasarimiDoeTamFaktoriyelVeAnovaAnalysisCalculator79Input } from "./deney-tasarimi-doe-tam-faktoriyel-ve-anova-analysis-calculator-79-validation";

function fDist(x: number, df1: number, df2: number): number {
  // Regularized incomplete beta function approximation for F-distribution CDF
  const a = df1 / 2;
  const b = df2 / 2;
  const y = (df1 * x) / (df1 * x + df2);
  return incompleteBeta(y, a, b);
}

function incompleteBeta(x: number, a: number, b: number): number {
  if (x < 0 || x > 1) return 0;
  if (x === 0 || x === 1) return x;
  
  // Using continued fraction representation (Lentz's method)
  const lbeta = Math.log(gamma(a)) + Math.log(gamma(b)) - Math.log(gamma(a + b));
  const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lbeta) / a;
  
  let f = 1.0;
  let c = 1.0;
  let d = 1.0 - (a + b) * x / (a + 1);
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1.0 / d;
  f = d;
  
  for (let m = 1; m <= 200; m++) {
    let numerator = m * (b - m) * x / ((a + 2 * m - 1) * (a + 2 * m));
    d = 1.0 + numerator * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1.0 + numerator / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1.0 / d;
    f *= d * c;
    
    numerator = -(a + m) * (a + b + m) * x / ((a + 2 * m) * (a + 2 * m + 1));
    d = 1.0 + numerator * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1.0 + numerator / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1.0 / d;
    const delta = d * c;
    f *= delta;
    
    if (Math.abs(delta - 1.0) < 1e-10) break;
  }
  
  return front * (f - 1);
}

function gamma(z: number): number {
  // Stirling's approximation for gamma function
  const g = 7;
  const c = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7
  ];
  
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  }
  
  z -= 1;
  let x = c[0];
  for (let i = 1; i < g + 2; i++) {
    x += c[i] / (z + i);
  }
  
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

export const calculateDeneyTasarimiDoeTamFaktoriyelVeAnovaAnalysisCalculator79Contract: any = {
  id: "deney-tasarimi-doe-tam-faktoriyel-ve-anova-analysis-calculator-79",
  version: "1.0.0",
  category: "cost",
  inputSchema: DeneyTasarimiDoeTamFaktoriyelVeAnovaAnalysisCalculator79InputSchema,
  
  execute: async (input: any) => {
    try {
      const factorCount = input.factorCount as number;
      const replicates = input.replicates as number;
      const centerPoints = input.centerPoints as number;
      const costPerRun = input.costPerRun as number;
      const responseValues = input.responseValues as number[] | number;
      const alphaLevel = input.alphaLevel as number;
      
      // Convert response values to array if single number
      const responses = Array.isArray(responseValues) ? responseValues : [responseValues];
      
      // Total Runs
      const totalRunsN = Math.pow(2, factorCount) * replicates + centerPoints;
      
      // Total Experiment Cost
      const totalExperimentCost = totalRunsN * costPerRun;
      
      // Grand Mean
      const sumResponses = responses.reduce((acc, val) => acc + val, 0);
      const grandMean = sumResponses / responses.length;
      
      // SS Total
      const sSTotal = responses.reduce((acc, val) => acc + Math.pow(val - grandMean, 2), 0);
      
      // SS Error (simplified - assumes one main factor with 2 levels)
      const level1Responses = responses.slice(0, Math.floor(responses.length / 2));
      const level2Responses = responses.slice(Math.floor(responses.length / 2));
      
      const mean1 = level1Responses.reduce((acc, val) => acc + val, 0) / level1Responses.length;
      const mean2 = level2Responses.reduce((acc, val) => acc + val, 0) / level2Responses.length;
      
      const ssFactor = level1Responses.length * Math.pow(mean1 - grandMean, 2) + 
                       level2Responses.length * Math.pow(mean2 - grandMean, 2);
      
      const sSError = sSTotal - ssFactor;
      
      // Degrees of freedom
      const dfFactor = 1; // Single factor analysis
      const dfError = totalRunsN - Math.pow(2, factorCount) - centerPoints;
      
      // Mean squares
      const mSFactor = ssFactor / dfFactor;
      const mSError = sSError / dfError;
      
      // F Value
      const fValue = mSFactor / mSError;
      
      // P Value using F-distribution
      const pValue = 1 - fDist(fValue, dfFactor, dfError);
      
      // R Squared
      const rSquared = (sSTotal - sSError) / sSTotal;
      
      return {
        totalRunsN,
        totalExperimentCost,
        grandMean,
        sSTotal,
        sSError,
        dfFactor,
        dfError,
        mSFactor,
        mSError,
        fValue,
        pValue,
        rSquared
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};