// Auto-generated from box-size-calculator-schema.json
import * as z from 'zod';

export interface Box_size_calculatorInput {
  objectLength: number;
  objectWidth: number;
  objectHeight: number;
  clearance: number;
  wallThickness: number;
  dataConfidence?: number;
}

export const Box_size_calculatorInputSchema = z.object({
  objectLength: z.number().default(10),
  objectWidth: z.number().default(5),
  objectHeight: z.number().default(3),
  clearance: z.number().default(0.5),
  wallThickness: z.number().default(0.3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Box_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.objectLength + 2 * input.clearance; results["innerLength"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["innerLength"] = 0; }
  try { const v = input.objectWidth + 2 * input.clearance; results["innerWidth"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["innerWidth"] = 0; }
  try { const v = input.objectHeight + 2 * input.clearance; results["innerHeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["innerHeight"] = 0; }
  try { const v = (asFormulaNumber(results["innerLength"])) + 2 * input.wallThickness; results["outerLength"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["outerLength"] = 0; }
  try { const v = (asFormulaNumber(results["innerWidth"])) + 2 * input.wallThickness; results["outerWidth"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["outerWidth"] = 0; }
  try { const v = (asFormulaNumber(results["innerHeight"])) + 2 * input.wallThickness; results["outerHeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["outerHeight"] = 0; }
  try { const v = (asFormulaNumber(results["innerLength"])) * (asFormulaNumber(results["innerWidth"])) * (asFormulaNumber(results["innerHeight"])); results["innerVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["innerVolume"] = 0; }
  try { const v = (asFormulaNumber(results["outerLength"])) * (asFormulaNumber(results["outerWidth"])) * (asFormulaNumber(results["outerHeight"])); results["outerVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["outerVolume"] = 0; }
  try { const v = (asFormulaNumber(results["innerLength"])) + ' x ' + (asFormulaNumber(results["innerWidth"])) + ' x ' + (asFormulaNumber(results["innerHeight"])) + ' cm'; results["innerDimensions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["innerDimensions"] = 0; }
  try { const v = (asFormulaNumber(results["outerLength"])) + ' x ' + (asFormulaNumber(results["outerWidth"])) + ' x ' + (asFormulaNumber(results["outerHeight"])) + ' cm'; results["outerDimensions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["outerDimensions"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBox_size_calculator(input: Box_size_calculatorInput): Box_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["outerDimensions"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Box_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
