import { AltiSigmaProjectPrioritizerDinamikRtyCalculator2InputSchema, type AltiSigmaProjectPrioritizerDinamikRtyCalculator2Input } from "./alti-sigma-project-prioritizer-dinamik-rty-calculator-2-validation";

export const calculateAltiSigmaProjectPrioritizerDinamikRtyCalculator2Contract: any = {
  id: "alti-sigma-project-prioritizer-dinamik-rty-calculator-2",
  version: "1.0.0",
  category: "cost",
  inputSchema: AltiSigmaProjectPrioritizerDinamikRtyCalculator2InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        processSteps,
        opsPerStep,
        defectsPerStep,
        annualVolume,
        internalFailCost,
        externalFailCost,
        appraisalCost,
        capex,
        blackBeltHours,
        beltRate,
        wacc,
        projectLife,
        targetSigma
      } = input;

      // Total defects per unit calculation
      const totalDefects = defectsPerStep * processSteps;
      const totalOpportunities = opsPerStep * processSteps;
      
      // DPU (Defects Per Unit)
      const dPU = totalDefects / annualVolume;
      
      // Step Yield (assumes equal step yields)
      const stepYield = Math.exp(-dPU / processSteps);
      
      // RTY (Rolled Throughput Yield)
      const rTY = Math.pow(stepYield, processSteps);
      
      // Z_st calculation (short-term sigma) - using inverse normal approximation
      const zSt = calculateZScore(rTY);
      
      // Current Sigma (assuming 1.5 sigma shift)
      const currentSigma = zSt + 1.5;

      // COPQ Current calculation
      const defectRateCurrent = 1 - rTY;
      const cOPQCurrent = annualVolume * defectRateCurrent * (internalFailCost + externalFailCost + appraisalCost);

      // Target RTY calculation
      const targetRTY = normalCDF(targetSigma - 1.5);
      
      // COPQ Target calculation
      const defectRateTarget = 1 - targetRTY;
      const cOPQTarget = annualVolume * defectRateTarget * (internalFailCost + externalFailCost + appraisalCost);

      // Annual Savings
      const annualSavings = cOPQCurrent - cOPQTarget;

      // Project Cost
      const projectCost = capex + (blackBeltHours * beltRate);

      // Project NPV calculation
      const discountRate = wacc / 100;
      const annuityFactor = (1 - Math.pow(1 + discountRate, -projectLife)) / discountRate;
      const projectNPV = (annualSavings * annuityFactor) - projectCost;

      return {
        dPU: Math.round(dPU * 100) / 100,
        stepYield: Math.round(stepYield * 10000) / 10000,
        rTY: Math.round(rTY * 10000) / 10000,
        zSt: Math.round(zSt * 100) / 100,
        currentSigma: Math.round(currentSigma * 100) / 100,
        cOPQCurrent: Math.round(cOPQCurrent * 100) / 100,
        targetRTY: Math.round(targetRTY * 10000) / 10000,
        cOPQTarget: Math.round(cOPQTarget * 100) / 100,
        annualSavings: Math.round(annualSavings * 100) / 100,
        projectCost: Math.round(projectCost * 100) / 100,
        projectNPV: Math.round(projectNPV * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};

// Helper function: Standard Normal CDF (using Abramowitz and Stegun approximation)
function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1 + sign * y);
}

// Helper function: Inverse Normal CDF (using rational approximation)
function calculateZScore(p: number): number {
  // Ensure p is within valid range
  if (p <= 0) return -6;
  if (p >= 1) return 6;

  const a1 = -3.969683028665376e+01;
  const a2 = 2.209460984245205e+02;
  const a3 = -2.759285104469687e+02;
  const a4 = 1.383577518672690e+02;
  const a5 = -3.066479806614716e+01;
  const a6 = 2.506628277459239e+00;

  const b1 = -5.447609879822406e+01;
  const b2 = 1.615858368580409e+02;
  const b3 = -1.556989798598866e+02;
  const b4 = 6.680131188771972e+01;
  const b5 = -1.328068155288572e+01;

  const c1 = -7.784894002430293e-03;
  const c2 = -3.223964580411365e-01;
  const c3 = -2.400758277161838e+00;
  const c4 = -2.549732539343734e+00;
  const c5 = 4.374664141464968e+00;
  const c6 = 2.938163982698783e+00;

  const d1 = 7.784695709041462e-03;
  const d2 = 3.224671290700398e-01;
  const d3 = 2.445134137142996e+00;
  const d4 = 3.754408661907416e+00;

  const q = p - 0.5;
  let r = 0;
  let x = 0;

  if (Math.abs(q) <= 0.425) {
    r = 0.180625 - q * q;
    x = q * (((((((a6 * r + a5) * r + a4) * r + a3) * r + a2) * r + a1) * r) + 1) /
            (((((((b6 * r + b5) * r + b4) * r + b3) * r + b2) * r + b1) * r) + 1);
  } else {
    r = q > 0 ? 1 - p : p;
    if (r <= 0) return q > 0 ? 6 : -6;
    
    r = Math.sqrt(-Math.log(r));
    x = (((((((c6 * r + c5) * r + c4) * r + c3) * r + c2) * r + c1) * r) + 1) /
        ((((((d5 * r + d4) * r + d3) * r + d2) * r + d1) * r) + 1);
    
    if (q < 0) x = -x;
  }

  return x;
}

// Additional constant needed for the rational approximation
const b6 = 2.186948068371027e-01;
const d5 = 2.445134137142996e+00;