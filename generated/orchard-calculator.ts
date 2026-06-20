// Auto-generated from orchard-calculator-schema.json
import * as z from 'zod';

export interface Orchard_calculatorInput {
  area: number;
  rowSpacing: number;
  treeSpacing: number;
  yieldPerTree: number;
  pricePerKg: number;
  annualCostPerTree: number;
  initialInvestment: number;
  dataConfidence?: number;
}

export const Orchard_calculatorInputSchema = z.object({
  area: z.number().default(10),
  rowSpacing: z.number().default(4),
  treeSpacing: z.number().default(3),
  yieldPerTree: z.number().default(50),
  pricePerKg: z.number().default(2),
  annualCostPerTree: z.number().default(15),
  initialInvestment: z.number().default(50000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Orchard_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10000 / (input.rowSpacing * input.treeSpacing); results["treesPerHa"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["treesPerHa"] = Number.NaN; }
  try { const v = input.area * (toNumericFormulaValue(results["treesPerHa"])); results["totalTrees"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTrees"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalTrees"])) * input.yieldPerTree; results["totalYield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalYield"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalYield"])) * input.pricePerKg; results["totalRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRevenue"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalTrees"])) * input.annualCostPerTree; results["annualCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalRevenue"])) - (toNumericFormulaValue(results["annualCost"])); results["annualProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualProfit"] = Number.NaN; }
  try { const v = input.initialInvestment / (toNumericFormulaValue(results["annualProfit"])); results["paybackPeriod"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paybackPeriod"] = Number.NaN; }
  return results;
}


export function calculateOrchard_calculator(input: Orchard_calculatorInput): Orchard_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["annualProfit"]);
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


export interface Orchard_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
