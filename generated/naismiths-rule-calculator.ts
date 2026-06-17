// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Naismiths_rule_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.distance * input.pace; results["flatTime"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["flatTime"] = 0; }
  try { const v = (input.ascent / 100) * input.ascentTimePer100m; results["ascentTime"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ascentTime"] = 0; }
  try { const v = (input.descent / 100) * input.descentTimePer100m; results["descentTime"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["descentTime"] = 0; }
  try { const v = (asFormulaNumber(results["flatTime"])) + (asFormulaNumber(results["ascentTime"])) + (asFormulaNumber(results["descentTime"])); results["totalTimeMin"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalTimeMin"] = 0; }
  try { const v = (asFormulaNumber(results["totalTimeMin"])) / 60; results["totalTimeHours"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalTimeHours"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateNaismiths_rule_calculator(input: Naismiths_rule_calculatorInput): Naismiths_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["flatTime"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
