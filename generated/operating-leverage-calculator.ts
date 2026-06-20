// Auto-generated from operating-leverage-calculator-schema.json
import * as z from 'zod';

export interface Operating_leverage_calculatorInput {
  salesVolume: number;
  pricePerUnit: number;
  variableCostPerUnit: number;
  fixedCosts: number;
  dataConfidence?: number;
}

export const Operating_leverage_calculatorInputSchema = z.object({
  salesVolume: z.number().default(1000),
  pricePerUnit: z.number().default(50),
  variableCostPerUnit: z.number().default(30),
  fixedCosts: z.number().default(10000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Operating_leverage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.salesVolume * (input.pricePerUnit - input.variableCostPerUnit); results["contributionMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["contributionMargin"] = Number.NaN; }
  try { const v = input.salesVolume * (input.pricePerUnit - input.variableCostPerUnit) - input.fixedCosts; results["netOperatingIncome"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netOperatingIncome"] = Number.NaN; }
  try { const v = (input.salesVolume * (input.pricePerUnit - input.variableCostPerUnit)) / (input.salesVolume * (input.pricePerUnit - input.variableCostPerUnit) - input.fixedCosts); results["operatingLeverage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["operatingLeverage"] = Number.NaN; }
  return results;
}


export function calculateOperating_leverage_calculator(input: Operating_leverage_calculatorInput): Operating_leverage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["operatingLeverage"]);
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


export interface Operating_leverage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
