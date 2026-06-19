// Auto-generated from ionic-strength-calculator-schema.json
import * as z from 'zod';

export interface Ionic_strength_calculatorInput {
  concentration1: number;
  charge1: number;
  concentration2: number;
  charge2: number;
  concentration3: number;
  charge3: number;
  concentration4: number;
  charge4: number;
  dataConfidence?: number;
}

export const Ionic_strength_calculatorInputSchema = z.object({
  concentration1: z.number().default(0.1),
  charge1: z.number().default(1),
  concentration2: z.number().default(0),
  charge2: z.number().default(0),
  concentration3: z.number().default(0),
  charge3: z.number().default(0),
  concentration4: z.number().default(0),
  charge4: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ionic_strength_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.5 * (input.concentration1 * input.charge1**2 + input.concentration2 * input.charge2**2 + input.concentration3 * input.charge3**2 + input.concentration4 * input.charge4**2); results["ionicStrength"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ionicStrength"] = 0; }
  try { const v = 0.5 * input.concentration1 * input.charge1**2; results["term1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["term1"] = 0; }
  try { const v = 0.5 * input.concentration2 * input.charge2**2; results["term2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["term2"] = 0; }
  try { const v = 0.5 * input.concentration3 * input.charge3**2; results["term3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["term3"] = 0; }
  try { const v = 0.5 * input.concentration4 * input.charge4**2; results["term4"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["term4"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateIonic_strength_calculator(input: Ionic_strength_calculatorInput): Ionic_strength_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ionicStrength"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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


export interface Ionic_strength_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
