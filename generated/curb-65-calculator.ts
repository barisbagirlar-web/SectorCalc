// Auto-generated from curb-65-calculator-schema.json
import * as z from 'zod';

export interface Curb_65_calculatorInput {
  age: number;
  confusion: number;
  urea: number;
  respiratoryRate: number;
  systolicBP: number;
  diastolicBP: number;
  dataConfidence?: number;
}

export const Curb_65_calculatorInputSchema = z.object({
  age: z.number().default(0),
  confusion: z.number().default(0),
  urea: z.number().default(0),
  respiratoryRate: z.number().default(0),
  systolicBP: z.number().default(0),
  diastolicBP: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Curb_65_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (toNumericFormulaValue(results["ageScore"])) + (toNumericFormulaValue(results["confusionScore"])) + (toNumericFormulaValue(results["ureaScore"])) + (toNumericFormulaValue(results["respiratoryScore"])) + (toNumericFormulaValue(results["bpScore"])); results["score"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["score"] = Number.NaN; }
  try { const v = (input.age >= 65) ? 1 : 0; results["ageScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ageScore"] = Number.NaN; }
  try { const v = (input.confusion === 1) ? 1 : 0; results["confusionScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["confusionScore"] = Number.NaN; }
  try { const v = (input.urea > 7) ? 1 : 0; results["ureaScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ureaScore"] = Number.NaN; }
  try { const v = (input.respiratoryRate >= 30) ? 1 : 0; results["respiratoryScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["respiratoryScore"] = Number.NaN; }
  try { const v = (input.systolicBP < 90 || input.diastolicBP <= 60) ? 1 : 0; results["bpScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bpScore"] = Number.NaN; }
  return results;
}


export function calculateCurb_65_calculator(input: Curb_65_calculatorInput): Curb_65_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["score"]);
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


export interface Curb_65_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
