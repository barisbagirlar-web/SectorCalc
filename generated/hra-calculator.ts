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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hra_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.da * input.basicSalary; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.da * input.basicSalary; results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.da * input.basicSalary * 1 * (input.hraReceived); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.hraReceived; results["factor_hraReceived"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_hraReceived"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHra_calculator(input: Hra_calculatorInput): Hra_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
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


export interface Hra_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
