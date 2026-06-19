// Auto-generated from cycling-calculator-schema.json
import * as z from 'zod';

export interface Cycling_calculatorInput {
  wheelDiameter: number;
  cadence: number;
  chainringTeeth: number;
  cogTeeth: number;
  timeMinutes: number;
  dataConfidence?: number;
}

export const Cycling_calculatorInputSchema = z.object({
  wheelDiameter: z.number().default(622),
  cadence: z.number().default(90),
  chainringTeeth: z.number().default(50),
  cogTeeth: z.number().default(17),
  timeMinutes: z.number().default(60),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cycling_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.chainringTeeth / input.cogTeeth; results["gearRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gearRatio"] = 0; }
  try { const v = (Math.PI * input.wheelDiameter * input.cadence * (asFormulaNumber(results["gearRatio"])) * 60) / 1000000; results["speed"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["speed"] = 0; }
  try { const v = (asFormulaNumber(results["speed"])) * (input.timeMinutes / 60); results["distance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["distance"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCycling_calculator(input: Cycling_calculatorInput): Cycling_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["speed"]));
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


export interface Cycling_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
