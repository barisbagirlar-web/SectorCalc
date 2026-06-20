// Auto-generated from break-even-safety-margin-calculator-schema.json
import * as z from 'zod';

export interface Break_even_safety_margin_calculatorInput {
  fixedCosts: number;
  variableCostPerUnit: number;
  sellingPricePerUnit: number;
  actualSalesVolume: number;
  capacityVolume: number;
  demandUncertainty: number;
  costEscalationRate: number;
  includeTax: boolean;
  dataConfidence?: number;
}

export const Break_even_safety_margin_calculatorInputSchema = z.object({
  fixedCosts: z.number().min(0).max(100000000).default(500000),
  variableCostPerUnit: z.number().min(0).max(10000).default(15),
  sellingPricePerUnit: z.number().min(0).max(100000).default(25),
  actualSalesVolume: z.number().min(0).max(10000000).default(80000),
  capacityVolume: z.number().min(0).max(20000000).default(120000),
  demandUncertainty: z.number().min(0).max(100).default(10),
  costEscalationRate: z.number().min(0).max(50).default(3),
  includeTax: z.boolean().default(false),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Break_even_safety_margin_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.actualSalesVolume * input.fixedCosts; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.actualSalesVolume * input.fixedCosts; results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.actualSalesVolume * input.fixedCosts * 1 * (input.variableCostPerUnit * input.sellingPricePerUnit); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.variableCostPerUnit; results["factor_variableCostPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_variableCostPerUnit"] = Number.NaN; }
  try { const v = input.sellingPricePerUnit; results["factor_sellingPricePerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_sellingPricePerUnit"] = Number.NaN; }
  return results;
}


export function calculateBreak_even_safety_margin_calculator(input: Break_even_safety_margin_calculatorInput): Break_even_safety_margin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Automated alerting"],
  };
}


export interface Break_even_safety_margin_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
