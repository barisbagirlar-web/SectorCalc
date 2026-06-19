// Auto-generated from pipe-size-calculator-schema.json
import * as z from 'zod';

export interface Pipe_size_calculatorInput {
  flowRate: number;
  velocity: number;
  pressure: number;
  allowableStress: number;
  jointEfficiency: number;
  corrosionAllowance: number;
  dataConfidence?: number;
}

export const Pipe_size_calculatorInputSchema = z.object({
  flowRate: z.number().default(100),
  velocity: z.number().default(2),
  pressure: z.number().default(10),
  allowableStress: z.number().default(137.9),
  jointEfficiency: z.number().default(1),
  corrosionAllowance: z.number().default(1.5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pipe_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.flowRate * input.velocity * input.pressure * input.allowableStress; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.flowRate * input.velocity * input.pressure * input.allowableStress * ((input.jointEfficiency / 100) * input.corrosionAllowance); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = (input.jointEfficiency / 100) * input.corrosionAllowance; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePipe_size_calculator(input: Pipe_size_calculatorInput): Pipe_size_calculatorOutput {
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


export interface Pipe_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
