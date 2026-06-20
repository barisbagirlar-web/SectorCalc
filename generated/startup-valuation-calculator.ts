// Auto-generated from startup-valuation-calculator-schema.json
import * as z from 'zod';

export interface Startup_valuation_calculatorInput {
  projectedRevenue: number;
  netProfitMargin: number;
  peRatio: number;
  requiredROI: number;
  investmentAmount: number;
  dataConfidence?: number;
}

export const Startup_valuation_calculatorInputSchema = z.object({
  projectedRevenue: z.number().default(10000000),
  netProfitMargin: z.number().default(15),
  peRatio: z.number().default(20),
  requiredROI: z.number().default(3),
  investmentAmount: z.number().default(1000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Startup_valuation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.projectedRevenue * (input.netProfitMargin / 100) * input.peRatio; results["exitValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["exitValue"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["exitValue"])) / input.requiredROI; results["postMoney"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["postMoney"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["postMoney"])) - input.investmentAmount; results["preMoney"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["preMoney"] = Number.NaN; }
  try { const v = (input.investmentAmount / (toNumericFormulaValue(results["postMoney"]))) * 100; results["ownershipPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ownershipPercent"] = Number.NaN; }
  return results;
}


export function calculateStartup_valuation_calculator(input: Startup_valuation_calculatorInput): Startup_valuation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ownershipPercent"]);
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


export interface Startup_valuation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
