// Auto-generated from rowing-pace-calculator-schema.json
import * as z from 'zod';

export interface Rowing_pace_calculatorInput {
  distance: number;
  time_minutes: number;
  time_seconds: number;
  target_distance: number;
  dataConfidence?: number;
}

export const Rowing_pace_calculatorInputSchema = z.object({
  distance: z.number().default(2000),
  time_minutes: z.number().default(0),
  time_seconds: z.number().default(0),
  target_distance: z.number().default(2000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rowing_pace_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.time_minutes * 60 + input.time_seconds; results["total_time_seconds"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_time_seconds"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["total_time_seconds"])) * 500 / input.distance; results["pace_500m_seconds"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pace_500m_seconds"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["pace_500m_seconds"])) * input.target_distance / 500; results["projected_time_seconds"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["projected_time_seconds"] = Number.NaN; }
  try { const v = input.distance / (toNumericFormulaValue(results["total_time_seconds"])); results["speed_ms"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["speed_ms"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["speed_ms"])) * 3.6; results["speed_kmh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["speed_kmh"] = Number.NaN; }
  return results;
}


export function calculateRowing_pace_calculator(input: Rowing_pace_calculatorInput): Rowing_pace_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pace_500m_seconds"]);
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


export interface Rowing_pace_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
