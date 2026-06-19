// Auto-generated from convergent-divergent-nozzle-calculator-schema.json
import * as z from 'zod';

export interface Convergent_divergent_nozzle_calculatorInput {
  totalPressure: number;
  totalTemperature: number;
  throatArea: number;
  exitArea: number;
  gasConstant: number;
  specificHeatRatio: number;
  ambientPressure: number;
  dataConfidence?: number;
}

export const Convergent_divergent_nozzle_calculatorInputSchema = z.object({
  totalPressure: z.number().default(500000),
  totalTemperature: z.number().default(300),
  throatArea: z.number().default(0.001),
  exitArea: z.number().default(0.005),
  gasConstant: z.number().default(287),
  specificHeatRatio: z.number().default(1.4),
  ambientPressure: z.number().default(101325),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Convergent_divergent_nozzle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalPressure * input.totalTemperature * input.throatArea * input.exitArea; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.totalPressure * input.totalTemperature * input.throatArea * input.exitArea * (input.gasConstant * input.specificHeatRatio * input.ambientPressure); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.gasConstant * input.specificHeatRatio * input.ambientPressure; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateConvergent_divergent_nozzle_calculator(input: Convergent_divergent_nozzle_calculatorInput): Convergent_divergent_nozzle_calculatorOutput {
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


export interface Convergent_divergent_nozzle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
