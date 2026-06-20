// Auto-generated from abv-calculator-schema.json
import * as z from 'zod';

export interface Abv_calculatorInput {
  og: number;
  fg: number;
  auto_input_3: number;
  dataConfidence?: number;
}

export const Abv_calculatorInputSchema = z.object({
  og: z.number().default(1.05),
  fg: z.number().default(1.01),
  auto_input_3: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Abv_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.og - input.fg; results["gravityPointsDrop"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gravityPointsDrop"] = Number.NaN; }
  try { const v = (input.og - input.fg) * 131.25; results["abv"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["abv"] = Number.NaN; }
  try { const v = input.og; results["og"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["og"] = Number.NaN; }
  try { const v = input.fg; results["fg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fg"] = Number.NaN; }
  return results;
}


export function calculateAbv_calculator(input: Abv_calculatorInput): Abv_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["abv"]);
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


export interface Abv_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
