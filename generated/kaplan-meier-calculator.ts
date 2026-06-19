// Auto-generated from kaplan-meier-calculator-schema.json
import * as z from 'zod';

export interface Kaplan_meier_calculatorInput {
  time1: number;
  risk1: number;
  events1: number;
  time2: number;
  risk2: number;
  events2: number;
  dataConfidence?: number;
}

export const Kaplan_meier_calculatorInputSchema = z.object({
  time1: z.number().default(0),
  risk1: z.number().default(0),
  events1: z.number().default(0),
  time2: z.number().default(0),
  risk2: z.number().default(0),
  events2: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Kaplan_meier_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 - (input.events1 / input.risk1); results["survival1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["survival1"] = 0; }
  try { const v = (1 - (input.events1 / input.risk1)) * (1 - (input.events2 / input.risk2)); results["survival2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["survival2"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateKaplan_meier_calculator(input: Kaplan_meier_calculatorInput): Kaplan_meier_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["survival2"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Kaplan_meier_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
