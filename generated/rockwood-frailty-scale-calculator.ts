// Auto-generated from rockwood-frailty-scale-calculator-schema.json
import * as z from 'zod';

export interface Rockwood_frailty_scale_calculatorInput {
  age: number;
  walking_speed: number;
  grip_strength: number;
  comorbidities: number;
  exhaustion: number;
  weight_loss: number;
  dataConfidence?: number;
}

export const Rockwood_frailty_scale_calculatorInputSchema = z.object({
  age: z.number().default(70),
  walking_speed: z.number().default(1),
  grip_strength: z.number().default(25),
  comorbidities: z.number().default(2),
  exhaustion: z.number().default(0),
  weight_loss: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rockwood_frailty_scale_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.age * input.walking_speed * input.grip_strength * input.comorbidities; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.age * input.walking_speed * input.grip_strength * input.comorbidities * (input.exhaustion * input.weight_loss); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.exhaustion * input.weight_loss; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRockwood_frailty_scale_calculator(input: Rockwood_frailty_scale_calculatorInput): Rockwood_frailty_scale_calculatorOutput {
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


export interface Rockwood_frailty_scale_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
