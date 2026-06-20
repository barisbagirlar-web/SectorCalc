// Auto-generated from wire-size-calculator-schema.json
import * as z from 'zod';

export interface Wire_size_calculatorInput {
  current: number;
  voltage: number;
  length: number;
  material: number;
  voltageDropPercent: number;
  phases: number;
  dataConfidence?: number;
}

export const Wire_size_calculatorInputSchema = z.object({
  current: z.number().default(10),
  voltage: z.number().default(230),
  length: z.number().default(50),
  material: z.number().default(0),
  voltageDropPercent: z.number().default(3),
  phases: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wire_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.current * input.voltage * input.length * input.material; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.current * input.voltage * input.length * input.material * ((input.voltageDropPercent / 100) * input.phases); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = (input.voltageDropPercent / 100) * input.phases; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateWire_size_calculator(input: Wire_size_calculatorInput): Wire_size_calculatorOutput {
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


export interface Wire_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
