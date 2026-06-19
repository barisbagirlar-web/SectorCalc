// Auto-generated from gambrel-roof-calculator-schema.json
import * as z from 'zod';

export interface Gambrel_roof_calculatorInput {
  width: number;
  length: number;
  lowerAngle: number;
  upperAngle: number;
  lowerRun: number;
  dataConfidence?: number;
}

export const Gambrel_roof_calculatorInputSchema = z.object({
  width: z.number().default(10),
  length: z.number().default(20),
  lowerAngle: z.number().default(60),
  upperAngle: z.number().default(30),
  lowerRun: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gambrel_roof_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.lowerAngle * Math.PI / 180; results["radLower"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["radLower"] = 0; }
  try { const v = input.upperAngle * Math.PI / 180; results["radUpper"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["radUpper"] = 0; }
  try { const v = input.width / 2 - input.lowerRun; results["upperRun"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["upperRun"] = 0; }
  try { const v = input.length; results["ridgeLength"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ridgeLength"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGambrel_roof_calculator(input: Gambrel_roof_calculatorInput): Gambrel_roof_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ridgeLength"]);
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


export interface Gambrel_roof_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
