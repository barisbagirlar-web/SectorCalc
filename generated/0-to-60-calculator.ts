// Auto-generated from 0-to-60-calculator-schema.json
import * as z from 'zod';

export interface _0_to_60_calculatorInput {
  mass: number;
  power: number;
  efficiency: number;
  speed: number;
  dataConfidence?: number;
}

export const _0_to_60_calculatorInputSchema = z.object({
  mass: z.number().default(1500),
  power: z.number().default(200),
  efficiency: z.number().default(0.85),
  speed: z.number().default(60),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: _0_to_60_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.speed * 0.44704; results["speed_mps"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["speed_mps"] = 0; }
  try { const v = input.power * 745.7; results["power_watts"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["power_watts"] = 0; }
  try { const v = (asFormulaNumber(results["power_watts"])) * input.efficiency; results["effective_power"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effective_power"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculate_0_to_60_calculator(input: _0_to_60_calculatorInput): _0_to_60_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["effective_power"]));
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


export interface _0_to_60_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
