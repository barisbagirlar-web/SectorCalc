// Auto-generated from 10k-calculator-schema.json
import * as z from 'zod';

export interface _10k_calculatorInput {
  units: number;
  cycleTime: number;
  OEE: number;
  machines: number;
  setupTime: number;
  shiftDuration: number;
  breaks: number;
  dataConfidence?: number;
}

export const _10k_calculatorInputSchema = z.object({
  units: z.number().default(10000),
  cycleTime: z.number().default(60),
  OEE: z.number().default(85),
  machines: z.number().default(1),
  setupTime: z.number().default(0.5),
  shiftDuration: z.number().default(8),
  breaks: z.number().default(0.5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: _10k_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cycleTime / (input.OEE / 100); results["effectiveCycle"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveCycle"] = 0; }
  try { const v = 3600 / (asFormulaNumber(results["effectiveCycle"])); results["unitsPerHour"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["unitsPerHour"] = 0; }
  try { const v = (input.units * input.cycleTime / 3600) / (input.OEE / 100) / input.machines; results["totalProcessingTimeHours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalProcessingTimeHours"] = 0; }
  try { const v = input.setupTime + (asFormulaNumber(results["totalProcessingTimeHours"])); results["totalTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalTime"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculate_10k_calculator(input: _10k_calculatorInput): _10k_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalTime"]));
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


export interface _10k_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
