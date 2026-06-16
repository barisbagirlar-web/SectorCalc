// Auto-generated from cholesterol-ratio-calculator-schema.json
import * as z from 'zod';

export interface Cholesterol_ratio_calculatorInput {
  totalCholesterol: number;
  hdlCholesterol: number;
  ldlCholesterol: number;
  triglycerides: number;
}

export const Cholesterol_ratio_calculatorInputSchema = z.object({
  totalCholesterol: z.number().default(200),
  hdlCholesterol: z.number().default(50),
  ldlCholesterol: z.number().default(130),
  triglycerides: z.number().default(150),
});

function evaluateAllFormulas(input: Cholesterol_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalCholesterol / input.hdlCholesterol; results["totalToHdlRatio"] = Number.isFinite(v) ? v : 0; } catch { results["totalToHdlRatio"] = 0; }
  try { const v = input.ldlCholesterol / input.hdlCholesterol; results["ldlToHdlRatio"] = Number.isFinite(v) ? v : 0; } catch { results["ldlToHdlRatio"] = 0; }
  try { const v = input.triglycerides / input.hdlCholesterol; results["triglyceridesToHdlRatio"] = Number.isFinite(v) ? v : 0; } catch { results["triglyceridesToHdlRatio"] = 0; }
  try { const v = (input.totalCholesterol - input.hdlCholesterol) / input.hdlCholesterol; results["nonHdlToHdlRatio"] = Number.isFinite(v) ? v : 0; } catch { results["nonHdlToHdlRatio"] = 0; }
  return results;
}


export function calculateCholesterol_ratio_calculator(input: Cholesterol_ratio_calculatorInput): Cholesterol_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalToHdlRatio"] ?? 0;
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


export interface Cholesterol_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
