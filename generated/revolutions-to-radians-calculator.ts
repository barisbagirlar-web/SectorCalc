// Auto-generated from revolutions-to-radians-calculator-schema.json
import * as z from 'zod';

export interface Revolutions_to_radians_calculatorInput {
  rev: number;
  gearRatio: number;
  phaseOffsetRev: number;
  radPerRev: number;
  decimalPlaces: number;
  dataConfidence?: number;
}

export const Revolutions_to_radians_calculatorInputSchema = z.object({
  rev: z.number().default(1),
  gearRatio: z.number().default(1),
  phaseOffsetRev: z.number().default(0),
  radPerRev: z.number().default(6.283185307179586),
  decimalPlaces: z.number().default(6),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Revolutions_to_radians_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rev * input.gearRatio * input.phaseOffsetRev * input.radPerRev; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.rev * input.gearRatio * input.phaseOffsetRev * input.radPerRev * (input.decimalPlaces); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.decimalPlaces; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateRevolutions_to_radians_calculator(input: Revolutions_to_radians_calculatorInput): Revolutions_to_radians_calculatorOutput {
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


export interface Revolutions_to_radians_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
