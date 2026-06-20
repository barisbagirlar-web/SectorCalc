// Auto-generated from adaptive-thermogenesis-calculator-schema.json
import * as z from 'zod';

export interface Adaptive_thermogenesis_calculatorInput {
  bee: number;
  energyIntake: number;
  duration: number;
  weight: number;
  tau: number;
  fatFreeMass: number;
  dataConfidence?: number;
}

export const Adaptive_thermogenesis_calculatorInputSchema = z.object({
  bee: z.number().default(2000),
  energyIntake: z.number().default(1500),
  duration: z.number().default(30),
  weight: z.number().default(70),
  tau: z.number().default(14),
  fatFreeMass: z.number().default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Adaptive_thermogenesis_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bee - input.energyIntake; results["initialDeficit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["initialDeficit"] = Number.NaN; }
  try { const v = input.fatFreeMass / input.weight; results["ffmFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ffmFactor"] = Number.NaN; }
  return results;
}


export function calculateAdaptive_thermogenesis_calculator(input: Adaptive_thermogenesis_calculatorInput): Adaptive_thermogenesis_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ffmFactor"]);
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


export interface Adaptive_thermogenesis_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
