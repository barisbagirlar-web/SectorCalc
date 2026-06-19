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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Compost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.greenWeight * input.greenC / 100 + input.brownWeight * input.brownC / 100; results["totalCarbon"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCarbon"] = 0; }
  try { const v = input.greenWeight * input.greenN / 100 + input.brownWeight * input.brownN / 100; results["totalNitrogen"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalNitrogen"] = 0; }
  try { const v = input.greenWeight + input.brownWeight; results["totalWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = (asFormulaNumber(results["totalCarbon"])) / (asFormulaNumber(results["totalNitrogen"])); results["resultingCNRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["resultingCNRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCompost_calculator(input: Compost_calculatorInput): Compost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["resultingCNRatio"]));
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


export interface Compost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
