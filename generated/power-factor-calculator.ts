// Auto-generated from power-factor-calculator-schema.json
import * as z from 'zod';

export interface Power_factor_calculatorInput {
  realPower: number;
  apparentPower: number;
  voltage: number;
  current: number;
}

export const Power_factor_calculatorInputSchema = z.object({
  realPower: z.number().default(100),
  apparentPower: z.number().default(125),
  voltage: z.number().default(400),
  current: z.number().default(0),
});

function evaluateAllFormulas(input: Power_factor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.realPower / input.apparentPower; results["powerFactor"] = Number.isFinite(v) ? v : 0; } catch { results["powerFactor"] = 0; }
  try { const v = Math.sqrt(Math.max(input.apparentPower ** 2 - input.realPower ** 2, 0)); results["reactivePower"] = Number.isFinite(v) ? v : 0; } catch { results["reactivePower"] = 0; }
  try { const v = (Math.acos(input.realPower / input.apparentPower) * 180) / Math.PI; results["phaseAngle"] = Number.isFinite(v) ? v : 0; } catch { results["phaseAngle"] = 0; }
  try { const v = (input.voltage * input.current) / 1000; results["apparentPowerFromVI"] = Number.isFinite(v) ? v : 0; } catch { results["apparentPowerFromVI"] = 0; }
  return results;
}


export function calculatePower_factor_calculator(input: Power_factor_calculatorInput): Power_factor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["powerFactor"] ?? 0;
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


export interface Power_factor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
