// Auto-generated from burnout-calculator-schema.json
import * as z from 'zod';

export interface Burnout_calculatorInput {
  motorRatedPower: number;
  actualLoad: number;
  ambientTemperature: number;
  maxInsulationTemp: number;
  ratedAmbient: number;
  thermalTimeConstant: number;
  dutyCycle: number;
  dataConfidence?: number;
}

export const Burnout_calculatorInputSchema = z.object({
  motorRatedPower: z.number().default(10),
  actualLoad: z.number().default(12),
  ambientTemperature: z.number().default(25),
  maxInsulationTemp: z.number().default(130),
  ratedAmbient: z.number().default(40),
  thermalTimeConstant: z.number().default(30),
  dutyCycle: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Burnout_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.actualLoad / input.motorRatedPower; results["loadFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["loadFactor"] = 0; }
  try { const v = input.maxInsulationTemp - input.ratedAmbient; results["deltaTRated"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["deltaTRated"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBurnout_calculator(input: Burnout_calculatorInput): Burnout_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["deltaTRated"]));
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


export interface Burnout_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
