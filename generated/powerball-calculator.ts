// Auto-generated from powerball-calculator-schema.json
import * as z from 'zod';

export interface Powerball_calculatorInput {
  internalDiameter: number;
  internalLength: number;
  millSpeed: number;
  ballFillingFraction: number;
  ballBulkDensity: number;
  motorEfficiency: number;
}

export const Powerball_calculatorInputSchema = z.object({
  internalDiameter: z.number().default(3.5),
  internalLength: z.number().default(6),
  millSpeed: z.number().default(18),
  ballFillingFraction: z.number().default(0.3),
  ballBulkDensity: z.number().default(4800),
  motorEfficiency: z.number().default(0.95),
});

function evaluateAllFormulas(input: Powerball_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 42.3 / Math.sqrt(input.internalDiameter); results["criticalSpeedRPM"] = Number.isFinite(v) ? v : 0; } catch { results["criticalSpeedRPM"] = 0; }
  try { const v = (input.millSpeed / (42.3 / Math.sqrt(input.internalDiameter))) * 100; results["percentCriticalSpeed"] = Number.isFinite(v) ? v : 0; } catch { results["percentCriticalSpeed"] = 0; }
  try { const v = 10.6 * (input.internalDiameter ** 2.5) * input.internalLength * ((results["percentCriticalSpeed"] ?? 0) / 100) * input.ballFillingFraction * (input.ballBulkDensity / 1000); results["millPowerKW"] = Number.isFinite(v) ? v : 0; } catch { results["millPowerKW"] = 0; }
  try { const v = (results["millPowerKW"] ?? 0) / input.motorEfficiency; results["motorInputPowerKW"] = Number.isFinite(v) ? v : 0; } catch { results["motorInputPowerKW"] = 0; }
  return results;
}


export function calculatePowerball_calculator(input: Powerball_calculatorInput): Powerball_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["criticalSpeedRPM"] ?? 0;
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


export interface Powerball_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
