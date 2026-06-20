// Auto-generated from net-worth-calculator-schema.json
import * as z from 'zod';

export interface Net_worth_calculatorInput {
  cash: number;
  investments: number;
  realEstate: number;
  personalProperty: number;
  otherAssets: number;
  currentDebt: number;
  longTermDebt: number;
  otherDebt: number;
  dataConfidence?: number;
}

export const Net_worth_calculatorInputSchema = z.object({
  cash: z.number().default(0),
  investments: z.number().default(0),
  realEstate: z.number().default(0),
  personalProperty: z.number().default(0),
  otherAssets: z.number().default(0),
  currentDebt: z.number().default(0),
  longTermDebt: z.number().default(0),
  otherDebt: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Net_worth_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cash + input.investments + input.realEstate + input.personalProperty + input.otherAssets; results["totalAssets"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalAssets"] = Number.NaN; }
  try { const v = input.currentDebt + input.longTermDebt + input.otherDebt; results["totalDebt"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDebt"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalAssets"])) - (toNumericFormulaValue(results["totalDebt"])); results["netWorth"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netWorth"] = Number.NaN; }
  return results;
}


export function calculateNet_worth_calculator(input: Net_worth_calculatorInput): Net_worth_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netWorth"]);
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


export interface Net_worth_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
