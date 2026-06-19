// Auto-generated from steam-move-calculator-schema.json
import * as z from 'zod';

export interface Steam_move_calculatorInput {
  massFlow: number;
  diameter: number;
  pressure: number;
  temperature: number;
  dataConfidence?: number;
}

export const Steam_move_calculatorInputSchema = z.object({
  massFlow: z.number().default(1000),
  diameter: z.number().default(50),
  pressure: z.number().default(10),
  temperature: z.number().default(200),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Steam_move_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.pressure * 1e5) / (461.5 * (input.temperature + 273.15)); results["steamDensity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["steamDensity"] = 0; }
  try { const v = (input.massFlow / 3600) / (asFormulaNumber(results["steamDensity"])); results["volFlow"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volFlow"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSteam_move_calculator(input: Steam_move_calculatorInput): Steam_move_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["volFlow"]);
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


export interface Steam_move_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
