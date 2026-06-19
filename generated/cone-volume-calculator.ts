// Auto-generated from cone-volume-calculator-schema.json
import * as z from 'zod';

export interface Cone_volume_calculatorInput {
  radius: number;
  height: number;
  slantHeight: number;
  diameter: number;
  precision: number;
  calcSurface: number;
  dataConfidence?: number;
}

export const Cone_volume_calculatorInputSchema = z.object({
  radius: z.number().default(1),
  height: z.number().default(2),
  slantHeight: z.number().default(0),
  diameter: z.number().default(0),
  precision: z.number().default(2),
  calcSurface: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cone_volume_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.radius * input.height * input.slantHeight * input.diameter; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.radius * input.height * input.slantHeight * input.diameter * (input.precision * input.calcSurface); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.precision * input.calcSurface; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCone_volume_calculator(input: Cone_volume_calculatorInput): Cone_volume_calculatorOutput {
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


export interface Cone_volume_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
