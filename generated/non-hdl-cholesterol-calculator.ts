// Auto-generated from non-hdl-cholesterol-calculator-schema.json
import * as z from 'zod';

export interface Non_hdl_cholesterol_calculatorInput {
  totalCholesterol: number;
  hdlCholesterol: number;
  triglycerides: number;
  calculateLdl: number;
  dataConfidence?: number;
}

export const Non_hdl_cholesterol_calculatorInputSchema = z.object({
  totalCholesterol: z.number().default(200),
  hdlCholesterol: z.number().default(50),
  triglycerides: z.number().default(150),
  calculateLdl: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Non_hdl_cholesterol_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalCholesterol - input.hdlCholesterol; results["nonHdlCholesterol"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nonHdlCholesterol"] = Number.NaN; }
  try { const v = input.calculateLdl * (input.totalCholesterol - input.hdlCholesterol - (input.triglycerides / 5)); results["ldlCholesterol"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ldlCholesterol"] = Number.NaN; }
  return results;
}


export function calculateNon_hdl_cholesterol_calculator(input: Non_hdl_cholesterol_calculatorInput): Non_hdl_cholesterol_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["nonHdlCholesterol"]);
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


export interface Non_hdl_cholesterol_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
