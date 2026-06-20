// Auto-generated from child-pugh-score-calculator-schema.json
import * as z from 'zod';

export interface Child_pugh_score_calculatorInput {
  totalBilirubin: number;
  serumAlbumin: number;
  inr: number;
  ascites: number;
  encephalopathy: number;
  dataConfidence?: number;
}

export const Child_pugh_score_calculatorInputSchema = z.object({
  totalBilirubin: z.number().default(0.5),
  serumAlbumin: z.number().default(4),
  inr: z.number().default(1),
  ascites: z.number().default(0),
  encephalopathy: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Child_pugh_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalBilirubin < 2 ? 1 : (input.totalBilirubin <= 3 ? 2 : 3); results["bilirubinPoints"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bilirubinPoints"] = Number.NaN; }
  try { const v = input.serumAlbumin > 3.5 ? 1 : (input.serumAlbumin >= 2.8 ? 2 : 3); results["albuminPoints"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["albuminPoints"] = Number.NaN; }
  try { const v = input.inr < 1.7 ? 1 : (input.inr <= 2.3 ? 2 : 3); results["inrPoints"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["inrPoints"] = Number.NaN; }
  try { const v = input.ascites == 0 ? 1 : (input.ascites == 1 ? 2 : 3); results["ascitesPoints"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ascitesPoints"] = Number.NaN; }
  try { const v = input.encephalopathy == 0 ? 1 : (input.encephalopathy == 1 ? 2 : 3); results["encephalopathyPoints"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["encephalopathyPoints"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bilirubinPoints"])) + (toNumericFormulaValue(results["albuminPoints"])) + (toNumericFormulaValue(results["inrPoints"])) + (toNumericFormulaValue(results["ascitesPoints"])) + (toNumericFormulaValue(results["encephalopathyPoints"])); results["totalScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalScore"] = Number.NaN; }
  return results;
}


export function calculateChild_pugh_score_calculator(input: Child_pugh_score_calculatorInput): Child_pugh_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalScore"]);
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


export interface Child_pugh_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
