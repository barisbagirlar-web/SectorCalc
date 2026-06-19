// Auto-generated from jam-calculator-schema.json
import * as z from 'zod';

export interface Jam_calculatorInput {
  fruitWeight: number;
  fruitBrix: number;
  targetBrix: number;
  pectinWeight: number;
  pectinSugarContent: number;
  dataConfidence?: number;
}

export const Jam_calculatorInputSchema = z.object({
  fruitWeight: z.number().default(10),
  fruitBrix: z.number().default(10),
  targetBrix: z.number().default(65),
  pectinWeight: z.number().default(0),
  pectinSugarContent: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Jam_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fruitWeight * (input.fruitBrix / 100) * (input.targetBrix / 100) * input.pectinWeight; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.fruitWeight * (input.fruitBrix / 100) * (input.targetBrix / 100) * input.pectinWeight * ((input.pectinSugarContent / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = (input.pectinSugarContent / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateJam_calculator(input: Jam_calculatorInput): Jam_calculatorOutput {
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


export interface Jam_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
