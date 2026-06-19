// Auto-generated from sofa-score-calculator-schema.json
import * as z from 'zod';

export interface Sofa_score_calculatorInput {
  respScore: number;
  coagScore: number;
  liverScore: number;
  cvScore: number;
  cnsScore: number;
  renalScore: number;
  dataConfidence?: number;
}

export const Sofa_score_calculatorInputSchema = z.object({
  respScore: z.number().default(0),
  coagScore: z.number().default(0),
  liverScore: z.number().default(0),
  cvScore: z.number().default(0),
  cnsScore: z.number().default(0),
  renalScore: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sofa_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.respScore + input.coagScore + input.liverScore + input.cvScore + input.cnsScore + input.renalScore; results["totalSOFA"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalSOFA"] = 0; }
  try { const v = input.respScore; results["respScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["respScore"] = 0; }
  try { const v = input.coagScore; results["coagScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["coagScore"] = 0; }
  try { const v = input.liverScore; results["liverScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["liverScore"] = 0; }
  try { const v = input.cvScore; results["cvScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cvScore"] = 0; }
  try { const v = input.cnsScore; results["cnsScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cnsScore"] = 0; }
  try { const v = input.renalScore; results["renalScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["renalScore"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSofa_score_calculator(input: Sofa_score_calculatorInput): Sofa_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalSOFA"]);
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


export interface Sofa_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
