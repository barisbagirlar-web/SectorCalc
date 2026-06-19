// Auto-generated from bernoulli-equation-calculator-schema.json
import * as z from 'zod';

export interface Bernoulli_equation_calculatorInput {
  density: number;
  g: number;
  P1: number;
  v1: number;
  z1: number;
  P2: number;
  z2: number;
  head_loss: number;
  dataConfidence?: number;
}

export const Bernoulli_equation_calculatorInputSchema = z.object({
  density: z.number().default(1000),
  g: z.number().default(9.81),
  P1: z.number().default(101325),
  v1: z.number().default(1),
  z1: z.number().default(0),
  P2: z.number().default(101325),
  z2: z.number().default(0),
  head_loss: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bernoulli_equation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.density * input.g * input.P1 * input.v1; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.density * input.g * input.P1 * input.v1 * (input.z1 * input.P2 * input.z2 * input.head_loss); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.z1 * input.P2 * input.z2 * input.head_loss; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBernoulli_equation_calculator(input: Bernoulli_equation_calculatorInput): Bernoulli_equation_calculatorOutput {
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


export interface Bernoulli_equation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
