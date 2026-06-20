// Auto-generated from yagi-calculator-schema.json
import * as z from 'zod';

export interface Yagi_calculatorInput {
  frequency: number;
  numElements: number;
  velocityFactor: number;
  spacingFactor: number;
  dataConfidence?: number;
}

export const Yagi_calculatorInputSchema = z.object({
  frequency: z.number().default(144),
  numElements: z.number().default(3),
  velocityFactor: z.number().default(0.95),
  spacingFactor: z.number().default(0.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Yagi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 300 / input.frequency; results["wavelength"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wavelength"] = Number.NaN; }
  try { const v = 0.5 * (toNumericFormulaValue(results["wavelength"])) * input.velocityFactor; results["drivenElement"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["drivenElement"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["drivenElement"])) * 1.05; results["reflectorLength"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["reflectorLength"] = Number.NaN; }
  try { const v = (input.numElements - 1) * input.spacingFactor * (toNumericFormulaValue(results["wavelength"])); results["boomLength"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["boomLength"] = Number.NaN; }
  return results;
}


export function calculateYagi_calculator(input: Yagi_calculatorInput): Yagi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["boomLength"]);
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


export interface Yagi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
