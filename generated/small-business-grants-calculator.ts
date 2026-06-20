// Auto-generated from small-business-grants-calculator-schema.json
import * as z from 'zod';

export interface Small_business_grants_calculatorInput {
  avgAnnualRevenue: number;
  numEmployees: number;
  projectCost: number;
  matchingFunds: number;
  isMinorityOwned: number;
  isWomanOwned: number;
  dataConfidence?: number;
}

export const Small_business_grants_calculatorInputSchema = z.object({
  avgAnnualRevenue: z.number().default(100000),
  numEmployees: z.number().default(10),
  projectCost: z.number().default(50000),
  matchingFunds: z.number().default(10000),
  isMinorityOwned: z.number().default(0),
  isWomanOwned: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Small_business_grants_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1; results["annual_exposure_hours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annual_exposure_hours"] = Number.NaN; }
  try { const v = input.numEmployees * 1 * 1 * input.projectCost; results["direct_labor_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["direct_labor_cost"] = Number.NaN; }
  try { const v = input.numEmployees * 1 * 1 * input.projectCost * input.avgAnnualRevenue; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateSmall_business_grants_calculator(input: Small_business_grants_calculatorInput): Small_business_grants_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Composite model — validate each cost leg against actuals","Physical exposure factors are normalized estimates"];
  const suggestedActions: string[] = ["Reconcile labor and maintenance legs separately","Benchmark noise/vibration factors with site measurement"];
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


export interface Small_business_grants_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
