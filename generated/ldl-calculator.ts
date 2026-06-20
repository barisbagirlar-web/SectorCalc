// Auto-generated from ldl-calculator-schema.json
import * as z from 'zod';

export interface Ldl_calculatorInput {
  totalCholesterol: number;
  hdl: number;
  triglycerides: number;
  directLdl: number;
  dataConfidence?: number;
}

export const Ldl_calculatorInputSchema = z.object({
  totalCholesterol: z.number().default(200),
  hdl: z.number().default(50),
  triglycerides: z.number().default(150),
  directLdl: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ldl_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.directLdl > 0 ? input.directLdl : input.totalCholesterol - input.hdl - (input.triglycerides / 5); results["ldl"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ldl"] = Number.NaN; }
  try { const v = input.directLdl > 0 ? null : (input.triglycerides / 5); results["vldl"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vldl"] = Number.NaN; }
  try { const v = input.totalCholesterol - input.hdl; results["nonHdl"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nonHdl"] = Number.NaN; }
  return results;
}


export function calculateLdl_calculator(input: Ldl_calculatorInput): Ldl_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ldl"]);
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


export interface Ldl_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
