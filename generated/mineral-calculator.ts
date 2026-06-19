// Auto-generated from mineral-calculator-schema.json
import * as z from 'zod';

export interface Mineral_calculatorInput {
  ore_tonnage: number;
  ore_grade: number;
  recovery_rate: number;
  metal_price: number;
  processing_cost: number;
  dataConfidence?: number;
}

export const Mineral_calculatorInputSchema = z.object({
  ore_tonnage: z.number().default(1000),
  ore_grade: z.number().default(5),
  recovery_rate: z.number().default(90),
  metal_price: z.number().default(2000),
  processing_cost: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mineral_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ore_tonnage * (input.ore_grade / 100) * (input.recovery_rate / 100); results["metal_tonnage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["metal_tonnage"] = 0; }
  try { const v = (asFormulaNumber(results["metal_tonnage"])) * input.metal_price; results["revenue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["revenue"] = 0; }
  try { const v = input.ore_tonnage * input.processing_cost; results["total_processing_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_processing_cost"] = 0; }
  try { const v = (asFormulaNumber(results["revenue"])) - (asFormulaNumber(results["total_processing_cost"])); results["net_profit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["net_profit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMineral_calculator(input: Mineral_calculatorInput): Mineral_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["net_profit"]));
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


export interface Mineral_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
