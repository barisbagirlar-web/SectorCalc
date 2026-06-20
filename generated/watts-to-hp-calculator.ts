// Auto-generated from watts-to-hp-calculator-schema.json
import * as z from 'zod';

export interface Watts_to_hp_calculatorInput {
  powerWatts: number;
  factorMechanical: number;
  factorMetric: number;
  factorElectrical: number;
  factorBoiler: number;
  dataConfidence?: number;
}

export const Watts_to_hp_calculatorInputSchema = z.object({
  powerWatts: z.number().default(1000),
  factorMechanical: z.number().default(745.6998715822702),
  factorMetric: z.number().default(735.49875),
  factorElectrical: z.number().default(746),
  factorBoiler: z.number().default(9809.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Watts_to_hp_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.powerWatts / input.factorMechanical; results["mechanicalHp"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mechanicalHp"] = Number.NaN; }
  try { const v = input.powerWatts / input.factorMetric; results["metricHp"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["metricHp"] = Number.NaN; }
  try { const v = input.powerWatts / input.factorElectrical; results["electricalHp"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["electricalHp"] = Number.NaN; }
  try { const v = input.powerWatts / input.factorBoiler; results["boilerHp"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["boilerHp"] = Number.NaN; }
  return results;
}


export function calculateWatts_to_hp_calculator(input: Watts_to_hp_calculatorInput): Watts_to_hp_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["mechanicalHp"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
