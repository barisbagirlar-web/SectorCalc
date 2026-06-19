// Auto-generated from weld-size-calculator-schema.json
import * as z from 'zod';

export interface Weld_size_calculatorInput {
  force: number;
  allowableStress: number;
  numWelds: number;
  weldLengthPer: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Weld_size_calculatorInputSchema = z.object({
  force: z.number().default(50),
  allowableStress: z.number().default(100),
  numWelds: z.number().default(2),
  weldLengthPer: z.number().default(100),
  safetyFactor: z.number().default(1.5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Weld_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numWelds * input.weldLengthPer; results["totalLength"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalLength"] = 0; }
  try { const v = input.force * input.safetyFactor; results["designForce"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["designForce"] = 0; }
  try { const v = ((asFormulaNumber(results["designForce"])) * 1000) / (input.allowableStress * (asFormulaNumber(results["totalLength"]))); results["throatRequired"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["throatRequired"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWeld_size_calculator(input: Weld_size_calculatorInput): Weld_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["throatRequired"]));
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


export interface Weld_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
