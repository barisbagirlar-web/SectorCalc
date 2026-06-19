// Auto-generated from capillary-action-calculator-schema.json
import * as z from 'zod';

export interface Capillary_action_calculatorInput {
  surfaceTension: number;
  contactAngle: number;
  density: number;
  radius: number;
  gravity: number;
  dataConfidence?: number;
}

export const Capillary_action_calculatorInputSchema = z.object({
  surfaceTension: z.number().default(0.0728),
  contactAngle: z.number().default(20),
  density: z.number().default(1000),
  radius: z.number().default(0.0005),
  gravity: z.number().default(9.81),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Capillary_action_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.surfaceTension * input.contactAngle * input.density * input.radius; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.surfaceTension * input.contactAngle * input.density * input.radius * (input.gravity); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.gravity; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCapillary_action_calculator(input: Capillary_action_calculatorInput): Capillary_action_calculatorOutput {
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


export interface Capillary_action_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
