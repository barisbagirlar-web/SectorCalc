// Auto-generated from met-calculator-schema.json
import * as z from 'zod';

export interface Met_calculatorInput {
  metValue: number;
  weightKg: number;
  durationMin: number;
  adjustmentFactor: number;
  dataConfidence?: number;
}

export const Met_calculatorInputSchema = z.object({
  metValue: z.number().default(1),
  weightKg: z.number().default(70),
  durationMin: z.number().default(30),
  adjustmentFactor: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Met_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.metValue * input.weightKg * (input.durationMin / 60) * input.adjustmentFactor; results["totalCal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCal"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCal"])) / input.durationMin; results["calPerMin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["calPerMin"] = Number.NaN; }
  try { const v = input.metValue * (input.durationMin / 60); results["metHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["metHours"] = Number.NaN; }
  return results;
}


export function calculateMet_calculator(input: Met_calculatorInput): Met_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCal"]);
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


export interface Met_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
