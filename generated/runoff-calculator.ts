// Auto-generated from runoff-calculator-schema.json
import * as z from 'zod';

export interface Runoff_calculatorInput {
  catchmentArea: number;
  runoffCoefficient: number;
  rainfallIntensity: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Runoff_calculatorInputSchema = z.object({
  catchmentArea: z.number(),
  runoffCoefficient: z.number(),
  rainfallIntensity: z.number(),
  safetyFactor: z.number(),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Runoff_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.runoffCoefficient * input.rainfallIntensity * input.catchmentArea / 3600; results["runoffBase"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["runoffBase"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["runoffBase"])) * input.safetyFactor; results["runoffLps"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["runoffLps"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["runoffLps"])) / 1000; results["runoffM3s"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["runoffM3s"] = Number.NaN; }
  return results;
}


export function calculateRunoff_calculator(input: Runoff_calculatorInput): Runoff_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["runoffLps"]);
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


export interface Runoff_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
