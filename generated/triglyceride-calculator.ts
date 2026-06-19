// Auto-generated from triglyceride-calculator-schema.json
import * as z from 'zod';

export interface Triglyceride_calculatorInput {
  fa_moles: number;
  fa_mw: number;
  glycerol_moles: number;
  glycerol_mw: number;
  yield_percent: number;
  dataConfidence?: number;
}

export const Triglyceride_calculatorInputSchema = z.object({
  fa_moles: z.number().default(3),
  fa_mw: z.number().default(282.47),
  glycerol_moles: z.number().default(1),
  glycerol_mw: z.number().default(92.09),
  yield_percent: z.number().default(95),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Triglyceride_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fa_moles * input.fa_mw * input.glycerol_moles * input.glycerol_mw; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.fa_moles * input.fa_mw * input.glycerol_moles * input.glycerol_mw * ((input.yield_percent / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = (input.yield_percent / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTriglyceride_calculator(input: Triglyceride_calculatorInput): Triglyceride_calculatorOutput {
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


export interface Triglyceride_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
