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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tower_of_hanoi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 ** input.diskSayisi - 1; results["moves"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["moves"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["moves"])) * input.manuelSure; results["manuelToplamSure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["manuelToplamSure"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["moves"])) * input.otomatikSure; results["otomatikToplamSure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["otomatikToplamSure"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["manuelToplamSure"])) * (1 - input.mod) + (toNumericFormulaValue(results["otomatikToplamSure"])) * input.mod; results["totalSure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalSure"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalSure"])) / 60; results["totalSureMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalSureMinutes"] = Number.NaN; }
  return results;
}


export function calculateTower_of_hanoi_calculator(input: Tower_of_hanoi_calculatorInput): Tower_of_hanoi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["moves"]);
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


export interface Tower_of_hanoi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
