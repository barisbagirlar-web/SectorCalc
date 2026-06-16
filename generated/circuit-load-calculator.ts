// Auto-generated from circuit-load-calculator-schema.json
import * as z from 'zod';

export interface Circuit_load_calculatorInput {
  voltage: number;
  currentPerDevice: number;
  powerFactor: number;
  numberOfDevices: number;
  safetyFactor: number;
  breakerRating: number;
}

export const Circuit_load_calculatorInputSchema = z.object({
  voltage: z.number().default(230),
  currentPerDevice: z.number().default(1),
  powerFactor: z.number().default(0.8),
  numberOfDevices: z.number().default(1),
  safetyFactor: z.number().default(1.25),
  breakerRating: z.number().default(16),
});

function evaluateAllFormulas(input: Circuit_load_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfDevices * input.currentPerDevice * input.safetyFactor; results["totalCurrent"] = Number.isFinite(v) ? v : 0; } catch { results["totalCurrent"] = 0; }
  try { const v = input.voltage * (results["totalCurrent"] ?? 0); results["totalApparentPower"] = Number.isFinite(v) ? v : 0; } catch { results["totalApparentPower"] = 0; }
  try { const v = (results["totalApparentPower"] ?? 0) * input.powerFactor; results["totalRealPower"] = Number.isFinite(v) ? v : 0; } catch { results["totalRealPower"] = 0; }
  try { const v = input.breakerRating > 0 ? ((results["totalCurrent"] ?? 0) / input.breakerRating * 100) : null; results["loadPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["loadPercentage"] = 0; }
  return results;
}


export function calculateCircuit_load_calculator(input: Circuit_load_calculatorInput): Circuit_load_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalRealPower"] ?? 0;
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


export interface Circuit_load_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
