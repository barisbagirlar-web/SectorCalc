// Auto-generated from horsepower-calculator-schema.json
import * as z from 'zod';

export interface Horsepower_calculatorInput {
  voltage: number;
  current: number;
  efficiency: number;
  powerFactor: number;
  phaseFactor: number;
}

export const Horsepower_calculatorInputSchema = z.object({
  voltage: z.number().default(400),
  current: z.number().default(10),
  efficiency: z.number().default(0.9),
  powerFactor: z.number().default(0.85),
  phaseFactor: z.number().default(1.732),
});

function evaluateAllFormulas(input: Horsepower_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.voltage * input.current * input.efficiency * input.powerFactor * input.phaseFactor) / 746; results["hp"] = Number.isFinite(v) ? v : 0; } catch { results["hp"] = 0; }
  try { const v = input.voltage * input.current * input.phaseFactor; results["inputPowerVA"] = Number.isFinite(v) ? v : 0; } catch { results["inputPowerVA"] = 0; }
  try { const v = input.voltage * input.current * input.powerFactor * input.phaseFactor; results["actualPowerW"] = Number.isFinite(v) ? v : 0; } catch { results["actualPowerW"] = 0; }
  try { const v = ((input.voltage * input.current * input.efficiency * input.powerFactor * input.phaseFactor) / 746) * 0.7457; results["kw"] = Number.isFinite(v) ? v : 0; } catch { results["kw"] = 0; }
  return results;
}


export function calculateHorsepower_calculator(input: Horsepower_calculatorInput): Horsepower_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["hp"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Horsepower_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
