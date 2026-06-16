// Auto-generated from sewing-calculator-schema.json
import * as z from 'zod';

export interface Sewing_calculatorInput {
  stitchLength: number;
  seamLength: number;
  sewingSpeed: number;
  threadConsumptionFactor: number;
  laborCostPerHour: number;
  machineCostPerHour: number;
}

export const Sewing_calculatorInputSchema = z.object({
  stitchLength: z.number().default(2.5),
  seamLength: z.number().default(100),
  sewingSpeed: z.number().default(1000),
  threadConsumptionFactor: z.number().default(2.5),
  laborCostPerHour: z.number().default(15),
  machineCostPerHour: z.number().default(5),
});

function evaluateAllFormulas(input: Sewing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.seamLength * 10 / input.stitchLength; results["totalStitches"] = Number.isFinite(v) ? v : 0; } catch { results["totalStitches"] = 0; }
  try { const v = (results["totalStitches"] ?? 0) / input.sewingSpeed; results["sewingTimeMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["sewingTimeMinutes"] = 0; }
  try { const v = (results["sewingTimeMinutes"] ?? 0) / 60; results["sewingTimeHours"] = Number.isFinite(v) ? v : 0; } catch { results["sewingTimeHours"] = 0; }
  try { const v = input.seamLength / 100 * input.threadConsumptionFactor; results["threadLengthMeters"] = Number.isFinite(v) ? v : 0; } catch { results["threadLengthMeters"] = 0; }
  try { const v = (results["sewingTimeHours"] ?? 0) * input.laborCostPerHour; results["laborCost"] = Number.isFinite(v) ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = (results["sewingTimeHours"] ?? 0) * input.machineCostPerHour; results["machineCost"] = Number.isFinite(v) ? v : 0; } catch { results["machineCost"] = 0; }
  try { const v = (results["laborCost"] ?? 0) + (results["machineCost"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateSewing_calculator(input: Sewing_calculatorInput): Sewing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
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


export interface Sewing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
