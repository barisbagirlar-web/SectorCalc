// Auto-generated from hydration-calculator-schema.json
import * as z from 'zod';

export interface Hydration_calculatorInput {
  weight: number;
  moderate_activity_hours: number;
  heavy_activity_hours: number;
  average_temperature: number;
  dataConfidence?: number;
}

export const Hydration_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  moderate_activity_hours: z.number().default(0),
  heavy_activity_hours: z.number().default(0),
  average_temperature: z.number().default(25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hydration_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * 0.033 + input.moderate_activity_hours * 0.35 + input.heavy_activity_hours * 0.7 + (input.average_temperature > 30 ? (input.average_temperature - 30) * 0.2 : 0); results["total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total"] = Number.NaN; }
  try { const v = input.weight * 0.033; results["base"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base"] = Number.NaN; }
  try { const v = input.moderate_activity_hours * 0.35 + input.heavy_activity_hours * 0.7; results["activity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["activity"] = Number.NaN; }
  try { const v = input.average_temperature > 30 ? (input.average_temperature - 30) * 0.2 : 0; results["tempAdjust"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tempAdjust"] = Number.NaN; }
  return results;
}


export function calculateHydration_calculator(input: Hydration_calculatorInput): Hydration_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["tempAdjust"]);
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


export interface Hydration_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
