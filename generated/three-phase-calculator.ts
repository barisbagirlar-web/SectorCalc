// Auto-generated from three-phase-calculator-schema.json
import * as z from 'zod';

export interface Three_phase_calculatorInput {
  voltage: number;
  current: number;
  powerFactor: number;
  voltageType: number;
}

export const Three_phase_calculatorInputSchema = z.object({
  voltage: z.number().default(400),
  current: z.number().default(10),
  powerFactor: z.number().default(0.85),
  voltageType: z.number().default(1),
});

function evaluateAllFormulas(input: Three_phase_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.voltageType == 1 ? (Math.sqrt(3) * input.voltage * input.current * input.powerFactor / 1000) : (3 * input.voltage * input.current * input.powerFactor / 1000); results["realPower"] = Number.isFinite(v) ? v : 0; } catch { results["realPower"] = 0; }
  try { const v = input.voltageType == 1 ? (Math.sqrt(3) * input.voltage * input.current / 1000) : (3 * input.voltage * input.current / 1000); results["apparentPower"] = Number.isFinite(v) ? v : 0; } catch { results["apparentPower"] = 0; }
  try { const v = (results["apparentPower"] ?? 0) * Math.sin(Math.acos(input.powerFactor)); results["reactivePower"] = Number.isFinite(v) ? v : 0; } catch { results["reactivePower"] = 0; }
  return results;
}


export function calculateThree_phase_calculator(input: Three_phase_calculatorInput): Three_phase_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["realPower"] ?? 0;
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


export interface Three_phase_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
