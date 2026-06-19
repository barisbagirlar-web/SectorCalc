// Auto-generated from asphalt-shingle-calculator-schema.json
import * as z from 'zod';

export interface Asphalt_shingle_calculatorInput {
  roofLength: number;
  roofWidth: number;
  pitch: number;
  numberOfPlanes: number;
  wasteFactor: number;
  bundleCoverage: number;
  dataConfidence?: number;
}

export const Asphalt_shingle_calculatorInputSchema = z.object({
  roofLength: z.number().default(40),
  roofWidth: z.number().default(30),
  pitch: z.number().default(4),
  numberOfPlanes: z.number().default(2),
  wasteFactor: z.number().default(10),
  bundleCoverage: z.number().default(33.33),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Asphalt_shingle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roofLength * input.roofWidth * input.pitch * input.numberOfPlanes; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.roofLength * input.roofWidth * input.pitch * input.numberOfPlanes * ((input.wasteFactor / 100) * input.bundleCoverage); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = (input.wasteFactor / 100) * input.bundleCoverage; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAsphalt_shingle_calculator(input: Asphalt_shingle_calculatorInput): Asphalt_shingle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Asphalt_shingle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
