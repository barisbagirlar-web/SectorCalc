import { VaryansAnalysisAnovaVeLeveneHomojenlikTestiCalculator133InputSchema, type VaryansAnalysisAnovaVeLeveneHomojenlikTestiCalculator133Input } from "./varyans-analysis-anova-ve-levene-homojenlik-testi-calculator-133-validation";

export const calculateVaryansAnalysisAnovaVeLeveneHomojenlikTestiCalculator133Contract: any = {
  id: "varyans-analysis-anova-ve-levene-homojenlik-testi-calculator-133",
  version: "1.0.0",
  category: "cost",
  inputSchema: VaryansAnalysisAnovaVeLeveneHomojenlikTestiCalculator133InputSchema,
  
  execute: async (input: any) => {
    try {
      // Parse inputs
      const validatedInput = VaryansAnalysisAnovaVeLeveneHomojenlikTestiCalculator133InputSchema.parse(input);
      const { numGroupsK, totalN, sumSqBetweenSsb, sumSqWithinSsw, levenePValue, alphaLevel } = validatedInput;

      // Calculate degrees of freedom
      const dfBetween = numGroupsK - 1;
      const dfWithin = totalN - numGroupsK;

      // Calculate mean squares
      const meanSqBetweenMSB = sumSqBetweenSsb / dfBetween;
      const meanSqWithinMSW = sumSqWithinSsw / dfWithin;

      // Calculate F statistic
      const fStatistic = meanSqBetweenMSB / meanSqWithinMSW;

      // Calculate p-value using the F-distribution CDF (using approximation)
      // Using the regularized incomplete beta function approximation for F-distribution
      const pValueANOVA = calculateFDistributionPValue(fStatistic, dfBetween, dfWithin);

      // Calculate effect sizes
      const totalSS = sumSqBetweenSsb + sumSqWithinSsw;
      const etaSquared = sumSqBetweenSsb / totalSS;
      
      // Omega squared calculation
      const omegaSquared = Math.max(0, 
        (sumSqBetweenSsb - (dfBetween * meanSqWithinMSW)) / 
        (totalSS + meanSqWithinMSW)
      );

      return {
        dfBetween,
        dfWithin,
        meanSqBetweenMSB,
        meanSqWithinMSW,
        fStatistic,
        pValueANOVA,
        etaSquared,
        omegaSquared
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};

// Helper function to calculate F-distribution p-value using the regularized incomplete beta function
function calculateFDistributionPValue(f: number, df1: number, df2: number): number {
  // Using the relationship: P(F > f) = I(df2/(df2+df1*f), df2/2, df1/2)
  const x = df2 / (df2 + df1 * f);
  const a = df2 / 2;
  const b = df1 / 2;
  
  // Calculate the regularized incomplete beta function
  const p = regularizedIncompleteBeta(x, a, b);
  
  return 1 - p;
}

// Numerical approximation of the regularized incomplete beta function using continued fraction
function regularizedIncompleteBeta(x: number, a: number, b: number): number {
  if (x < 0 || x > 1) return 0;
  if (x === 0 || x === 1) return x === 0 ? 0 : 1;
  
  // Use the continued fraction representation for better numerical stability
  const bt = Math.exp(
    logGamma(a + b) - logGamma(a) - logGamma(b) + 
    a * Math.log(x) + b * Math.log(1 - x)
  );
  
  if (x < (a + 1) / (a + b + 2)) {
    return bt * continuedFractionBeta(x, a, b) / a;
  } else {
    return 1 - bt * continuedFractionBeta(1 - x, b, a) / b;
  }
}

// Continued fraction for incomplete beta function
function continuedFractionBeta(x: number, a: number, b: number): number {
  const MAX_ITER = 100;
  const EPSILON = 1e-10;
  
  // Lentz's method for continued fraction
  let f = 1;
  let C = 1;
  let D = 1 - (a + b) * x / (a + 1);
  if (Math.abs(D) < EPSILON) D = EPSILON;
  D = 1 / D;
  let delta = D;
  
  for (let m = 1; m <= MAX_ITER; m++) {
    // Even step
    const m2 = 2 * m;
    const alphaEven = m * (b - m) * x / ((a + m2 - 1) * (a + m2));
    D = 1 + alphaEven * D;
    if (Math.abs(D) < EPSILON) D = EPSILON;
    C = 1 + alphaEven / C;
    if (Math.abs(C) < EPSILON) C = EPSILON;
    D = 1 / D;
    delta = C * D;
    f *= delta;
    
    // Odd step
    const alphaOdd = -(a + m) * (a + b + m) * x / ((a + m2) * (a + m2 + 1));
    D = 1 + alphaOdd * D;
    if (Math.abs(D) < EPSILON) D = EPSILON;
    C = 1 + alphaOdd / C;
    if (Math.abs(C) < EPSILON) C = EPSILON;
    D = 1 / D;
    delta = C * D;
    f *= delta;
    
    if (Math.abs(delta - 1) < EPSILON) break;
  }
  
  return f;
}

// Log gamma function using Stirling's approximation
function logGamma(z: number): number {
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
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
  }
  
  z -= 1;
  let x = c[0];
  for (let i = 1; i < g + 2; i++) {
    x += c[i] / (z + i);
  }
  
  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}