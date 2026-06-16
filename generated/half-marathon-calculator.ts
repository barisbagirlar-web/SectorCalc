// Auto-generated from half-marathon-calculator-schema.json
import * as z from 'zod';

export interface Half_marathon_calculatorInput {
  distance: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Half_marathon_calculatorInputSchema = z.object({
  distance: z.number().default(21.1),
  hours: z.number().default(1),
  minutes: z.number().default(45),
  seconds: z.number().default(0),
});

function evaluateAllFormulas(input: Half_marathon_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.hours * 3600 + input.minutes * 60 + input.seconds) / input.distance; results["pacePerKm"] = Number.isFinite(v) ? v : 0; } catch { results["pacePerKm"] = 0; }
  try { const v = (input.distance * 3600) / (input.hours * 3600 + input.minutes * 60 + input.seconds); results["speedKmh"] = Number.isFinite(v) ? v : 0; } catch { results["speedKmh"] = 0; }
  try { const v = (input.hours * 3600 + input.minutes * 60 + input.seconds) / input.distance * 5; results["split5km"] = Number.isFinite(v) ? v : 0; } catch { results["split5km"] = 0; }
  try { const v = (input.hours * 3600 + input.minutes * 60 + input.seconds) / input.distance * 10; results["split10km"] = Number.isFinite(v) ? v : 0; } catch { results["split10km"] = 0; }
  try { const v = (input.hours * 3600 + input.minutes * 60 + input.seconds) / input.distance * 15; results["split15km"] = Number.isFinite(v) ? v : 0; } catch { results["split15km"] = 0; }
  try { const v = (input.hours * 3600 + input.minutes * 60 + input.seconds) / input.distance * 20; results["split20km"] = Number.isFinite(v) ? v : 0; } catch { results["split20km"] = 0; }
  return results;
}


export function calculateHalf_marathon_calculator(input: Half_marathon_calculatorInput): Half_marathon_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pacePerKm"] ?? 0;
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


export interface Half_marathon_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
