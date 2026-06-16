// Auto-generated from child-pugh-score-calculator-schema.json
import * as z from 'zod';

export interface Child_pugh_score_calculatorInput {
  totalBilirubin: number;
  serumAlbumin: number;
  inr: number;
  ascites: number;
  encephalopathy: number;
}

export const Child_pugh_score_calculatorInputSchema = z.object({
  totalBilirubin: z.number().default(0.5),
  serumAlbumin: z.number().default(4),
  inr: z.number().default(1),
  ascites: z.number().default(0),
  encephalopathy: z.number().default(0),
});

function evaluateAllFormulas(input: Child_pugh_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalBilirubin < 2 ? 1 : (input.totalBilirubin <= 3 ? 2 : 3); results["bilirubinPoints"] = Number.isFinite(v) ? v : 0; } catch { results["bilirubinPoints"] = 0; }
  try { const v = input.serumAlbumin > 3.5 ? 1 : (input.serumAlbumin >= 2.8 ? 2 : 3); results["albuminPoints"] = Number.isFinite(v) ? v : 0; } catch { results["albuminPoints"] = 0; }
  try { const v = input.inr < 1.7 ? 1 : (input.inr <= 2.3 ? 2 : 3); results["inrPoints"] = Number.isFinite(v) ? v : 0; } catch { results["inrPoints"] = 0; }
  try { const v = input.ascites + 1; results["ascitesPoints"] = Number.isFinite(v) ? v : 0; } catch { results["ascitesPoints"] = 0; }
  try { const v = input.encephalopathy + 1; results["encephalopathyPoints"] = Number.isFinite(v) ? v : 0; } catch { results["encephalopathyPoints"] = 0; }
  try { const v = (results["bilirubinPoints"] ?? 0) + (results["albuminPoints"] ?? 0) + (results["inrPoints"] ?? 0) + (results["ascitesPoints"] ?? 0) + (results["encephalopathyPoints"] ?? 0); results["totalScore"] = Number.isFinite(v) ? v : 0; } catch { results["totalScore"] = 0; }
  try { const v = (results["totalScore"] ?? 0) <= 6 ? 'A' : ((results["totalScore"] ?? 0) <= 9 ? 'B' : 'C'); results["childPughClass"] = Number.isFinite(v) ? v : 0; } catch { results["childPughClass"] = 0; }
  return results;
}


export function calculateChild_pugh_score_calculator(input: Child_pugh_score_calculatorInput): Child_pugh_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalScore"] ?? 0;
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


export interface Child_pugh_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
