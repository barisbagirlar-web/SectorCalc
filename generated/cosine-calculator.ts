// Auto-generated from cosine-calculator-schema.json
import * as z from 'zod';

export interface Cosine_calculatorInput {
  angle: number;
  unitSelector: number;
  amplitude: number;
  frequency: number;
  phaseShift: number;
  roundTo: number;
}

export const Cosine_calculatorInputSchema = z.object({
  angle: z.number().default(0),
  unitSelector: z.number().default(0),
  amplitude: z.number().default(1),
  frequency: z.number().default(1),
  phaseShift: z.number().default(0),
  roundTo: z.number().default(4),
});

function evaluateAllFormulas(input: Cosine_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.unitSelector === 0 ? (input.angle * Math.PI / 180) : input.angle; results["radianAngle"] = Number.isFinite(v) ? v : 0; } catch { results["radianAngle"] = 0; }
  try { const v = (results["radianAngle"] ?? 0) * input.frequency + input.phaseShift; results["argument"] = Number.isFinite(v) ? v : 0; } catch { results["argument"] = 0; }
  try { const v = input.amplitude * Math.cos((results["argument"] ?? 0)); results["rawCos"] = Number.isFinite(v) ? v : 0; } catch { results["rawCos"] = 0; }
  try { const v = Math.round((results["rawCos"] ?? 0) * 10**input.roundTo) / 10**input.roundTo; results["finalResult"] = Number.isFinite(v) ? v : 0; } catch { results["finalResult"] = 0; }
  return results;
}


export function calculateCosine_calculator(input: Cosine_calculatorInput): Cosine_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalResult"] ?? 0;
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


export interface Cosine_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
