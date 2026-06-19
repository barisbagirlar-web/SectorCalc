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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Vent_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.ach * input.volume) / 3600; results["flow"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["flow"] = 0; }
  try { const v = (asFormulaNumber(results["flow"])) / input.velocity; results["areaRaw"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["areaRaw"] = 0; }
  try { const v = (asFormulaNumber(results["areaRaw"])) * input.safetyFactor; results["areaFinal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["areaFinal"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateVent_size_calculator(input: Vent_size_calculatorInput): Vent_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["areaFinal"]));
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


export interface Vent_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
