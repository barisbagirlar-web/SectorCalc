// Auto-generated from dcf-calculator-schema.json
import * as z from 'zod';

export interface Dcf_calculatorInput {
  cf1: number;
  cf2: number;
  cf3: number;
  cf4: number;
  cf5: number;
  discountRate: number;
  growthRate: number;
  dataConfidence?: number;
}

export const Dcf_calculatorInputSchema = z.object({
  cf1: z.number().default(0),
  cf2: z.number().default(0),
  cf3: z.number().default(0),
  cf4: z.number().default(0),
  cf5: z.number().default(0),
  discountRate: z.number().default(10),
  growthRate: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dcf_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.discountRate / 100; results["discount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discount"] = Number.NaN; }
  try { const v = input.growthRate / 100; results["growth"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["growth"] = Number.NaN; }
  try { const v = input.cf1 / ((1 + (toNumericFormulaValue(results["discount"]))) ** 1); results["pvYear1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pvYear1"] = Number.NaN; }
  try { const v = input.cf2 / ((1 + (toNumericFormulaValue(results["discount"]))) ** 2); results["pvYear2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pvYear2"] = Number.NaN; }
  try { const v = input.cf3 / ((1 + (toNumericFormulaValue(results["discount"]))) ** 3); results["pvYear3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pvYear3"] = Number.NaN; }
  try { const v = input.cf4 / ((1 + (toNumericFormulaValue(results["discount"]))) ** 4); results["pvYear4"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pvYear4"] = Number.NaN; }
  try { const v = input.cf5 / ((1 + (toNumericFormulaValue(results["discount"]))) ** 5); results["pvYear5"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pvYear5"] = Number.NaN; }
  try { const v = (input.cf5 * (1 + (toNumericFormulaValue(results["growth"])))) / ((toNumericFormulaValue(results["discount"])) - (toNumericFormulaValue(results["growth"]))); results["terminalValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["terminalValue"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["terminalValue"])) / ((1 + (toNumericFormulaValue(results["discount"]))) ** 5); results["terminalValuePV"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["terminalValuePV"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["pvYear1"])) + (toNumericFormulaValue(results["pvYear2"])) + (toNumericFormulaValue(results["pvYear3"])) + (toNumericFormulaValue(results["pvYear4"])) + (toNumericFormulaValue(results["pvYear5"])) + (toNumericFormulaValue(results["terminalValuePV"])); results["dcfValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dcfValue"] = Number.NaN; }
  return results;
}


export function calculateDcf_calculator(input: Dcf_calculatorInput): Dcf_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dcfValue"]);
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


export interface Dcf_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
