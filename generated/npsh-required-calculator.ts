// Auto-generated from npsh-required-calculator-schema.json
import * as z from 'zod';

export interface Npsh_required_calculatorInput {
  speed: number;
  flowRate: number;
  suctionSpecificSpeed: number;
}

export const Npsh_required_calculatorInputSchema = z.object({
  speed: z.number().default(1750),
  flowRate: z.number().default(500),
  suctionSpecificSpeed: z.number().default(10000),
});

function evaluateAllFormulas(input: Npsh_required_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.pow((input.speed * Math.sqrt(input.flowRate) / input.suctionSpecificSpeed), (4/3)); results["npshFt"] = Number.isFinite(v) ? v : 0; } catch { results["npshFt"] = 0; }
  try { const v = (results["npshFt"] ?? 0) * 0.3048; results["npshM"] = Number.isFinite(v) ? v : 0; } catch { results["npshM"] = 0; }
  try { const v = (results["npshFt"] ?? 0).toFixed(2) + ' ft (US customary)'; results["npshFt_toFixed_2______ft__US_customary__"] = Number.isFinite(v) ? v : 0; } catch { results["npshFt_toFixed_2______ft__US_customary__"] = 0; }
  try { const v = (results["npshM"] ?? 0).toFixed(2) + ' m (metric)'; results["npshM_toFixed_2______m__metric__"] = Number.isFinite(v) ? v : 0; } catch { results["npshM_toFixed_2______m__metric__"] = 0; }
  try { const v = (results["npshM"] ?? 0).toFixed(2) + ' m'; results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculateNpsh_required_calculator(input: Npsh_required_calculatorInput): Npsh_required_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Npsh_required_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
