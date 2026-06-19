// Auto-generated from cholesterol-ratio-calculator-schema.json
import * as z from 'zod';

export interface Cholesterol_ratio_calculatorInput {
  totalCholesterol: number;
  hdlCholesterol: number;
  ldlCholesterol: number;
  triglycerides: number;
  dataConfidence?: number;
}

export const Cholesterol_ratio_calculatorInputSchema = z.object({
  totalCholesterol: z.number().default(200),
  hdlCholesterol: z.number().default(50),
  ldlCholesterol: z.number().default(130),
  triglycerides: z.number().default(150),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cholesterol_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalCholesterol / input.hdlCholesterol; results["totalToHdlRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalToHdlRatio"] = 0; }
  try { const v = input.ldlCholesterol / input.hdlCholesterol; results["ldlToHdlRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ldlToHdlRatio"] = 0; }
  try { const v = input.triglycerides / input.hdlCholesterol; results["triglyceridesToHdlRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["triglyceridesToHdlRatio"] = 0; }
  try { const v = (input.totalCholesterol - input.hdlCholesterol) / input.hdlCholesterol; results["nonHdlToHdlRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["nonHdlToHdlRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCholesterol_ratio_calculator(input: Cholesterol_ratio_calculatorInput): Cholesterol_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalToHdlRatio"]));
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


export interface Cholesterol_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
