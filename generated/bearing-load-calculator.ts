// Auto-generated from bearing-load-calculator-schema.json
import * as z from 'zod';

export interface Bearing_load_calculatorInput {
  radialLoad: number;
  axialLoad: number;
  Xfactor: number;
  Yfactor: number;
  dynamicLoadRating: number;
  exponent: number;
  speed: number;
  dataConfidence?: number;
}

export const Bearing_load_calculatorInputSchema = z.object({
  radialLoad: z.number().default(1000),
  axialLoad: z.number().default(500),
  Xfactor: z.number().default(0.56),
  Yfactor: z.number().default(1.5),
  dynamicLoadRating: z.number().default(5000),
  exponent: z.number().default(3),
  speed: z.number().default(1500),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bearing_load_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Xfactor * input.radialLoad + input.Yfactor * input.axialLoad; results["equivalentLoad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["equivalentLoad"] = 0; }
  try { const v = (input.dynamicLoadRating / (asFormulaNumber(results["equivalentLoad"]))) ** input.exponent; results["bearingLifeRevolutions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bearingLifeRevolutions"] = 0; }
  try { const v = (asFormulaNumber(results["bearingLifeRevolutions"])) * 1000000 / (60 * input.speed); results["bearingLifeHours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bearingLifeHours"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBearing_load_calculator(input: Bearing_load_calculatorInput): Bearing_load_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["bearingLifeHours"]);
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


export interface Bearing_load_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
