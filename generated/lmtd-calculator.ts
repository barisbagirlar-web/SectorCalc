// Auto-generated from lmtd-calculator-schema.json
import * as z from 'zod';

export interface Lmtd_calculatorInput {
  thIn: number;
  thOut: number;
  tcIn: number;
  tcOut: number;
  flowType: number;
  dataConfidence?: number;
}

export const Lmtd_calculatorInputSchema = z.object({
  thIn: z.number().default(90),
  thOut: z.number().default(70),
  tcIn: z.number().default(30),
  tcOut: z.number().default(50),
  flowType: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lmtd_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.flowType === 1 ? (input.thIn - input.tcOut) : (input.thIn - input.tcIn)) ? 1 : 0); results["deltaT1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deltaT1"] = Number.NaN; }
  try { const v = ((input.flowType === 1 ? (input.thOut - input.tcIn) : (input.thOut - input.tcOut)) ? 1 : 0); results["deltaT2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deltaT2"] = Number.NaN; }
  return results;
}


export function calculateLmtd_calculator(input: Lmtd_calculatorInput): Lmtd_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["deltaT2"]);
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


export interface Lmtd_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
