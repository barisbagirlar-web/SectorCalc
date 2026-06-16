// Auto-generated from load-calculator-schema.json
import * as z from 'zod';

export interface Load_calculatorInput {
  voltage: number;
  current: number;
  powerFactor: number;
  phaseCount: number;
  efficiency: number;
}

export const Load_calculatorInputSchema = z.object({
  voltage: z.number().default(230),
  current: z.number().default(10),
  powerFactor: z.number().default(0.9),
  phaseCount: z.number().default(3),
  efficiency: z.number().default(95),
});

function evaluateAllFormulas(input: Load_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.phaseCount === 1 ? input.voltage * input.current : input.phaseCount === 3 ? input.voltage * input.current * Math.sqrt(3) : 0; results["apparentPower"] = Number.isFinite(v) ? v : 0; } catch { results["apparentPower"] = 0; }
  try { const v = (results["apparentPower"] ?? 0) * input.powerFactor; results["activePower"] = Number.isFinite(v) ? v : 0; } catch { results["activePower"] = 0; }
  try { const v = (results["apparentPower"] ?? 0) * Math.sin(Math.acos(input.powerFactor)); results["reactivePower"] = Number.isFinite(v) ? v : 0; } catch { results["reactivePower"] = 0; }
  try { const v = (results["activePower"] ?? 0) * (input.efficiency / 100); results["outputPower"] = Number.isFinite(v) ? v : 0; } catch { results["outputPower"] = 0; }
  return results;
}


export function calculateLoad_calculator(input: Load_calculatorInput): Load_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["apparentPower"] ?? 0;
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


export interface Load_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
