// @ts-nocheck
// Auto-generated from non-hdl-cholesterol-calculator-schema.json
import * as z from 'zod';

export interface Non_hdl_cholesterol_calculatorInput {
  totalCholesterol: number;
  hdlCholesterol: number;
  triglycerides: number;
  calculateLdl: number;
}

export const Non_hdl_cholesterol_calculatorInputSchema = z.object({
  totalCholesterol: z.number().default(200),
  hdlCholesterol: z.number().default(50),
  triglycerides: z.number().default(150),
  calculateLdl: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Non_hdl_cholesterol_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.totalCholesterol - input.hdlCholesterol; results["nonHdlCholesterol"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["nonHdlCholesterol"] = 0; }
  try { const v = input.calculateLdl * (input.totalCholesterol - input.hdlCholesterol - (input.triglycerides / 5)); results["ldlCholesterol"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ldlCholesterol"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateNon_hdl_cholesterol_calculator(input: Non_hdl_cholesterol_calculatorInput): Non_hdl_cholesterol_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["nonHdlCholesterol"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Non_hdl_cholesterol_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
