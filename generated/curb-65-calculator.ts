// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Curb_65_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (asFormulaNumber(results["ageScore"])) + (asFormulaNumber(results["confusionScore"])) + (asFormulaNumber(results["ureaScore"])) + (asFormulaNumber(results["respiratoryScore"])) + (asFormulaNumber(results["bpScore"])); results["score"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["score"] = 0; }
  try { const v = (input.age >= 65) ? 1 : 0; results["ageScore"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ageScore"] = 0; }
  try { const v = (input.confusion === 1) ? 1 : 0; results["confusionScore"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["confusionScore"] = 0; }
  try { const v = (input.urea > 7) ? 1 : 0; results["ureaScore"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ureaScore"] = 0; }
  try { const v = (input.respiratoryRate >= 30) ? 1 : 0; results["respiratoryScore"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["respiratoryScore"] = 0; }
  try { const v = (input.systolicBP < 90 || input.diastolicBP <= 60) ? 1 : 0; results["bpScore"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["bpScore"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCurb_65_calculator(input: Curb_65_calculatorInput): Curb_65_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["score"]);
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


export interface Curb_65_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
