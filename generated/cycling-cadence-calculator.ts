// Auto-generated from cycling-cadence-calculator-schema.json
import * as z from 'zod';

export interface Cycling_cadence_calculatorInput {
  speed: number;
  frontTeeth: number;
  rearTeeth: number;
  wheelDiameter: number;
  dataConfidence?: number;
}

export const Cycling_cadence_calculatorInputSchema = z.object({
  speed: z.number().default(25),
  frontTeeth: z.number().default(50),
  rearTeeth: z.number().default(15),
  wheelDiameter: z.number().default(700),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cycling_cadence_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.speed * 1000000) / (60 * Math.PI * (input.frontTeeth / input.rearTeeth) * input.wheelDiameter); results["cadence"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cadence"] = 0; }
  try { const v = input.frontTeeth / input.rearTeeth; results["gearRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gearRatio"] = 0; }
  try { const v = Math.PI * input.wheelDiameter; results["wheelCircumference"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wheelCircumference"] = 0; }
  try { const v = (input.frontTeeth / input.rearTeeth) * Math.PI * input.wheelDiameter / 1000; results["distancePerRev"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["distancePerRev"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCycling_cadence_calculator(input: Cycling_cadence_calculatorInput): Cycling_cadence_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["cadence"]);
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


export interface Cycling_cadence_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
