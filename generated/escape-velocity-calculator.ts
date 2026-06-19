// Auto-generated from escape-velocity-calculator-schema.json
import * as z from 'zod';

export interface Escape_velocity_calculatorInput {
  mass: number;
  radius: number;
  altitude: number;
  G: number;
  dataConfidence?: number;
}

export const Escape_velocity_calculatorInputSchema = z.object({
  mass: z.number().default(5.972e+24),
  radius: z.number().default(6371000),
  altitude: z.number().default(0),
  G: z.number().default(6.6743e-11),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Escape_velocity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mass * input.radius * input.altitude * input.G; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.mass * input.radius * input.altitude * input.G; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEscape_velocity_calculator(input: Escape_velocity_calculatorInput): Escape_velocity_calculatorOutput {
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


export interface Escape_velocity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
