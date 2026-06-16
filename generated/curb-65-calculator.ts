// Auto-generated from curb-65-calculator-schema.json
import * as z from 'zod';

export interface Curb_65_calculatorInput {
  age: number;
  confusion: number;
  urea: number;
  respiratoryRate: number;
  systolicBP: number;
  diastolicBP: number;
}

export const Curb_65_calculatorInputSchema = z.object({
  age: z.number().default(0),
  confusion: z.number().default(0),
  urea: z.number().default(0),
  respiratoryRate: z.number().default(0),
  systolicBP: z.number().default(0),
  diastolicBP: z.number().default(0),
});

function evaluateAllFormulas(input: Curb_65_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (results["ageScore"] ?? 0) + (results["confusionScore"] ?? 0) + (results["ureaScore"] ?? 0) + (results["respiratoryScore"] ?? 0) + (results["bpScore"] ?? 0); results["score"] = Number.isFinite(v) ? v : 0; } catch { results["score"] = 0; }
  try { const v = (input.age >= 65) ? 1 : 0; results["ageScore"] = Number.isFinite(v) ? v : 0; } catch { results["ageScore"] = 0; }
  try { const v = (input.confusion === 1) ? 1 : 0; results["confusionScore"] = Number.isFinite(v) ? v : 0; } catch { results["confusionScore"] = 0; }
  try { const v = (input.urea > 7) ? 1 : 0; results["ureaScore"] = Number.isFinite(v) ? v : 0; } catch { results["ureaScore"] = 0; }
  try { const v = (input.respiratoryRate >= 30) ? 1 : 0; results["respiratoryScore"] = Number.isFinite(v) ? v : 0; } catch { results["respiratoryScore"] = 0; }
  try { const v = (input.systolicBP < 90 || input.diastolicBP <= 60) ? 1 : 0; results["bpScore"] = Number.isFinite(v) ? v : 0; } catch { results["bpScore"] = 0; }
  return results;
}


export function calculateCurb_65_calculator(input: Curb_65_calculatorInput): Curb_65_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["score"] ?? 0;
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


export interface Curb_65_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
