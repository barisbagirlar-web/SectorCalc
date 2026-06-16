// Auto-generated from strain-calculator-schema.json
import * as z from 'zod';

export interface Strain_calculatorInput {
  initial_length: number;
  final_length: number;
  temperature_change: number;
  cte: number;
  elastic_modulus: number;
}

export const Strain_calculatorInputSchema = z.object({
  initial_length: z.number().default(100),
  final_length: z.number().default(100.5),
  temperature_change: z.number().default(0),
  cte: z.number().default(0.000012),
  elastic_modulus: z.number().default(200),
});

function evaluateAllFormulas(input: Strain_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.final_length - input.initial_length) / input.initial_length) * 100; results["mechStrainPct"] = Number.isFinite(v) ? v : 0; } catch { results["mechStrainPct"] = 0; }
  try { const v = input.cte * input.temperature_change * 100; results["thermStrainPct"] = Number.isFinite(v) ? v : 0; } catch { results["thermStrainPct"] = 0; }
  try { const v = (((input.final_length - input.initial_length) / input.initial_length) + input.cte * input.temperature_change) * 100; results["totalStrainPct"] = Number.isFinite(v) ? v : 0; } catch { results["totalStrainPct"] = 0; }
  try { const v = input.elastic_modulus > 0 ? (((input.final_length - input.initial_length) / input.initial_length) + input.cte * input.temperature_change) * input.elastic_modulus * 1000 : 0; results["stressMpa"] = Number.isFinite(v) ? v : 0; } catch { results["stressMpa"] = 0; }
  return results;
}


export function calculateStrain_calculator(input: Strain_calculatorInput): Strain_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalStrainPct"] ?? 0;
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


export interface Strain_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
