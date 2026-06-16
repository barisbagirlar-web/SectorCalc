// Auto-generated from single-phase-calculator-schema.json
import * as z from 'zod';

export interface Single_phase_calculatorInput {
  voltage: number;
  current: number;
  powerFactor: number;
  time: number;
}

export const Single_phase_calculatorInputSchema = z.object({
  voltage: z.number().default(230),
  current: z.number().default(10),
  powerFactor: z.number().default(0.9),
  time: z.number().default(1),
});

function evaluateAllFormulas(input: Single_phase_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.voltage * input.current * input.powerFactor; results["power"] = Number.isFinite(v) ? v : 0; } catch { results["power"] = 0; }
  try { const v = input.voltage * input.current; results["apparentPower"] = Number.isFinite(v) ? v : 0; } catch { results["apparentPower"] = 0; }
  try { const v = input.voltage * input.current * Math.sin(Math.acos(input.powerFactor)); results["reactivePower"] = Number.isFinite(v) ? v : 0; } catch { results["reactivePower"] = 0; }
  try { const v = input.voltage * input.current * input.powerFactor * input.time / 1000; results["energy"] = Number.isFinite(v) ? v : 0; } catch { results["energy"] = 0; }
  return results;
}


export function calculateSingle_phase_calculator(input: Single_phase_calculatorInput): Single_phase_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["power"] ?? 0;
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


export interface Single_phase_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
