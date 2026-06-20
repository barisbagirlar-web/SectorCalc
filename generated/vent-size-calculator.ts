// Auto-generated from vent-size-calculator-schema.json
import * as z from 'zod';

export interface Vent_size_calculatorInput {
  volume: number;
  ach: number;
  velocity: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Vent_size_calculatorInputSchema = z.object({
  volume: z.number().default(100),
  ach: z.number().default(5),
  velocity: z.number().default(2),
  safetyFactor: z.number().default(1.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vent_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.ach * input.volume) / 3600; results["flow"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["flow"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["flow"])) / input.velocity; results["areaRaw"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["areaRaw"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["areaRaw"])) * input.safetyFactor; results["areaFinal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["areaFinal"] = Number.NaN; }
  return results;
}


export function calculateVent_size_calculator(input: Vent_size_calculatorInput): Vent_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["areaFinal"]);
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


export interface Vent_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
