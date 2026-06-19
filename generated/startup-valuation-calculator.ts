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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Startup_valuation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.projectedRevenue * (input.netProfitMargin / 100) * input.peRatio; results["exitValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["exitValue"] = 0; }
  try { const v = (asFormulaNumber(results["exitValue"])) / input.requiredROI; results["postMoney"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["postMoney"] = 0; }
  try { const v = (asFormulaNumber(results["postMoney"])) - input.investmentAmount; results["preMoney"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["preMoney"] = 0; }
  try { const v = (input.investmentAmount / (asFormulaNumber(results["postMoney"]))) * 100; results["ownershipPercent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ownershipPercent"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
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
