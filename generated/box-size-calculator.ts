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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Box_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.objectLength + 2 * input.clearance; results["innerLength"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["innerLength"] = Number.NaN; }
  try { const v = input.objectWidth + 2 * input.clearance; results["innerWidth"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["innerWidth"] = Number.NaN; }
  try { const v = input.objectHeight + 2 * input.clearance; results["innerHeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["innerHeight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["innerLength"])) + 2 * input.wallThickness; results["outerLength"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["outerLength"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["innerWidth"])) + 2 * input.wallThickness; results["outerWidth"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["outerWidth"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["innerHeight"])) + 2 * input.wallThickness; results["outerHeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["outerHeight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["innerLength"])) * (toNumericFormulaValue(results["innerWidth"])) * (toNumericFormulaValue(results["innerHeight"])); results["innerVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["innerVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["outerLength"])) * (toNumericFormulaValue(results["outerWidth"])) * (toNumericFormulaValue(results["outerHeight"])); results["outerVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["outerVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["innerLength"])) + ' x ' + (toNumericFormulaValue(results["innerWidth"])) + ' x ' + (toNumericFormulaValue(results["innerHeight"])) + ' cm'; results["innerDimensions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["innerDimensions"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["outerLength"])) + ' x ' + (toNumericFormulaValue(results["outerWidth"])) + ' x ' + (toNumericFormulaValue(results["outerHeight"])) + ' cm'; results["outerDimensions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["outerDimensions"] = Number.NaN; }
  return results;
}


export function calculateBox_size_calculator(input: Box_size_calculatorInput): Box_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["outerDimensions"]);
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


export interface Box_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
