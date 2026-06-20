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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sofa_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.respScore + input.coagScore + input.liverScore + input.cvScore + input.cnsScore + input.renalScore; results["totalSOFA"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalSOFA"] = Number.NaN; }
  try { const v = input.respScore; results["respScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["respScore"] = Number.NaN; }
  try { const v = input.coagScore; results["coagScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["coagScore"] = Number.NaN; }
  try { const v = input.liverScore; results["liverScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["liverScore"] = Number.NaN; }
  try { const v = input.cvScore; results["cvScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cvScore"] = Number.NaN; }
  try { const v = input.cnsScore; results["cnsScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cnsScore"] = Number.NaN; }
  try { const v = input.renalScore; results["renalScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["renalScore"] = Number.NaN; }
  return results;
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
