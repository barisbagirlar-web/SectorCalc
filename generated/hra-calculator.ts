// Auto-generated from hra-calculator-schema.json
import * as z from 'zod';

export interface Hra_calculatorInput {
  basicSalary: number;
  da: number;
  hraReceived: number;
  rentPaid: number;
  cityType: number;
  dataConfidence?: number;
}

export const Hra_calculatorInputSchema = z.object({
  basicSalary: z.number().default(0),
  da: z.number().default(0),
  hraReceived: z.number().default(0),
  rentPaid: z.number().default(0),
  cityType: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hra_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.da * input.basicSalary; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.da * input.basicSalary; results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.da * input.basicSalary * 1 * (input.hraReceived); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.hraReceived; results["factor_hraReceived"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_hraReceived"] = Number.NaN; }
  return results;
}


export function calculateHra_calculator(input: Hra_calculatorInput): Hra_calculatorOutput {
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Hra_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
