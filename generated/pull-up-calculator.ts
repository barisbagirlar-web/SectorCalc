// Auto-generated from pull-up-calculator-schema.json
import * as z from 'zod';

export interface Pull_up_calculatorInput {
  loadWeight: number;
  inclineAngle: number;
  frictionCoefficient: number;
  mechanicalAdvantage: number;
  dataConfidence?: number;
}

export const Pull_up_calculatorInputSchema = z.object({
  loadWeight: z.number().default(100),
  inclineAngle: z.number().default(30),
  frictionCoefficient: z.number().default(0.2),
  mechanicalAdvantage: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pull_up_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loadWeight * input.inclineAngle * input.frictionCoefficient * input.mechanicalAdvantage; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.loadWeight * input.inclineAngle * input.frictionCoefficient * input.mechanicalAdvantage; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePull_up_calculator(input: Pull_up_calculatorInput): Pull_up_calculatorOutput {
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


export interface Pull_up_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
