// Auto-generated from surface-tension-calculator-schema.json
import * as z from 'zod';

export interface Surface_tension_calculatorInput {
  density: number;
  gravity: number;
  height: number;
  radius: number;
  contactAngle: number;
  dataConfidence?: number;
}

export const Surface_tension_calculatorInputSchema = z.object({
  density: z.number().default(1000),
  gravity: z.number().default(9.81),
  height: z.number().default(0.01),
  radius: z.number().default(0.001),
  contactAngle: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Surface_tension_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.density * input.gravity * input.height * input.radius; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.density * input.gravity * input.height * input.radius * (input.contactAngle); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.contactAngle; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateSurface_tension_calculator(input: Surface_tension_calculatorInput): Surface_tension_calculatorOutput {
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


export interface Surface_tension_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
