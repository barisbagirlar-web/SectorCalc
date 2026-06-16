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

function evaluateAllFormulas(input: _10k_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cycleTime / (input.OEE / 100); results["effectiveCycle"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveCycle"] = 0; }
  try { const v = 3600 / (results["effectiveCycle"] ?? 0); results["unitsPerHour"] = Number.isFinite(v) ? v : 0; } catch { results["unitsPerHour"] = 0; }
  try { const v = (input.units * input.cycleTime / 3600) / (input.OEE / 100) / input.machines; results["totalProcessingTimeHours"] = Number.isFinite(v) ? v : 0; } catch { results["totalProcessingTimeHours"] = 0; }
  try { const v = input.setupTime + (results["totalProcessingTimeHours"] ?? 0); results["totalTime"] = Number.isFinite(v) ? v : 0; } catch { results["totalTime"] = 0; }
  try { const v = Math.ceil((results["totalTime"] ?? 0) / (input.shiftDuration - input.breaks)); results["shiftsRequired"] = Number.isFinite(v) ? v : 0; } catch { results["shiftsRequired"] = 0; }
  return results;
}


export function calculate_10k_calculator(input: _10k_calculatorInput): _10k_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalTime"] ?? 0;
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


export interface _10k_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
