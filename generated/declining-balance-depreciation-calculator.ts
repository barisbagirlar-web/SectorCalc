// Auto-generated from declining-balance-depreciation-calculator-schema.json
import * as z from 'zod';

export interface Declining_balance_depreciation_calculatorInput {
  cost: number;
  salvage: number;
  life: number;
  factor: number;
  year: number;
  dataConfidence?: number;
}

export const Declining_balance_depreciation_calculatorInputSchema = z.object({
  cost: z.number().default(10000),
  salvage: z.number().default(1000),
  life: z.number().default(5),
  factor: z.number().default(2),
  year: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Declining_balance_depreciation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.factor / input.life; results["rate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rate"] = 0; }
  try { const v = input.cost * (asFormulaNumber(results["rate"])) * (1 - (asFormulaNumber(results["rate"]))) ** (input.year - 1); results["depreciation"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["depreciation"] = 0; }
  try { const v = input.cost * (1 - (asFormulaNumber(results["rate"]))) ** (input.year - 1); results["bookValueBeginning"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bookValueBeginning"] = 0; }
  try { const v = input.cost - input.cost * (1 - (asFormulaNumber(results["rate"]))) ** input.year; results["accumulatedDepreciation"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["accumulatedDepreciation"] = 0; }
  try { const v = input.cost * (1 - (asFormulaNumber(results["rate"]))) ** input.year; results["endingBookValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["endingBookValue"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDeclining_balance_depreciation_calculator(input: Declining_balance_depreciation_calculatorInput): Declining_balance_depreciation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["depreciation"]);
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


export interface Declining_balance_depreciation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
