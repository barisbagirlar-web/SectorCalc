import { PariserdoganYasasiIleYorulmaCatlagiIlerlemesiVeOmurAnalysisCalculator184InputSchema, type PariserdoganYasasiIleYorulmaCatlagiIlerlemesiVeOmurAnalysisCalculator184Input } from "./pariserdogan-yasasi-ile-yorulma-catlagi-ilerlemesi-ve-omur-analysis-calculator-184-validation";

export const calculatePariserdoganYasasiIleYorulmaCatlagiIlerlemesiVeOmurAnalysisCalculator184Contract: any = {
  id: "pariserdogan-yasasi-ile-yorulma-catlagi-ilerlemesi-ve-omur-analysis-calculator-184",
  version: "1.0.0",
  category: "cost",
  inputSchema: PariserdoganYasasiIleYorulmaCatlagiIlerlemesiVeOmurAnalysisCalculator184InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        initialCrackA0,
        criticalCrackAc,
        deltaSigmaMpa,
        geometryFactorY,
        parisConstantM,
        parisExponentM,
        fractureToughnessK1c
      } = input;

      // Convert crack lengths from mm to meters
      const a0M = initialCrackA0 / 1000;
      const acM = criticalCrackAc / 1000;

      // Check for critical crack condition using fracture toughness
      const pi = Math.PI;
      
      // Initial stress intensity factor range
      const deltaKInitial = geometryFactorY * deltaSigmaMpa * Math.sqrt(pi * a0M);

      // Final stress intensity factor range (at critical crack length)
      const deltaKFinal = geometryFactorY * deltaSigmaMpa * Math.sqrt(pi * acM);

      // Paris-Erdogan crack growth law integration
      // dN = da / (C * (ΔK)^m)
      // N = ∫ da / (C * (Y * Δσ * √(π*a))^m) from a0 to ac
      // N = [a^(1 - m/2) - a0^(1 - m/2)] / [C * (Y * Δσ * √(π))^m * (1 - m/2)]
      
      let cyclesToFailure = 0;
      
      if (parisExponentM !== 2) {
        const exponent = 1 - (parisExponentM / 2);
        const powerComponent = Math.pow(acM, exponent) - Math.pow(a0M, exponent);
        const denominatorComponent = parisConstantM * Math.pow(geometryFactorY * deltaSigmaMpa * Math.sqrt(pi), parisExponentM) * exponent;
        
        if (denominatorComponent !== 0) {
          cyclesToFailure = powerComponent / denominatorComponent;
        }
      } else {
        // Special case when m = 2: integral of da/a gives ln(ac/a0)
        if (a0M > 0 && acM > 0) {
          const logComponent = Math.log(acM / a0M);
          const denominatorComponent = parisConstantM * Math.pow(geometryFactorY * deltaSigmaMpa * Math.sqrt(pi), 2);
          if (denominatorComponent !== 0) {
            cyclesToFailure = logComponent / denominatorComponent;
          }
        }
      }

      // Validate cycles are non-negative
      if (cyclesToFailure < 0) {
        cyclesToFailure = 0;
      }

      // Check if initial crack is already at or beyond critical length
      if (a0M >= acM) {
        cyclesToFailure = 0;
      }

      return {
        a0M: Math.round(a0M * 1e9) / 1e9,
        acM: Math.round(acM * 1e9) / 1e9,
        deltaKInitial: Math.round(deltaKInitial * 100) / 100,
        cyclesToFailure: Math.round(cyclesToFailure * 100) / 100,
        deltaKFinal: Math.round(deltaKFinal * 100) / 100
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};