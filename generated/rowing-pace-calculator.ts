// Auto-generated from rowing-pace-calculator-schema.json
import * as z from 'zod';

export interface Rowing_pace_calculatorInput {
  distance: number;
  time_minutes: number;
  time_seconds: number;
  target_distance: number;
}

export const Rowing_pace_calculatorInputSchema = z.object({
  distance: z.number().default(2000),
  time_minutes: z.number().default(0),
  time_seconds: z.number().default(0),
  target_distance: z.number().default(2000),
});

function evaluateAllFormulas(input: Rowing_pace_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.time_minutes * 60 + input.time_seconds; results["total_time_seconds"] = Number.isFinite(v) ? v : 0; } catch { results["total_time_seconds"] = 0; }
  try { const v = (results["total_time_seconds"] ?? 0) * 500 / input.distance; results["pace_500m_seconds"] = Number.isFinite(v) ? v : 0; } catch { results["pace_500m_seconds"] = 0; }
  try { const v = (results["pace_500m_seconds"] ?? 0) * input.target_distance / 500; results["projected_time_seconds"] = Number.isFinite(v) ? v : 0; } catch { results["projected_time_seconds"] = 0; }
  try { const v = input.distance / (results["total_time_seconds"] ?? 0); results["speed_ms"] = Number.isFinite(v) ? v : 0; } catch { results["speed_ms"] = 0; }
  try { const v = (results["speed_ms"] ?? 0) * 3.6; results["speed_kmh"] = Number.isFinite(v) ? v : 0; } catch { results["speed_kmh"] = 0; }
  return results;
}


export function calculateRowing_pace_calculator(input: Rowing_pace_calculatorInput): Rowing_pace_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pace_500m_seconds"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
