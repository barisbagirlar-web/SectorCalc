// Auto-generated from factor-of-safety-calculator-schema.json
import * as z from 'zod';

export interface Factor_of_safety_calculatorInput {
  appliedForce: number;
  crossSectionArea: number;
  yieldStrength: number;
  ultimateTensileStrength: number;
  designFactor: number;
  stressConcentrationFactor: number;
}

export const Factor_of_safety_calculatorInputSchema = z.object({
  appliedForce: z.number().default(10000),
  crossSectionArea: z.number().default(50),
  yieldStrength: z.number().default(250),
  ultimateTensileStrength: z.number().default(400),
  designFactor: z.number().default(1.5),
  stressConcentrationFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Factor_of_safety_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.appliedForce / input.crossSectionArea * input.stressConcentrationFactor; results["workingStress"] = Number.isFinite(v) ? v : 0; } catch { results["workingStress"] = 0; }
  try { const v = input.yieldStrength / (results["workingStress"] ?? 0); results["fosYield"] = Number.isFinite(v) ? v : 0; } catch { results["fosYield"] = 0; }
  try { const v = input.ultimateTensileStrength / (results["workingStress"] ?? 0); results["fosUltimate"] = Number.isFinite(v) ? v : 0; } catch { results["fosUltimate"] = 0; }
  try { const v = (results["fosYield"] ?? 0) - 1; results["marginYield"] = Number.isFinite(v) ? v : 0; } catch { results["marginYield"] = 0; }
  try { const v = (results["fosYield"] ?? 0) >= input.designFactor ? 'Pass' : 'Fail'; results["passFailYield"] = Number.isFinite(v) ? v : 0; } catch { results["passFailYield"] = 0; }
  try { const v = `FOS (Yield): ${(results["fosYield"] ?? 0).toFixed(2)}`; results["primaryOutput"] = Number.isFinite(v) ? v : 0; } catch { results["primaryOutput"] = 0; }
  try { const v = `FOS (Ultimate): ${(results["fosUltimate"] ?? 0).toFixed(2)}`; results["breakdown1"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown1"] = 0; }
  try { const v = `Working Stress: ${(results["workingStress"] ?? 0).toFixed(2)} MPa`; results["breakdown2"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown2"] = 0; }
  try { const v = `Margin of Safety: ${(results["marginYield"] ?? 0).toFixed(2)}`; results["breakdown3"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown3"] = 0; }
  try { const v = `Design Check: ${(results["passFailYield"] ?? 0)}`; results["breakdown4"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown4"] = 0; }
  return results;
}


export function calculateFactor_of_safety_calculator(input: Factor_of_safety_calculatorInput): Factor_of_safety_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primaryOutput"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Factor_of_safety_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
