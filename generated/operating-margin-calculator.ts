// Auto-generated from operating-margin-calculator-schema.json
import * as z from 'zod';

export interface Operating_margin_calculatorInput {
  revenue: number;
  cogs: number;
  opex: number;
  otherIncome: number;
  dataConfidence?: number;
}

export const Operating_margin_calculatorInputSchema = z.object({
  revenue: z.number().default(500000),
  cogs: z.number().default(300000),
  opex: z.number().default(100000),
  otherIncome: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Operating_margin_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.revenue - input.cogs - input.opex + input.otherIncome; results["operatingIncome"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["operatingIncome"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["operatingIncome"])) / input.revenue) * 100; results["operatingMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["operatingMargin"] = Number.NaN; }
  return results;
}


export function calculateOperating_margin_calculator(input: Operating_margin_calculatorInput): Operating_margin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["operatingMargin"]);
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


export interface Operating_margin_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
