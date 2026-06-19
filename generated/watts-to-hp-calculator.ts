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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Watts_to_hp_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.powerWatts / input.factorMechanical; results["mechanicalHp"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mechanicalHp"] = 0; }
  try { const v = input.powerWatts / input.factorMetric; results["metricHp"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["metricHp"] = 0; }
  try { const v = input.powerWatts / input.factorElectrical; results["electricalHp"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["electricalHp"] = 0; }
  try { const v = input.powerWatts / input.factorBoiler; results["boilerHp"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["boilerHp"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWatts_to_hp_calculator(input: Watts_to_hp_calculatorInput): Watts_to_hp_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["mechanicalHp"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
