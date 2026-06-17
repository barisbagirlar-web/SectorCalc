// Auto-generated from naismiths-rule-calculator-schema.json
import * as z from 'zod';

export interface Naismiths_rule_calculatorInput {
  distance: number;
  ascent: number;
  descent: number;
  pace: number;
  ascentTimePer100m: number;
  descentTimePer100m: number;
}

export const Naismiths_rule_calculatorInputSchema = z.object({
  distance: z.number().default(10),
  ascent: z.number().default(500),
  descent: z.number().default(500),
  pace: z.number().default(5),
  ascentTimePer100m: z.number().default(10),
  descentTimePer100m: z.number().default(5),
});

function evaluateAllFormulas(input: Naismiths_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance * input.pace; results["flatTime"] = Number.isFinite(v) ? v : 0; } catch { results["flatTime"] = 0; }
  try { const v = (input.ascent / 100) * input.ascentTimePer100m; results["ascentTime"] = Number.isFinite(v) ? v : 0; } catch { results["ascentTime"] = 0; }
  try { const v = (input.descent / 100) * input.descentTimePer100m; results["descentTime"] = Number.isFinite(v) ? v : 0; } catch { results["descentTime"] = 0; }
  try { const v = (results["flatTime"] ?? 0) + (results["ascentTime"] ?? 0) + (results["descentTime"] ?? 0); results["totalTimeMin"] = Number.isFinite(v) ? v : 0; } catch { results["totalTimeMin"] = 0; }
  try { const v = (results["totalTimeMin"] ?? 0) / 60; results["totalTimeHours"] = Number.isFinite(v) ? v : 0; } catch { results["totalTimeHours"] = 0; }
  results["_flatTime__minutes"] = 0;
  results["_ascentTime__minutes"] = 0;
  results["_descentTime__minutes"] = 0;
  results["_totalTimeMin__minutes"] = 0;
  return results;
}


export function calculateNaismiths_rule_calculator(input: Naismiths_rule_calculatorInput): Naismiths_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["flatTime"] ?? 0;
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


export interface Naismiths_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
