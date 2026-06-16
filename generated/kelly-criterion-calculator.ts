// Auto-generated from kelly-criterion-calculator-schema.json
import * as z from 'zod';

export interface Kelly_criterion_calculatorInput {
  p: number;
  b: number;
  bankroll: number;
  fraction: number;
}

export const Kelly_criterion_calculatorInputSchema = z.object({
  p: z.number().default(0.5),
  b: z.number().default(2),
  bankroll: z.number().default(1000),
  fraction: z.number().default(1),
});

function evaluateAllFormulas(input: Kelly_criterion_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.b * input.p - (1 - input.p)) / input.b; results["f_star"] = Number.isFinite(v) ? v : 0; } catch { results["f_star"] = 0; }
  try { const v = input.fraction * (input.b * input.p - (1 - input.p)) / input.b; results["f"] = Number.isFinite(v) ? v : 0; } catch { results["f"] = 0; }
  try { const v = input.bankroll * input.fraction * (input.b * input.p - (1 - input.p)) / input.b; results["bet_amount"] = Number.isFinite(v) ? v : 0; } catch { results["bet_amount"] = 0; }
  try { const v = input.p * Math.log(1 + input.b * (input.fraction * (input.b * input.p - (1 - input.p)) / input.b)) + (1 - input.p) * Math.log(1 - (input.fraction * (input.b * input.p - (1 - input.p)) / input.b)); results["expected_growth"] = Number.isFinite(v) ? v : 0; } catch { results["expected_growth"] = 0; }
  return results;
}


export function calculateKelly_criterion_calculator(input: Kelly_criterion_calculatorInput): Kelly_criterion_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bet_amount"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Kelly_criterion_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
