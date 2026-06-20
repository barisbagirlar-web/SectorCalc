// Auto-generated from npsh-required-calculator-schema.json
import * as z from 'zod';

export interface Npsh_required_calculatorInput {
  speed: number;
  flowRate: number;
  suctionSpecificSpeed: number;
  dataConfidence?: number;
}

export const Npsh_required_calculatorInputSchema = z.object({
  speed: z.number().default(1750),
  flowRate: z.number().default(500),
  suctionSpecificSpeed: z.number().default(10000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Npsh_required_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.speed * input.flowRate * input.suctionSpecificSpeed; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.speed * input.flowRate * input.suctionSpecificSpeed; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateNpsh_required_calculator(input: Npsh_required_calculatorInput): Npsh_required_calculatorOutput {
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


export interface Npsh_required_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
