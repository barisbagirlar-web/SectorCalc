// Auto-generated from compost-calculator-schema.json
import * as z from 'zod';

export interface Compost_calculatorInput {
  greenWeight: number;
  greenC: number;
  greenN: number;
  brownWeight: number;
  brownC: number;
  brownN: number;
  dataConfidence?: number;
}

export const Compost_calculatorInputSchema = z.object({
  greenWeight: z.number().default(10),
  greenC: z.number().default(15),
  greenN: z.number().default(1.5),
  brownWeight: z.number().default(10),
  brownC: z.number().default(50),
  brownN: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Compost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.greenWeight * input.greenC / 100 + input.brownWeight * input.brownC / 100; results["totalCarbon"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCarbon"] = Number.NaN; }
  try { const v = input.greenWeight * input.greenN / 100 + input.brownWeight * input.brownN / 100; results["totalNitrogen"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalNitrogen"] = Number.NaN; }
  try { const v = input.greenWeight + input.brownWeight; results["totalWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWeight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCarbon"])) / (toNumericFormulaValue(results["totalNitrogen"])); results["resultingCNRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["resultingCNRatio"] = Number.NaN; }
  return results;
}


export function calculateCompost_calculator(input: Compost_calculatorInput): Compost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["resultingCNRatio"]);
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


export interface Compost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
