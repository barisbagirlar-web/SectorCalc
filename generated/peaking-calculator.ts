// Auto-generated from peaking-calculator-schema.json
import * as z from 'zod';

export interface Peaking_calculatorInput {
  peakDemand: number;
  offPeakDemand: number;
  peakHours: number;
  offPeakHours: number;
  peakRate: number;
  offPeakRate: number;
}

export const Peaking_calculatorInputSchema = z.object({
  peakDemand: z.number().default(100),
  offPeakDemand: z.number().default(50),
  peakHours: z.number().default(8),
  offPeakHours: z.number().default(16),
  peakRate: z.number().default(0.15),
  offPeakRate: z.number().default(0.05),
});

function evaluateAllFormulas(input: Peaking_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.peakDemand * input.peakHours * input.peakRate; results["peakEnergyCost"] = Number.isFinite(v) ? v : 0; } catch { results["peakEnergyCost"] = 0; }
  try { const v = input.offPeakDemand * input.offPeakHours * input.offPeakRate; results["offPeakEnergyCost"] = Number.isFinite(v) ? v : 0; } catch { results["offPeakEnergyCost"] = 0; }
  try { const v = (results["peakEnergyCost"] ?? 0) + (results["offPeakEnergyCost"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculatePeaking_calculator(input: Peaking_calculatorInput): Peaking_calculatorOutput {
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


export interface Peaking_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
