// Auto-generated from cubic-yards-to-cubic-meters-calculator-schema.json
import * as z from 'zod';

export interface Cubic_yards_to_cubic_meters_calculatorInput {
  length: number;
  width: number;
  height: number;
  cubicYards: number;
  decimalPlaces: number;
  conversionConstant: number;
}

export const Cubic_yards_to_cubic_meters_calculatorInputSchema = z.object({
  length: z.number().default(1),
  width: z.number().default(1),
  height: z.number().default(1),
  cubicYards: z.number().default(0),
  decimalPlaces: z.number().default(2),
  conversionConstant: z.number().default(0.764554857992),
});

function evaluateAllFormulas(input: Cubic_yards_to_cubic_meters_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = `${((input.cubicYards || (input.length * input.width * input.height)) * input.conversionConstant).toFixed(input.decimalPlaces)} m³`; results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = `Volume in cubic yards: ${(input.cubicYards || (input.length * input.width * input.height)).toFixed(4)} yd³`; results["breakdown_0"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown_0"] = 0; }
  try { const v = `Conversion factor: ${input.conversionConstant} m³/yd³`; results["breakdown_1"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown_1"] = 0; }
  try { const v = `Raw conversion: ${((input.cubicYards || (input.length * input.width * input.height)) * input.conversionConstant).toFixed(6)} m³`; results["breakdown_2"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown_2"] = 0; }
  try { const v = `Final rounded: ${((input.cubicYards || (input.length * input.width * input.height)) * input.conversionConstant).toFixed(input.decimalPlaces)} m³`; results["breakdown_3"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown_3"] = 0; }
  return results;
}


export function calculateCubic_yards_to_cubic_meters_calculator(input: Cubic_yards_to_cubic_meters_calculatorInput): Cubic_yards_to_cubic_meters_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary"] ?? 0;
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


export interface Cubic_yards_to_cubic_meters_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
