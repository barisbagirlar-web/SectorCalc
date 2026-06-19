// Auto-generated from kok-yaprak-grafik-calculator-schema.json
import * as z from 'zod';

export interface Kok_yaprak_grafik_calculatorInput {
  v1: number;
  v2: number;
  v3: number;
  v4: number;
  v5: number;
  v6: number;
  v7: number;
  v8: number;
  dataConfidence?: number;
}

export const Kok_yaprak_grafik_calculatorInputSchema = z.object({
  v1: z.number().default(55),
  v2: z.number().default(62),
  v3: z.number().default(68),
  v4: z.number().default(73),
  v5: z.number().default(78),
  v6: z.number().default(81),
  v7: z.number().default(89),
  v8: z.number().default(95),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Kok_yaprak_grafik_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.v1 * input.v2 * input.v3 * input.v4; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.v1 * input.v2 * input.v3 * input.v4 * (input.v5 * input.v6 * input.v7 * input.v8); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.v5 * input.v6 * input.v7 * input.v8; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateKok_yaprak_grafik_calculator(input: Kok_yaprak_grafik_calculatorInput): Kok_yaprak_grafik_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Kok_yaprak_grafik_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
