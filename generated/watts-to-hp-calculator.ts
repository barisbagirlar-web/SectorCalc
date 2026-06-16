// Auto-generated from watts-to-hp-calculator-schema.json
import * as z from 'zod';

export interface Watts_to_hp_calculatorInput {
  powerWatts: number;
  factorMechanical: number;
  factorMetric: number;
  factorElectrical: number;
  factorBoiler: number;
}

export const Watts_to_hp_calculatorInputSchema = z.object({
  powerWatts: z.number().default(1000),
  factorMechanical: z.number().default(745.6998715822702),
  factorMetric: z.number().default(735.49875),
  factorElectrical: z.number().default(746),
  factorBoiler: z.number().default(9809.5),
});

function evaluateAllFormulas(input: Watts_to_hp_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.powerWatts / input.factorMechanical; results["mechanicalHp"] = Number.isFinite(v) ? v : 0; } catch { results["mechanicalHp"] = 0; }
  try { const v = input.powerWatts / input.factorMetric; results["metricHp"] = Number.isFinite(v) ? v : 0; } catch { results["metricHp"] = 0; }
  try { const v = input.powerWatts / input.factorElectrical; results["electricalHp"] = Number.isFinite(v) ? v : 0; } catch { results["electricalHp"] = 0; }
  try { const v = input.powerWatts / input.factorBoiler; results["boilerHp"] = Number.isFinite(v) ? v : 0; } catch { results["boilerHp"] = 0; }
  return results;
}


export function calculateWatts_to_hp_calculator(input: Watts_to_hp_calculatorInput): Watts_to_hp_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["mechanicalHp"] ?? 0;
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


export interface Watts_to_hp_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
