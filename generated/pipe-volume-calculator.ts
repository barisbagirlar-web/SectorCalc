// Auto-generated from pipe-volume-calculator-schema.json
import * as z from 'zod';

export interface Pipe_volume_calculatorInput {
  outerDiameter: number;
  wallThickness: number;
  length: number;
  quantity: number;
  dataConfidence?: number;
}

export const Pipe_volume_calculatorInputSchema = z.object({
  outerDiameter: z.number().default(100),
  wallThickness: z.number().default(5),
  length: z.number().default(1),
  quantity: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pipe_volume_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.outerDiameter - 2 * input.wallThickness; results["innerDiameter"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["innerDiameter"] = 0; }
  try { const v = Math.PI * ((asFormulaNumber(results["innerDiameter"])) / 2000) ** 2 * input.length; results["singleVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["singleVolume"] = 0; }
  try { const v = (asFormulaNumber(results["singleVolume"])) * input.quantity; results["totalVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = (asFormulaNumber(results["totalVolume"])) * 1000; results["totalVolumeLiters"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalVolumeLiters"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePipe_volume_calculator(input: Pipe_volume_calculatorInput): Pipe_volume_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalVolume"]);
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


export interface Pipe_volume_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
