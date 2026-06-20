// Auto-generated from otto-cycle-calculator-schema.json
import * as z from 'zod';

export interface Otto_cycle_calculatorInput {
  compressionRatio: number;
  specificHeatRatio: number;
  initialTemperature: number;
  initialPressure: number;
  maxTemperature: number;
  specificHeatCv: number;
  dataConfidence?: number;
}

export const Otto_cycle_calculatorInputSchema = z.object({
  compressionRatio: z.number().default(8),
  specificHeatRatio: z.number().default(1.4),
  initialTemperature: z.number().default(300),
  initialPressure: z.number().default(100),
  maxTemperature: z.number().default(2000),
  specificHeatCv: z.number().default(0.718),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Otto_cycle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.compressionRatio * input.specificHeatRatio * input.initialTemperature * input.initialPressure; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.compressionRatio * input.specificHeatRatio * input.initialTemperature * input.initialPressure * (input.maxTemperature * input.specificHeatCv); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.maxTemperature * input.specificHeatCv; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateOtto_cycle_calculator(input: Otto_cycle_calculatorInput): Otto_cycle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Otto_cycle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
