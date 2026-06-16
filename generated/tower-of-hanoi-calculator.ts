// Auto-generated from tower-of-hanoi-calculator-schema.json
import * as z from 'zod';

export interface Tower_of_hanoi_calculatorInput {
  diskSayisi: number;
  manuelSure: number;
  otomatikSure: number;
  mod: number;
}

export const Tower_of_hanoi_calculatorInputSchema = z.object({
  diskSayisi: z.number().default(3),
  manuelSure: z.number().default(5),
  otomatikSure: z.number().default(1),
  mod: z.number().default(0),
});

function evaluateAllFormulas(input: Tower_of_hanoi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 ** input.diskSayisi - 1; results["moves"] = Number.isFinite(v) ? v : 0; } catch { results["moves"] = 0; }
  try { const v = (results["moves"] ?? 0) * input.manuelSure; results["manuelToplamSure"] = Number.isFinite(v) ? v : 0; } catch { results["manuelToplamSure"] = 0; }
  try { const v = (results["moves"] ?? 0) * input.otomatikSure; results["otomatikToplamSure"] = Number.isFinite(v) ? v : 0; } catch { results["otomatikToplamSure"] = 0; }
  try { const v = (results["manuelToplamSure"] ?? 0) * (1 - input.mod) + (results["otomatikToplamSure"] ?? 0) * input.mod; results["totalSure"] = Number.isFinite(v) ? v : 0; } catch { results["totalSure"] = 0; }
  try { const v = (results["totalSure"] ?? 0) / 60; results["totalSureMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["totalSureMinutes"] = 0; }
  return results;
}


export function calculateTower_of_hanoi_calculator(input: Tower_of_hanoi_calculatorInput): Tower_of_hanoi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["moves"] ?? 0;
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


export interface Tower_of_hanoi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
