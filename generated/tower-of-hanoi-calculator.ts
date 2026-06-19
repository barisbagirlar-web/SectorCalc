// Auto-generated from tower-of-hanoi-calculator-schema.json
import * as z from 'zod';

export interface Tower_of_hanoi_calculatorInput {
  diskSayisi: number;
  manuelSure: number;
  otomatikSure: number;
  mod: number;
  dataConfidence?: number;
}

export const Tower_of_hanoi_calculatorInputSchema = z.object({
  diskSayisi: z.number().default(3),
  manuelSure: z.number().default(5),
  otomatikSure: z.number().default(1),
  mod: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Tower_of_hanoi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 ** input.diskSayisi - 1; results["moves"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["moves"] = 0; }
  try { const v = (asFormulaNumber(results["moves"])) * input.manuelSure; results["manuelToplamSure"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["manuelToplamSure"] = 0; }
  try { const v = (asFormulaNumber(results["moves"])) * input.otomatikSure; results["otomatikToplamSure"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["otomatikToplamSure"] = 0; }
  try { const v = (asFormulaNumber(results["manuelToplamSure"])) * (1 - input.mod) + (asFormulaNumber(results["otomatikToplamSure"])) * input.mod; results["totalSure"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalSure"] = 0; }
  try { const v = (asFormulaNumber(results["totalSure"])) / 60; results["totalSureMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalSureMinutes"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTower_of_hanoi_calculator(input: Tower_of_hanoi_calculatorInput): Tower_of_hanoi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["moves"]));
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


export interface Tower_of_hanoi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
