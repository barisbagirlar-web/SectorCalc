// @ts-nocheck
// Auto-generated from trisomy-21-risk-calculator-schema.json
import * as z from 'zod';

export interface Trisomy_21_risk_calculatorInput {
  maternalAge: number;
  gestationalAge: number;
  nuchalTranslucency: number;
  pappA: number;
  freeBetaHCG: number;
  previousTrisomy: number;
}

export const Trisomy_21_risk_calculatorInputSchema = z.object({
  maternalAge: z.number().default(30),
  gestationalAge: z.number().default(12),
  nuchalTranslucency: z.number().default(1.5),
  pappA: z.number().default(1),
  freeBetaHCG: z.number().default(1),
  previousTrisomy: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Trisomy_21_risk_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.maternalAge + input.gestationalAge + input.nuchalTranslucency; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.maternalAge + input.gestationalAge + input.nuchalTranslucency; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTrisomy_21_risk_calculator(input: Trisomy_21_risk_calculatorInput): Trisomy_21_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Trisomy_21_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
