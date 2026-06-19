// Auto-generated from wim-hof-calculator-schema.json
import * as z from 'zod';

export interface Wim_hof_calculatorInput {
  age: number;
  weight: number;
  height: number;
  coreTemp: number;
  ambientTemp: number;
  exposureTime: number;
  dataConfidence?: number;
}

export const Wim_hof_calculatorInputSchema = z.object({
  age: z.number().default(30),
  weight: z.number().default(70),
  height: z.number().default(170),
  coreTemp: z.number().default(37),
  ambientTemp: z.number().default(10),
  exposureTime: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Wim_hof_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.age * input.weight * input.height * input.coreTemp; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.age * input.weight * input.height * input.coreTemp * (input.ambientTemp * input.exposureTime); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.ambientTemp * input.exposureTime; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWim_hof_calculator(input: Wim_hof_calculatorInput): Wim_hof_calculatorOutput {
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


export interface Wim_hof_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
