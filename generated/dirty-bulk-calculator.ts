// Auto-generated from dirty-bulk-calculator-schema.json
import * as z from 'zod';

export interface Dirty_bulk_calculatorInput {
  weight: number;
  distance: number;
  ratePerTonKm: number;
  cleaningSurchargePercent: number;
  demurrageRiskFactor: number;
  demurrageRate: number;
  dataConfidence?: number;
}

export const Dirty_bulk_calculatorInputSchema = z.object({
  weight: z.number().default(1000),
  distance: z.number().default(500),
  ratePerTonKm: z.number().default(0.05),
  cleaningSurchargePercent: z.number().default(15),
  demurrageRiskFactor: z.number().default(2),
  demurrageRate: z.number().default(5000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dirty_bulk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * input.distance * input.ratePerTonKm; results["baseCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseCost"])) * (input.cleaningSurchargePercent / 100); results["cleaningSurcharge"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cleaningSurcharge"] = Number.NaN; }
  try { const v = input.demurrageRiskFactor * input.demurrageRate; results["demurrageCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["demurrageCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseCost"])) + (toNumericFormulaValue(results["cleaningSurcharge"])) + (toNumericFormulaValue(results["demurrageCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCost"])) / input.weight; results["costPerTon"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerTon"] = Number.NaN; }
  return results;
}


export function calculateDirty_bulk_calculator(input: Dirty_bulk_calculatorInput): Dirty_bulk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Dirty_bulk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
