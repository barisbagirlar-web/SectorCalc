// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Indicated_horsepower_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = Math.PI * input.bore * input.bore / 4; results["pistonArea"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pistonArea"] = 0; }
  try { const v = input.stroke / 12; results["strokeFt"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["strokeFt"] = 0; }
  try { const v = input.speed * input.cylinders * 2 / input.cycles; results["powerStrokesPerMinute"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["powerStrokesPerMinute"] = 0; }
  try { const v = input.pressure * (asFormulaNumber(results["strokeFt"])) * (asFormulaNumber(results["pistonArea"])) * (asFormulaNumber(results["powerStrokesPerMinute"])) / 33000; results["indicatedHorsepower"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["indicatedHorsepower"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateIndicated_horsepower_calculator(input: Indicated_horsepower_calculatorInput): Indicated_horsepower_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["indicatedHorsepower"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
