// Auto-generated from root-canal-calculator-schema.json
import * as z from 'zod';

export interface Root_canal_calculatorInput {
  apicalDiameter: number;
  d16Diameter: number;
  workingLength: number;
  desiredOrificeDiameter: number;
  dataConfidence?: number;
}

export const Root_canal_calculatorInputSchema = z.object({
  apicalDiameter: z.number().default(0.15),
  d16Diameter: z.number().default(1),
  workingLength: z.number().default(22),
  desiredOrificeDiameter: z.number().default(1.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Root_canal_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.d16Diameter - input.apicalDiameter) / 16; results["taper"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taper"] = Number.NaN; }
  try { const v = input.apicalDiameter + (toNumericFormulaValue(results["taper"])) * input.workingLength; results["actualOrificeDiameter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actualOrificeDiameter"] = Number.NaN; }
  try { const v = (input.desiredOrificeDiameter - input.apicalDiameter) / input.workingLength; results["requiredTaper"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredTaper"] = Number.NaN; }
  return results;
}


export function calculateRoot_canal_calculator(input: Root_canal_calculatorInput): Root_canal_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["actualOrificeDiameter"]);
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


export interface Root_canal_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
