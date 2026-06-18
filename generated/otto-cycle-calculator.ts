// @ts-nocheck
// Auto-generated from otto-cycle-calculator-schema.json
import * as z from 'zod';

export interface Otto_cycle_calculatorInput {
  compressionRatio: number;
  specificHeatRatio: number;
  initialTemperature: number;
  initialPressure: number;
  maxTemperature: number;
  specificHeatCv: number;
}

export const Otto_cycle_calculatorInputSchema = z.object({
  compressionRatio: z.number().default(8),
  specificHeatRatio: z.number().default(1.4),
  initialTemperature: z.number().default(300),
  initialPressure: z.number().default(100),
  maxTemperature: z.number().default(2000),
  specificHeatCv: z.number().default(0.718),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Otto_cycle_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.compressionRatio * input.specificHeatRatio * input.initialTemperature * input.initialPressure; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.compressionRatio * input.specificHeatRatio * input.initialTemperature * input.initialPressure * (input.maxTemperature * input.specificHeatCv); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.maxTemperature * input.specificHeatCv; results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateOtto_cycle_calculator(input: Otto_cycle_calculatorInput): Otto_cycle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
