// Auto-generated from kb-calculator-schema.json
import * as z from 'zod';

export interface Kb_calculatorInput {
  wireDia: number;
  coilDia: number;
  activeCoils: number;
  shearModulus: number;
  dataConfidence?: number;
}

export const Kb_calculatorInputSchema = z.object({
  wireDia: z.number().default(1),
  coilDia: z.number().default(10),
  activeCoils: z.number().default(10),
  shearModulus: z.number().default(80000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Kb_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wireDia * input.coilDia * input.activeCoils * input.shearModulus; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.wireDia * input.coilDia * input.activeCoils * input.shearModulus; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateKb_calculator(input: Kb_calculatorInput): Kb_calculatorOutput {
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


export interface Kb_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
