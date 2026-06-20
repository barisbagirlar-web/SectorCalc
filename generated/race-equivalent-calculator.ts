// Auto-generated from race-equivalent-calculator-schema.json
import * as z from 'zod';

export interface Race_equivalent_calculatorInput {
  knownDistance: number;
  knownTimeHours: number;
  knownTimeMinutes: number;
  knownTimeSeconds: number;
  targetDistance: number;
  dataConfidence?: number;
}

export const Race_equivalent_calculatorInputSchema = z.object({
  knownDistance: z.number().default(10),
  knownTimeHours: z.number().default(0),
  knownTimeMinutes: z.number().default(50),
  knownTimeSeconds: z.number().default(0),
  targetDistance: z.number().default(42.195),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Race_equivalent_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.knownDistance * input.knownTimeHours * input.knownTimeMinutes * input.knownTimeSeconds; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.knownDistance * input.knownTimeHours * input.knownTimeMinutes * input.knownTimeSeconds * (input.targetDistance); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.targetDistance; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateRace_equivalent_calculator(input: Race_equivalent_calculatorInput): Race_equivalent_calculatorOutput {
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


export interface Race_equivalent_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
