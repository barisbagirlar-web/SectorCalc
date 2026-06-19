// Auto-generated from atrial-fibrillation-risk-calculator-schema.json
import * as z from 'zod';

export interface Atrial_fibrillation_risk_calculatorInput {
  congestiveHeartFailure: number;
  hypertension: number;
  age: number;
  diabetes: number;
  priorStrokeOrTIA: number;
  vascularDisease: number;
  sex: number;
  dataConfidence?: number;
}

export const Atrial_fibrillation_risk_calculatorInputSchema = z.object({
  congestiveHeartFailure: z.number().default(0),
  hypertension: z.number().default(0),
  age: z.number().default(65),
  diabetes: z.number().default(0),
  priorStrokeOrTIA: z.number().default(0),
  vascularDisease: z.number().default(0),
  sex: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Atrial_fibrillation_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.congestiveHeartFailure; results["chfPoints"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["chfPoints"] = 0; }
  try { const v = input.hypertension; results["htnPoints"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["htnPoints"] = 0; }
  try { const v = input.age >= 75 ? 2 : (input.age >= 65 ? 1 : 0); results["agePoints"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["agePoints"] = 0; }
  try { const v = input.diabetes; results["dmPoints"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dmPoints"] = 0; }
  try { const v = input.priorStrokeOrTIA || input.vascularDisease ? 2 : 0; results["strokePoints"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["strokePoints"] = 0; }
  try { const v = input.sex; results["sexPoints"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sexPoints"] = 0; }
  try { const v = (asFormulaNumber(results["chfPoints"])) + (asFormulaNumber(results["htnPoints"])) + (asFormulaNumber(results["agePoints"])) + (asFormulaNumber(results["dmPoints"])) + (asFormulaNumber(results["strokePoints"])) + (asFormulaNumber(results["sexPoints"])); results["riskScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["riskScore"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAtrial_fibrillation_risk_calculator(input: Atrial_fibrillation_risk_calculatorInput): Atrial_fibrillation_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["riskScore"]));
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


export interface Atrial_fibrillation_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
