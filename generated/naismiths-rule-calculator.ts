// Auto-generated from naismiths-rule-calculator-schema.json
import * as z from 'zod';

export interface Naismiths_rule_calculatorInput {
  distance: number;
  ascent: number;
  descent: number;
  pace: number;
  ascentTimePer100m: number;
  descentTimePer100m: number;
  dataConfidence?: number;
}

export const Naismiths_rule_calculatorInputSchema = z.object({
  distance: z.number().default(10),
  ascent: z.number().default(500),
  descent: z.number().default(500),
  pace: z.number().default(5),
  ascentTimePer100m: z.number().default(10),
  descentTimePer100m: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Naismiths_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.distance * input.pace; results["flatTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["flatTime"] = Number.NaN; }
  try { const v = (input.ascent / 100) * input.ascentTimePer100m; results["ascentTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ascentTime"] = Number.NaN; }
  try { const v = (input.descent / 100) * input.descentTimePer100m; results["descentTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["descentTime"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["flatTime"])) + (toNumericFormulaValue(results["ascentTime"])) + (toNumericFormulaValue(results["descentTime"])); results["totalTimeMin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTimeMin"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalTimeMin"])) / 60; results["totalTimeHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTimeHours"] = Number.NaN; }
  return results;
}


export function calculateNaismiths_rule_calculator(input: Naismiths_rule_calculatorInput): Naismiths_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["flatTime"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Naismiths_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
