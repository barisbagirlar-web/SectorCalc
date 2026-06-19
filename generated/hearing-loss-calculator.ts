// Auto-generated from hearing-loss-calculator-schema.json
import * as z from 'zod';

export interface Hearing_loss_calculatorInput {
  noise_level: number;
  exposure_hours: number;
  years_exposed: number;
  age: number;
  dataConfidence?: number;
}

export const Hearing_loss_calculatorInputSchema = z.object({
  noise_level: z.number().default(85),
  exposure_hours: z.number().default(8),
  years_exposed: z.number().default(10),
  age: z.number().default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hearing_loss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.noise_level * input.exposure_hours * input.years_exposed * input.age; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.noise_level * input.exposure_hours * input.years_exposed * input.age; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHearing_loss_calculator(input: Hearing_loss_calculatorInput): Hearing_loss_calculatorOutput {
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


export interface Hearing_loss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
