// Auto-generated from nicotine-calculator-schema.json
import * as z from 'zod';

export interface Nicotine_calculatorInput {
  targetNicotine: number;
  finalVolume: number;
  baseNicotine: number;
  baseVG: number;
  desiredVG: number;
  dataConfidence?: number;
}

export const Nicotine_calculatorInputSchema = z.object({
  targetNicotine: z.number().default(6),
  finalVolume: z.number().default(100),
  baseNicotine: z.number().default(100),
  baseVG: z.number().default(100),
  desiredVG: z.number().default(70),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Nicotine_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.targetNicotine * input.finalVolume) / input.baseNicotine; results["requiredBaseVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["requiredBaseVolume"] = 0; }
  try { const v = (input.finalVolume * (100 - input.desiredVG) / 100) - (((input.targetNicotine * input.finalVolume) / input.baseNicotine) * (100 - input.baseVG) / 100); results["additionalPG"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["additionalPG"] = 0; }
  try { const v = (input.finalVolume * input.desiredVG / 100) - (((input.targetNicotine * input.finalVolume) / input.baseNicotine) * input.baseVG / 100); results["additionalVG"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["additionalVG"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateNicotine_calculator(input: Nicotine_calculatorInput): Nicotine_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["requiredBaseVolume"]));
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


export interface Nicotine_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
