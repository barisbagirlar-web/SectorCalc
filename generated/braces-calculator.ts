// Auto-generated from braces-calculator-schema.json
import * as z from 'zod';

export interface Braces_calculatorInput {
  span: number;
  height: number;
  bays: number;
  crossSectionArea: number;
  materialDensity: number;
  dataConfidence?: number;
}

export const Braces_calculatorInputSchema = z.object({
  span: z.number().default(5),
  height: z.number().default(3),
  bays: z.number().default(4),
  crossSectionArea: z.number().default(0.001),
  materialDensity: z.number().default(7850),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Braces_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.span * input.height * input.bays * input.crossSectionArea; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.span * input.height * input.bays * input.crossSectionArea * (input.materialDensity); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.materialDensity; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateBraces_calculator(input: Braces_calculatorInput): Braces_calculatorOutput {
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


export interface Braces_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
