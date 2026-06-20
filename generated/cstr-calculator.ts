// Auto-generated from cstr-calculator-schema.json
import * as z from 'zod';

export interface Cstr_calculatorInput {
  volumetricFlowRate: number;
  inletConcentration: number;
  rateConstant: number;
  conversion: number;
  dataConfidence?: number;
}

export const Cstr_calculatorInputSchema = z.object({
  volumetricFlowRate: z.number().default(10),
  inletConcentration: z.number().default(1),
  rateConstant: z.number().default(0.1),
  conversion: z.number().default(0.8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cstr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.volumetricFlowRate * input.conversion / (input.rateConstant * (1 - input.conversion)); results["volume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volume"] = Number.NaN; }
  try { const v = input.conversion / (input.rateConstant * (1 - input.conversion)); results["residenceTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["residenceTime"] = Number.NaN; }
  try { const v = input.inletConcentration * (1 - input.conversion); results["outletConcentration"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["outletConcentration"] = Number.NaN; }
  return results;
}


export function calculateCstr_calculator(input: Cstr_calculatorInput): Cstr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["volume"]);
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


export interface Cstr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
