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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cstr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.volumetricFlowRate * input.conversion / (input.rateConstant * (1 - input.conversion)); results["volume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volume"] = 0; }
  try { const v = input.conversion / (input.rateConstant * (1 - input.conversion)); results["residenceTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["residenceTime"] = 0; }
  try { const v = input.inletConcentration * (1 - input.conversion); results["outletConcentration"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["outletConcentration"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCstr_calculator(input: Cstr_calculatorInput): Cstr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["volume"]));
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


export interface Cstr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
