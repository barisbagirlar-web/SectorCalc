// Auto-generated from pumpkin-yield-calculator-schema.json
import * as z from 'zod';

export interface Pumpkin_yield_calculatorInput {
  fieldArea: number;
  plantDensity: number;
  pumpkinsPerPlant: number;
  avgWeight: number;
  lossRate: number;
  dataConfidence?: number;
}

export const Pumpkin_yield_calculatorInputSchema = z.object({
  fieldArea: z.number().default(1000),
  plantDensity: z.number().default(0.5),
  pumpkinsPerPlant: z.number().default(1.5),
  avgWeight: z.number().default(5),
  lossRate: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pumpkin_yield_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fieldArea * input.plantDensity * input.pumpkinsPerPlant; results["totalPumpkins"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalPumpkins"] = 0; }
  try { const v = (asFormulaNumber(results["totalPumpkins"])) * (input.lossRate / 100); results["lossPumpkins"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["lossPumpkins"] = 0; }
  try { const v = (asFormulaNumber(results["totalPumpkins"])) - (asFormulaNumber(results["lossPumpkins"])); results["netPumpkins"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netPumpkins"] = 0; }
  try { const v = (asFormulaNumber(results["netPumpkins"])) * input.avgWeight; results["totalYield"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalYield"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePumpkin_yield_calculator(input: Pumpkin_yield_calculatorInput): Pumpkin_yield_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalYield"]);
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


export interface Pumpkin_yield_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
