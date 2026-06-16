// Auto-generated from indicated-horsepower-calculator-schema.json
import * as z from 'zod';

export interface Indicated_horsepower_calculatorInput {
  pressure: number;
  bore: number;
  stroke: number;
  speed: number;
  cylinders: number;
  cycles: number;
}

export const Indicated_horsepower_calculatorInputSchema = z.object({
  pressure: z.number().default(100),
  bore: z.number().default(4),
  stroke: z.number().default(4),
  speed: z.number().default(3000),
  cylinders: z.number().default(4),
  cycles: z.number().default(4),
});

function evaluateAllFormulas(input: Indicated_horsepower_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * input.bore * input.bore / 4; results["pistonArea"] = Number.isFinite(v) ? v : 0; } catch { results["pistonArea"] = 0; }
  try { const v = input.stroke / 12; results["strokeFt"] = Number.isFinite(v) ? v : 0; } catch { results["strokeFt"] = 0; }
  try { const v = input.speed * input.cylinders * 2 / input.cycles; results["powerStrokesPerMinute"] = Number.isFinite(v) ? v : 0; } catch { results["powerStrokesPerMinute"] = 0; }
  try { const v = input.pressure * (results["strokeFt"] ?? 0) * (results["pistonArea"] ?? 0) * (results["powerStrokesPerMinute"] ?? 0) / 33000; results["indicatedHorsepower"] = Number.isFinite(v) ? v : 0; } catch { results["indicatedHorsepower"] = 0; }
  return results;
}


export function calculateIndicated_horsepower_calculator(input: Indicated_horsepower_calculatorInput): Indicated_horsepower_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["indicatedHorsepower"] ?? 0;
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


export interface Indicated_horsepower_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
