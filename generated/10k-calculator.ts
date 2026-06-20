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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: _10k_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cycleTime / (input.OEE / 100); results["effectiveCycle"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveCycle"] = Number.NaN; }
  try { const v = 3600 / (toNumericFormulaValue(results["effectiveCycle"])); results["unitsPerHour"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["unitsPerHour"] = Number.NaN; }
  try { const v = (input.units * input.cycleTime / 3600) / (input.OEE / 100) / input.machines; results["totalProcessingTimeHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalProcessingTimeHours"] = Number.NaN; }
  try { const v = input.setupTime + (toNumericFormulaValue(results["totalProcessingTimeHours"])); results["totalTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTime"] = Number.NaN; }
  return results;
}


export function calculate_10k_calculator(input: _10k_calculatorInput): _10k_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalTime"]);
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


export interface _10k_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
