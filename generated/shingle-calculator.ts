// Auto-generated from shingle-calculator-schema.json
import * as z from 'zod';

export interface Shingle_calculatorInput {
  roofFootprintArea: number;
  roofPitchAngle: number;
  wasteFactor: number;
  shingleCoveragePerBundle: number;
  ridgeLength: number;
  capCoveragePerBundle: number;
  dataConfidence?: number;
}

export const Shingle_calculatorInputSchema = z.object({
  roofFootprintArea: z.number().default(100),
  roofPitchAngle: z.number().default(30),
  wasteFactor: z.number().default(10),
  shingleCoveragePerBundle: z.number().default(3.1),
  ridgeLength: z.number().default(15),
  capCoveragePerBundle: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Shingle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roofFootprintArea * input.roofPitchAngle * (input.wasteFactor / 100) * input.shingleCoveragePerBundle; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.roofFootprintArea * input.roofPitchAngle * (input.wasteFactor / 100) * input.shingleCoveragePerBundle * (input.ridgeLength * input.capCoveragePerBundle); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.ridgeLength * input.capCoveragePerBundle; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateShingle_calculator(input: Shingle_calculatorInput): Shingle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Shingle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
