// Auto-generated from equestrian-calculator-schema.json
import * as z from 'zod';

export interface Equestrian_calculatorInput {
  load_mass: number;
  slope_percent: number;
  rolling_resistance: number;
  desired_speed: number;
  horse_pull_force: number;
  efficiency: number;
  dataConfidence?: number;
}

export const Equestrian_calculatorInputSchema = z.object({
  load_mass: z.number().default(1000),
  slope_percent: z.number().default(5),
  rolling_resistance: z.number().default(0.02),
  desired_speed: z.number().default(1.5),
  horse_pull_force: z.number().default(1000),
  efficiency: z.number().default(85),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Equestrian_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.load_mass * (input.slope_percent / 100) * input.rolling_resistance * input.desired_speed; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.load_mass * (input.slope_percent / 100) * input.rolling_resistance * input.desired_speed * (input.horse_pull_force * (input.efficiency / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.horse_pull_force * (input.efficiency / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEquestrian_calculator(input: Equestrian_calculatorInput): Equestrian_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Equestrian_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
