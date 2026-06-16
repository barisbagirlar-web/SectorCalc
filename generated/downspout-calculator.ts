// Auto-generated from downspout-calculator-schema.json
import * as z from 'zod';

export interface Downspout_calculatorInput {
  roofLength: number;
  roofWidth: number;
  rainfallIntensity: number;
  downspoutDiameter: number;
  efficiencyFactor: number;
}

export const Downspout_calculatorInputSchema = z.object({
  roofLength: z.number().default(10),
  roofWidth: z.number().default(10),
  rainfallIntensity: z.number().default(50),
  downspoutDiameter: z.number().default(100),
  efficiencyFactor: z.number().default(85),
});

function evaluateAllFormulas(input: Downspout_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roofWidth * input.roofLength * input.rainfallIntensity / 3600; results["totalFlow"] = Number.isFinite(v) ? v : 0; } catch { results["totalFlow"] = 0; }
  try { const v = (Math.PI * input.efficiencyFactor * input.downspoutDiameter ** 2) / 400000; results["downspoutCapacity"] = Number.isFinite(v) ? v : 0; } catch { results["downspoutCapacity"] = 0; }
  try { const v = Math.ceil((results["totalFlow"] ?? 0) / (results["downspoutCapacity"] ?? 0)); results["numberDownspouts"] = Number.isFinite(v) ? v : 0; } catch { results["numberDownspouts"] = 0; }
  try { const v = (results["totalFlow"] ?? 0) / (results["downspoutCapacity"] ?? 0); results["requiredDownspoutsFloat"] = Number.isFinite(v) ? v : 0; } catch { results["requiredDownspoutsFloat"] = 0; }
  return results;
}


export function calculateDownspout_calculator(input: Downspout_calculatorInput): Downspout_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["numberDownspouts"] ?? 0;
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


export interface Downspout_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
