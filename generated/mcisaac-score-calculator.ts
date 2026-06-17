// @ts-nocheck
// Auto-generated from mcisaac-score-calculator-schema.json
import * as z from 'zod';

export interface Mcisaac_score_calculatorInput {
  age: number;
  exudate: number;
  tenderLymph: number;
  feverTemp: number;
  cough: number;
}

export const Mcisaac_score_calculatorInputSchema = z.object({
  age: z.number().default(30),
  exudate: z.number().default(0),
  tenderLymph: z.number().default(0),
  feverTemp: z.number().default(37),
  cough: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mcisaac_score_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (asFormulaNumber(results["agePoints"])) + (asFormulaNumber(results["exudatePoints"])) + (asFormulaNumber(results["tenderLymphPoints"])) + (asFormulaNumber(results["feverPoints"])) + (asFormulaNumber(results["coughPoints"])); results["score"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["score"] = 0; }
  try { const v = (input.age >= 3 && input.age <= 14) ? 1 : 0; results["agePoints"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["agePoints"] = 0; }
  try { const v = input.exudate; results["exudatePoints"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["exudatePoints"] = 0; }
  try { const v = input.tenderLymph; results["tenderLymphPoints"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["tenderLymphPoints"] = 0; }
  try { const v = input.feverTemp > 38 ? 1 : 0; results["feverPoints"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["feverPoints"] = 0; }
  try { const v = input.cough ? 0 : 1; results["coughPoints"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["coughPoints"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMcisaac_score_calculator(input: Mcisaac_score_calculatorInput): Mcisaac_score_calculatorOutput {
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


export interface Mcisaac_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
