// Auto-generated from first-trimester-screening-calculator-schema.json
import * as z from 'zod';

export interface First_trimester_screening_calculatorInput {
  maternalAge: number;
  nuchalTranslucency: number;
  crownRumpLength: number;
  pappA: number;
  freeBetaHCG: number;
  dataConfidence?: number;
}

export const First_trimester_screening_calculatorInputSchema = z.object({
  maternalAge: z.number().default(30),
  nuchalTranslucency: z.number().default(1.5),
  crownRumpLength: z.number().default(65),
  pappA: z.number().default(1),
  freeBetaHCG: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: First_trimester_screening_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.maternalAge * input.nuchalTranslucency * input.crownRumpLength * input.pappA; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.maternalAge * input.nuchalTranslucency * input.crownRumpLength * input.pappA * (input.freeBetaHCG); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.freeBetaHCG; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFirst_trimester_screening_calculator(input: First_trimester_screening_calculatorInput): First_trimester_screening_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface First_trimester_screening_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
