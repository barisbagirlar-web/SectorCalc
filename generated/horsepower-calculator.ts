// Auto-generated from horsepower-calculator-schema.json
import * as z from 'zod';

export interface Horsepower_calculatorInput {
  voltage: number;
  current: number;
  efficiency: number;
  powerFactor: number;
  phaseFactor: number;
  dataConfidence?: number;
}

export const Horsepower_calculatorInputSchema = z.object({
  voltage: z.number().default(400),
  current: z.number().default(10),
  efficiency: z.number().default(0.9),
  powerFactor: z.number().default(0.85),
  phaseFactor: z.number().default(1.732),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Horsepower_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.voltage * input.current * input.efficiency * input.powerFactor * input.phaseFactor) / 746; results["hp"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hp"] = Number.NaN; }
  try { const v = input.voltage * input.current * input.phaseFactor; results["inputPowerVA"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["inputPowerVA"] = Number.NaN; }
  try { const v = input.voltage * input.current * input.powerFactor * input.phaseFactor; results["actualPowerW"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actualPowerW"] = Number.NaN; }
  try { const v = ((input.voltage * input.current * input.efficiency * input.powerFactor * input.phaseFactor) / 746) * 0.7457; results["kw"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["kw"] = Number.NaN; }
  return results;
}


export function calculateHorsepower_calculator(input: Horsepower_calculatorInput): Horsepower_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["hp"]);
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


export interface Horsepower_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
