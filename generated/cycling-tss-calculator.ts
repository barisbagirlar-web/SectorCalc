// Auto-generated from cycling-tss-calculator-schema.json
import * as z from 'zod';

export interface Cycling_tss_calculatorInput {
  durationMinutes: number;
  normalizedPower: number;
  ftp: number;
  averagePower: number;
}

export const Cycling_tss_calculatorInputSchema = z.object({
  durationMinutes: z.number().default(60),
  normalizedPower: z.number().default(200),
  ftp: z.number().default(250),
  averagePower: z.number().default(0),
});

function evaluateAllFormulas(input: Cycling_tss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.durationMinutes * 60 * input.normalizedPower * (input.normalizedPower / input.ftp)) / (input.ftp * 3600) * 100; results["tss"] = Number.isFinite(v) ? v : 0; } catch { results["tss"] = 0; }
  try { const v = input.normalizedPower / input.ftp; results["intensityFactor"] = Number.isFinite(v) ? v : 0; } catch { results["intensityFactor"] = 0; }
  try { const v = input.averagePower > 0 ? input.normalizedPower / input.averagePower : 0; results["variabilityIndex"] = Number.isFinite(v) ? v : 0; } catch { results["variabilityIndex"] = 0; }
  return results;
}


export function calculateCycling_tss_calculator(input: Cycling_tss_calculatorInput): Cycling_tss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["tss"] ?? 0;
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


export interface Cycling_tss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
