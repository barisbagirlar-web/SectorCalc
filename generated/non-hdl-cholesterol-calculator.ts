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

function evaluateAllFormulas(input: Non_hdl_cholesterol_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalCholesterol - input.hdlCholesterol; results["nonHdlCholesterol"] = Number.isFinite(v) ? v : 0; } catch { results["nonHdlCholesterol"] = 0; }
  try { const v = input.calculateLdl * (input.totalCholesterol - input.hdlCholesterol - (input.triglycerides / 5)); results["ldlCholesterol"] = Number.isFinite(v) ? v : 0; } catch { results["ldlCholesterol"] = 0; }
  return results;
}


export function calculateNon_hdl_cholesterol_calculator(input: Non_hdl_cholesterol_calculatorInput): Non_hdl_cholesterol_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["nonHdlCholesterol"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
