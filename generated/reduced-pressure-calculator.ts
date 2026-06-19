// Auto-generated from reduced-pressure-calculator-schema.json
import * as z from 'zod';

export interface Reduced_pressure_calculatorInput {
  upstreamPressure: number;
  flowRate: number;
  specificGravity: number;
  kvCoefficient: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Reduced_pressure_calculatorInputSchema = z.object({
  upstreamPressure: z.number().default(10),
  flowRate: z.number().default(100),
  specificGravity: z.number().default(1),
  kvCoefficient: z.number().default(10),
  safetyFactor: z.number().default(1.2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Reduced_pressure_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.upstreamPressure * input.flowRate * input.specificGravity * input.kvCoefficient; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.upstreamPressure * input.flowRate * input.specificGravity * input.kvCoefficient * (input.safetyFactor); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.safetyFactor; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateReduced_pressure_calculator(input: Reduced_pressure_calculatorInput): Reduced_pressure_calculatorOutput {
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


export interface Reduced_pressure_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
