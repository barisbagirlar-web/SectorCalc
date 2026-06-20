// Auto-generated from cosine-calculator-schema.json
import * as z from 'zod';

export interface Cosine_calculatorInput {
  angle: number;
  unitSelector: number;
  amplitude: number;
  frequency: number;
  phaseShift: number;
  roundTo: number;
  dataConfidence?: number;
}

export const Cosine_calculatorInputSchema = z.object({
  angle: z.number().default(0),
  unitSelector: z.number().default(0),
  amplitude: z.number().default(1),
  frequency: z.number().default(1),
  phaseShift: z.number().default(0),
  roundTo: z.number().default(4),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cosine_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.unitSelector === 0 ? (input.angle * Math.PI / 180) : input.angle; results["radianAngle"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["radianAngle"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["radianAngle"])) * input.frequency + input.phaseShift; results["argument"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["argument"] = Number.NaN; }
  return results;
}


export function calculateCosine_calculator(input: Cosine_calculatorInput): Cosine_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["argument"]);
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


export interface Cosine_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
