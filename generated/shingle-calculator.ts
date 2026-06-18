// @ts-nocheck
// Auto-generated from shingle-calculator-schema.json
import * as z from 'zod';

export interface Shingle_calculatorInput {
  roofFootprintArea: number;
  roofPitchAngle: number;
  wasteFactor: number;
  shingleCoveragePerBundle: number;
  ridgeLength: number;
  capCoveragePerBundle: number;
}

export const Shingle_calculatorInputSchema = z.object({
  roofFootprintArea: z.number().default(100),
  roofPitchAngle: z.number().default(30),
  wasteFactor: z.number().default(10),
  shingleCoveragePerBundle: z.number().default(3.1),
  ridgeLength: z.number().default(15),
  capCoveragePerBundle: z.number().default(10),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Shingle_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.roofFootprintArea * input.roofPitchAngle * (input.wasteFactor / 100) * input.shingleCoveragePerBundle; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.roofFootprintArea * input.roofPitchAngle * (input.wasteFactor / 100) * input.shingleCoveragePerBundle * (input.ridgeLength * input.capCoveragePerBundle); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.ridgeLength * input.capCoveragePerBundle; results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateShingle_calculator(input: Shingle_calculatorInput): Shingle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
